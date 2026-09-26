import { Category } from '@/types/database';
import { MOCK_CATEGORIES } from '../mockData';
import { createClient } from '../supabase/client';

export class CategoryRepository {
  static async getAll(): Promise<Category[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return MOCK_CATEGORIES;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return MOCK_CATEGORIES;
    return data as Category[];
  }

  static async create(categoryData: Partial<Category>): Promise<Category | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const newCategory: Category = {
        id: `c1000000-0000-0000-0000-${Date.now()}`,
        name: categoryData.name || 'New Category',
        slug: categoryData.slug || `cat-${Date.now()}`,
        description: categoryData.description || null,
        image_url: categoryData.image_url || null,
        is_active: categoryData.is_active ?? true,
        sort_order: categoryData.sort_order || MOCK_CATEGORIES.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_CATEGORIES.push(newCategory);
      return newCategory;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data as Category;
  }

  static async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const cat = MOCK_CATEGORIES.find((c) => c.id === id);
      if (cat) {
        Object.assign(cat, updates, { updated_at: new Date().toISOString() });
        return cat;
      }
      return null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return data as Category;
  }
}
