import React from 'react';
import Link from 'next/link';
import { CategoryRepository } from '@/lib/repositories/categories';
import { Layers, Plus, ArrowLeft, ShieldCheck } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const categories = await CategoryRepository.getAll();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-graphite-1 border border-border-line p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="font-mono text-xs text-slate hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <span className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> CATEGORY MANAGEMENT
          </span>
          <h1 className="font-sans font-bold text-2xl text-on-surface">Storefront Categories</h1>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-graphite-2 rounded-2xl border border-border-line p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs text-primary uppercase tracking-widest">
            ACTIVE CATEGORIES ({categories.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border-line text-slate">
                <th className="py-3 px-4">SORT</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">SLUG</th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border-line/40 hover:bg-surface-container/30">
                  <td className="py-3 px-4 font-bold text-primary">{cat.sort_order}</td>
                  <td className="py-3 px-4 text-on-surface font-bold">{cat.name}</td>
                  <td className="py-3 px-4 text-slate">{cat.slug}</td>
                  <td className="py-3 px-4 text-slate line-clamp-1 max-w-xs">
                    {cat.description || '—'}
                  </td>
                  <td className="py-3 px-4">
                    {cat.is_active ? (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] uppercase">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[10px] uppercase">
                        INACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
