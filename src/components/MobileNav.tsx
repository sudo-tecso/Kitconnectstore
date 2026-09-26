'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container rounded-t-xl border-t border-border-line px-4 py-2 flex items-center justify-around shadow-2xl backdrop-blur-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 ${
          isActive('/') ? 'text-primary' : 'text-slate hover:text-on-surface'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="font-mono text-[10px]">Home</span>
      </Link>

      <Link
        href="/products"
        className={`flex flex-col items-center gap-1 ${
          isActive('/products') ? 'text-primary' : 'text-slate hover:text-on-surface'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="font-mono text-[10px]">Catalogue</span>
      </Link>

      <Link
        href="/search"
        className={`flex flex-col items-center gap-1 ${
          isActive('/search') ? 'text-primary' : 'text-slate hover:text-on-surface'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="font-mono text-[10px]">Search</span>
      </Link>

      <Link
        href="/cart"
        className={`relative flex flex-col items-center gap-1 ${
          isActive('/cart') ? 'text-primary' : 'text-slate hover:text-on-surface'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 right-1 font-mono text-[9px] bg-primary text-on-primary font-bold px-1 rounded-full">
            {totalItems}
          </span>
        )}
        <span className="font-mono text-[10px]">Cart</span>
      </Link>

      <Link
        href="/order-tracking"
        className={`flex flex-col items-center gap-1 ${
          isActive('/order-tracking') ? 'text-primary' : 'text-slate hover:text-on-surface'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span className="font-mono text-[10px]">Track</span>
      </Link>
    </div>
  );
};
