import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductRepository } from '@/lib/repositories/products';
import { ProductCard } from '@/components/ProductCard';
import { TraceLine } from '@/components/TraceLine';
import { ShoppingBag, ShieldCheck, Zap, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AddToCartForm } from './AddToCartForm';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await ProductRepository.getProductBySlugOrId(id);

  if (!product) {
    return (
      <div className="bg-graphite-2 border border-border-line rounded-2xl p-12 text-center my-12 flex flex-col items-center gap-4">
        <h2 className="font-bold text-2xl text-on-surface">Product Not Found</h2>
        <p className="font-sans text-xs text-slate">The requested hardware specification could not be located in our catalogue.</p>
        <Link href="/products" className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-semibold">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const allProducts = await ProductRepository.getActiveProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0].image_url
      : 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80';

  const stockQty = product.inventory
    ? product.inventory.quantity - product.inventory.reserved_quantity
    : 10;
  const isLowStock = stockQty > 0 && stockQty <= (product.inventory?.low_stock_threshold || 5);
  const isOutOfStock = stockQty <= 0;

  return (
    <div className="flex flex-col gap-12">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/products"
          className="font-mono text-xs text-slate hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </Link>
        <span className="text-border-line">•</span>
        <span className="font-mono text-xs text-slate line-clamp-1">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative h-96 w-full bg-surface-container rounded-2xl border border-border-line p-6 flex items-center justify-center overflow-hidden glass-card">
            {/* Backlit Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,111,255,0.2)_0%,transparent_75%)]" />

            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 relative z-10"
              priority
            />

            <div className="absolute top-4 right-4 z-20">
              {isOutOfStock ? (
                <span className="font-mono text-xs bg-red-950/80 text-red-400 border border-red-800 px-3 py-1 rounded-full uppercase">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="font-mono text-xs bg-amber-950/80 text-amber-300 border border-amber-800 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Low Stock ({stockQty} remaining)
                </span>
              ) : (
                <span className="font-mono text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({stockQty} available)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Specification & Add to Cart */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-graphite-2 p-6 md:p-8 rounded-2xl border border-border-line">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-primary uppercase tracking-widest">
                SKU: {product.sku}
              </span>
              {product.brand && (
                <span className="font-mono text-xs text-slate bg-graphite-1 border border-border-line px-2.5 py-0.5 rounded-md">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="font-sans font-bold text-2xl md:text-3xl text-on-surface leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 my-4">
              <span className="font-mono text-3xl font-bold text-primary">
                GHS {product.price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="font-mono text-sm text-slate line-through">
                  GHS {product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              {product.description || product.short_description}
            </p>
          </div>

          <TraceLine />

          {/* Add to Cart Form Client Component */}
          <AddToCartForm product={product} isOutOfStock={isOutOfStock} maxStock={stockQty} />

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-line font-mono text-xs text-slate">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Fast Regional Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>OTP Delivery Code Guard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="bg-graphite-2 rounded-2xl border border-border-line p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-mono text-sm text-primary uppercase tracking-widest">
              CALIBRATED TECHNICAL SPECIFICATIONS
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <tbody>
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <tr
                    key={key}
                    className={idx % 2 === 0 ? 'bg-surface-container-low/50' : 'bg-transparent'}
                  >
                    <td className="py-3 px-4 text-slate border-b border-border-line/40 w-1/3">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-on-surface border-b border-border-line/40 font-semibold">
                      {val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related Products Carousel/Grid */}
      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="font-sans font-bold text-xl text-on-surface">Related Equipment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
