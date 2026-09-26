import React from 'react';
import Link from 'next/link';
import { ProductRepository } from '@/lib/repositories/products';
import { ProductCard } from '@/components/ProductCard';
import { Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'featured';
    inStock?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categorySlug = params.category || 'all';
  const searchQuery = params.q || '';
  const sortBy = params.sort || 'featured';
  const inStockOnly = params.inStock === 'true';

  const categories = await ProductRepository.getAllCategories();
  const products = await ProductRepository.getActiveProducts({
    categorySlug,
    searchQuery,
    sortBy,
    inStockOnly,
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-graphite-1 border border-border-line p-6 rounded-2xl">
        <div>
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            EQUIPMENT CATALOGUE
          </span>
          <h1 className="font-sans font-bold text-3xl text-on-surface">Storefront Catalogue</h1>
          <p className="font-sans text-xs text-slate mt-1">
            Showing {products.length} calibrated gadget accessories
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="font-mono text-xs text-slate flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Sort:
          </label>
          <form method="GET" action="/products" className="inline-block">
            {categorySlug !== 'all' && <input type="hidden" name="category" value={categorySlug} />}
            {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
            <select
              name="sort"
              id="sort-select"
              defaultValue={sortBy}
              className="bg-graphite-2 border border-border-line rounded-lg px-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </form>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/products"
          className={`px-5 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-colors ${
            categorySlug === 'all'
              ? 'bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(47,111,255,0.2)]'
              : 'bg-graphite-2 text-on-surface-variant border border-border-line hover:border-primary'
          }`}
        >
          All Equipment ({products.length})
        </Link>
        {categories.map((cat) => {
          const isActive = categorySlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}`}
              className={`px-5 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(47,111,255,0.2)]'
                  : 'bg-graphite-2 text-on-surface-variant border border-border-line hover:border-primary'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Products Grid / Empty State */}
      {products.length === 0 ? (
        <div className="bg-graphite-2 border border-border-line rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 my-8">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-slate">
            <PackageSearch className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-sans font-bold text-lg text-on-surface">No Products Found</h3>
          <p className="font-sans text-xs text-slate max-w-md">
            No gadget accessories matched your active filters or category selection. Try resetting your search query or selecting a different category.
          </p>
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-semibold hover:bg-secondary-container transition-colors mt-2"
          >
            Reset All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
