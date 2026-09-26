import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { ProductRepository } from '@/lib/repositories/products';
import { ProductCard } from '@/components/ProductCard';
import { TraceLine } from '@/components/TraceLine';

export default async function HomePage() {
  const products = await ProductRepository.getActiveProducts({ sortBy: 'featured' });
  const categories = await ProductRepository.getAllCategories();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl bg-graphite-1 border border-border-line overflow-hidden p-6 md:p-12 glass-card">
        {/* Ambient Glow Backdrop */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-border-line font-mono text-xs text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TACTILE DARK MODE • CALIBRATED ACCESSORIES</span>
            </div>

            <h1 className="font-sans font-bold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
              Electronic Precision for Your Mobile Workspace
            </h1>

            <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xl">
              Laboratory-tested GaN chargers, heavy-duty Kevlar braided cables, and precision magnetic desktop mounts designed for demanding power workflows.
            </p>

            <TraceLine className="my-2" />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-sans text-sm font-semibold hover:bg-secondary-container transition-colors shadow-lg flex items-center gap-2"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/order-tracking"
                className="px-5 py-3 rounded-xl bg-transparent border border-border-line text-on-surface font-sans text-sm font-semibold hover:border-primary transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Track Order</span>
              </Link>
            </div>
          </div>

          {/* Hero Feature Component Card */}
          <div className="lg:col-span-5 flex justify-center">
            {featuredProducts.length > 0 && (
              <div className="w-full max-w-sm">
                <div className="font-mono text-[10px] text-slate uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                  FEATURED HARDWARE SPEC
                </div>
                <ProductCard product={featuredProducts[0]} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Spec Ticker Bar */}
      <section className="bg-surface-container rounded-xl border border-border-line p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center gap-1 border-r border-border-line/40 last:border-r-0">
          <Zap className="w-4 h-4 text-primary mb-1" />
          <span className="font-mono text-xs font-bold text-on-surface">65W-100W GaN PD</span>
          <span className="font-mono text-[10px] text-slate">Thermal Calibrated</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-border-line/40 last:border-r-0">
          <Layers className="w-4 h-4 text-primary mb-1" />
          <span className="font-mono text-xs font-bold text-on-surface">30,000+ Bend Rating</span>
          <span className="font-mono text-[10px] text-slate">Kevlar Braided Wire</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-border-line/40 last:border-r-0">
          <Cpu className="w-4 h-4 text-primary mb-1" />
          <span className="font-mono text-xs font-bold text-on-surface">Smart E-Marker</span>
          <span className="font-mono text-[10px] text-slate">Voltage Protection</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-primary mb-1" />
          <span className="font-mono text-xs font-bold text-on-surface">COD & MoMo</span>
          <span className="font-mono text-[10px] text-slate">OTP Delivery Guard</span>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-primary uppercase tracking-widest">
              COLLECTION MATRIX
            </span>
            <h2 className="font-sans font-bold text-2xl text-on-surface">Hardware Categories</h2>
          </div>
          <Link
            href="/products"
            className="font-sans text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="bg-graphite-2 rounded-xl border border-border-line p-5 glow-hover transition-all flex flex-col justify-between group h-36"
            >
              <div>
                <span className="font-mono text-[10px] text-slate uppercase tracking-wider">
                  CATEGORY
                </span>
                <h3 className="font-sans font-bold text-lg text-on-surface group-hover:text-primary transition-colors mt-1">
                  {cat.name}
                </h3>
              </div>
              <div className="flex items-center justify-between font-mono text-xs text-slate">
                <span>Explore Specs</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-primary uppercase tracking-widest">
              HIGH PERFORMANCE CATALOGUE
            </span>
            <h2 className="font-sans font-bold text-2xl text-on-surface">Featured Equipment</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Link
              href="/products"
              className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-sans text-xs font-semibold shadow-[0_0_15px_rgba(47,111,255,0.2)] whitespace-nowrap"
            >
              All Kits
            </Link>
            {categories.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="bg-graphite-2 text-on-surface-variant border border-border-line px-4 py-1.5 rounded-full font-sans text-xs font-semibold hover:border-primary transition-colors whitespace-nowrap"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
