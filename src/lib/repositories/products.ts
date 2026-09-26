import { Product, Category } from '@/types/database';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../mockData';
import { createClient } from '../supabase/client';

export class ProductRepository {
  static async getActiveProducts(params?: {
    categorySlug?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'featured';
  }): Promise<Product[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Use mock data ONLY if Supabase is not configured or in dev fallback mode
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      let filtered = [...MOCK_PRODUCTS].filter((p) => p.is_active);

      if (params?.categorySlug && params.categorySlug !== 'all') {
        filtered = filtered.filter((p) => p.category?.slug === params.categorySlug);
      }

      if (params?.searchQuery) {
        const q = params.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.short_description?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q)
        );
      }

      if (params?.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= params.minPrice!);
      }

      if (params?.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= params.maxPrice!);
      }

      if (params?.inStockOnly) {
        filtered = filtered.filter(
          (p) => (p.inventory ? p.inventory.quantity - p.inventory.reserved_quantity > 0 : true)
        );
      }

      if (params?.sortBy) {
        if (params.sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        if (params.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        if (params.sortBy === 'newest')
          filtered.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        if (params.sortBy === 'featured')
          filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      }

      return filtered;
    }

    // Direct Supabase Database Query
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*), inventory:inventory(*)')
      .eq('is_active', true);

    if (params?.categorySlug && params.categorySlug !== 'all') {
      query = query.eq('categories.slug', params.categorySlug);
    }

    if (params?.searchQuery) {
      query = query.or(
        `name.ilike.%${params.searchQuery}%,sku.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`
      );
    }

    if (params?.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }
    if (params?.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }

    if (params?.sortBy === 'price-asc') query = query.order('price', { ascending: true });
    else if (params?.sortBy === 'price-desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return MOCK_PRODUCTS;
    }

    return (data as Product[]) || [];
  }

  static async getProductBySlugOrId(identifier: string): Promise<Product | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return (
        MOCK_PRODUCTS.find((p) => p.slug === identifier || p.id === identifier) || null
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*), inventory:inventory(*)')
      .or(`slug.eq.${identifier},id.eq.${identifier}`)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((p) => p.slug === identifier || p.id === identifier) || null;
    }

    return data as Product;
  }

  static async getAllCategories(): Promise<Category[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return MOCK_CATEGORIES;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return MOCK_CATEGORIES;
    }

    return data as Category[];
  }
}
