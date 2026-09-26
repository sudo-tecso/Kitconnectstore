import React from 'react';
import Link from 'next/link';
import { ProductRepository } from '@/lib/repositories/products';
import { ProductCard } from '@/components/ProductCard';
import { Search, PackageSearch, Sparkles } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const categorySlug = params.category || 'all';

  const products = await ProductRepository.getActiveProducts({
    searchQuery: query,
    categorySlug,
  });

  const SUGGESTIONS = ['GaN Charger', '100W Cable', 'Power Bank', 'ANC Earbuds', 'MagHold Stand', '7-in-1 Hub'];

  return (
    <div className="flex flex-col gap-8">
      {/* Search Header Banner */}
      <div className="bg-graphite-1 border border-border-line p-6 md:p-8 rounded-2xl flex flex-col gap-6 glass-card">
        <div>
          <span className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> SEARCH CATALOGUE MATRIX
          </span>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-on-surface">
            Hardware & Accessory Search
          </h1>
        </div>

        {/* Search Input Form */}
        <form method="GET" action="/search" className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by product name, SKU (e.g. KC-CHG-65W), brand, or spec..."
              className="w-full bg-graphite-2 border border-border-line rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-semibold hover:bg-secondary-container transition-colors shadow-lg"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestion Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate uppercase">Quick Specs:</span>
          {SUGGESTIONS.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="font-mono text-xs bg-graphite-2 text-on-surface-variant border border-border-line px-3 py-1 rounded-full hover:border-primary transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between font-mono text-xs text-slate border-b border-border-line pb-3">
          <span>
            Search results for <strong className="text-primary font-mono">&quot;{query}&quot;</strong>
          </span>
          <span>{products.length} Items Found</span>
        </div>
      )}

      {/* Products Grid / Empty State */}
      {products.length === 0 ? (
        <div className="bg-graphite-2 border border-border-line rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 my-6">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
            <PackageSearch className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-sans font-bold text-lg text-on-surface">No Matching Equipment Found</h3>
          <p className="font-sans text-xs text-slate max-w-md">
            We couldn&apos;t find any gadget accessories matching &quot;{query}&quot;. Try searching for broader terms like &quot;GaN&quot;, &quot;Power Bank&quot;, or &quot;Cable&quot;.
          </p>
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-semibold hover:bg-secondary-container transition-colors mt-2"
          >
            Browse Full Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
