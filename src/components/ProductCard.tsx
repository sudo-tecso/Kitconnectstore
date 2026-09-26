'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary)?.image_url || product.images[0].image_url
      : 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80';

  const stockQty = product.inventory
    ? product.inventory.quantity - product.inventory.reserved_quantity
    : 10;
  const isLowStock = stockQty > 0 && stockQty <= (product.inventory?.low_stock_threshold || 5);
  const isOutOfStock = stockQty <= 0;

  return (
    <div className="bg-graphite-2 rounded-xl border border-border-line overflow-hidden glow-hover transition-all group flex flex-col justify-between p-4">
      <div>
        {/* Backlit Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative h-52 w-full bg-surface-container rounded-lg p-4 flex items-center justify-center overflow-hidden mb-4 group-hover:bg-surface-container-high transition-colors">
            {/* Radial Backlit Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,111,255,0.15)_0%,transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity" />

            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 relative z-10"
            />

            {/* Stock Badge */}
            <div className="absolute top-2.5 right-2.5 z-20">
              {isOutOfStock ? (
                <span className="font-mono text-[10px] bg-red-950/80 text-red-400 border border-red-800 px-2 py-0.5 rounded-full uppercase">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="font-mono text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Low Stock ({stockQty})
                </span>
              ) : (
                <span className="font-mono text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  In Stock
                </span>
              )}
            </div>

            {product.brand && (
              <div className="absolute bottom-2.5 left-2.5 z-20 font-mono text-[10px] text-slate bg-graphite-1/80 border border-border-line px-2 py-0.5 rounded-md">
                {product.brand}
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <Link href={`/products/${product.slug}`} className="block group">
          <h3 className="font-sans font-bold text-base text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-on-surface-variant line-clamp-2 my-1.5 leading-relaxed">
            {product.short_description || product.description}
          </p>
        </Link>
      </div>

      {/* Footer Price & Cart CTA */}
      <div className="pt-3 mt-2 border-t border-border-line/60 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-mono text-base font-bold text-primary">
            GHS {product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="font-mono text-xs text-slate line-through">
              GHS {product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={isOutOfStock}
          className={`px-3 py-2 rounded-xl font-sans text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isOutOfStock
              ? 'bg-surface-container text-slate border border-border-line cursor-not-allowed'
              : 'bg-transparent border border-border-line text-on-surface hover:border-primary hover:text-primary'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
