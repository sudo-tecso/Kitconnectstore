'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { TraceLine } from '@/components/TraceLine';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-graphite-2 border border-border-line rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 my-12">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-sans font-bold text-2xl text-on-surface">Your Shopping Cart is Empty</h2>
        <p className="font-sans text-xs text-slate max-w-sm">
          No hardware items have been added to your cart yet. Explore our electronic precision catalogue to start shopping.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-bold hover:bg-secondary-container transition-colors mt-2"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-graphite-1 border border-border-line p-6 rounded-2xl flex flex-col gap-1">
        <span className="font-mono text-xs text-primary uppercase tracking-widest">
          SHOPPING CART MATRIX
        </span>
        <h1 className="font-sans font-bold text-2xl text-on-surface">Cart Equipment Review</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {items.map(({ product, quantity }) => {
            const primaryImg =
              product.images && product.images.length > 0
                ? product.images[0].image_url
                : 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product.id}
                className="bg-graphite-2 rounded-xl border border-border-line p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Thumbnail & Product Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 bg-surface-container rounded-lg p-2 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={primaryImg}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate uppercase">SKU: {product.sku}</span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-sans font-bold text-sm text-on-surface hover:text-primary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <span className="font-mono text-xs font-bold text-primary mt-1">
                      GHS {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border-line/40 pt-3 sm:pt-0">
                  <div className="flex items-center border border-border-line rounded-lg bg-graphite-1 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-slate hover:text-on-surface transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-on-surface px-3">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-slate hover:text-on-surface transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-on-surface min-w-[5rem] text-right">
                      GHS {(product.price * quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="p-2 text-slate hover:text-red-400 transition-colors"
                      aria-label="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-4 bg-graphite-2 p-6 rounded-2xl border border-border-line flex flex-col gap-4 sticky top-20">
          <h3 className="font-mono text-xs text-primary uppercase tracking-widest">
            ORDER SUMMARY
          </h3>

          <div className="flex flex-col gap-2 font-mono text-xs border-b border-border-line pb-4">
            <div className="flex justify-between text-slate">
              <span>Subtotal:</span>
              <span className="text-on-surface">GHS {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate">
              <span>Delivery Fee:</span>
              <span className="text-on-surface">
                {deliveryFee === 0 ? 'FREE' : `GHS ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline font-mono text-sm font-bold">
            <span className="text-on-surface">Estimated Total:</span>
            <span className="text-primary text-xl">GHS {total.toFixed(2)}</span>
          </div>

          <TraceLine />

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-sm font-bold hover:bg-secondary-container transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Proceed to Guest Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] text-slate justify-center pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Secure COD & Mobile Money Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
