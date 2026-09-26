'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, ShieldCheck, Cpu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const role =
        user?.app_metadata?.role ?? user?.user_metadata?.role ?? null;
      setIsAdmin(role === 'admin');
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 h-16 bg-surface-container-low border-b-2 border-primary shadow-[0_0_8px_rgba(180,197,255,0.3)] backdrop-blur-md px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-border-line flex items-center justify-center group-hover:border-primary transition-colors">
          <Cpu className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-on-surface flex items-center gap-1.5">
            KITCONNECT
            <span className="w-2 h-2 rounded-full bg-primary pulse-glow inline-block" />
          </span>
          <span className="font-mono text-[10px] text-slate uppercase tracking-widest -mt-1">
            ELECTRONIC PRECISION
          </span>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className={`font-sans text-sm font-semibold transition-colors hover:text-primary ${
            isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant'
          }`}
        >
          Home
        </Link>
        <Link
          href="/products"
          className={`font-sans text-sm font-semibold transition-colors hover:text-primary ${
            isActive('/products') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant'
          }`}
        >
          Catalogue
        </Link>
        <Link
          href="/search"
          className={`font-sans text-sm font-semibold transition-colors hover:text-primary ${
            isActive('/search') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant'
          }`}
        >
          Search
        </Link>
        <Link
          href="/order-tracking"
          className={`font-sans text-sm font-semibold transition-colors hover:text-primary flex items-center gap-1 ${
            isActive('/order-tracking') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-primary" />
          Track Order
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="font-mono text-xs text-slate hover:text-primary border border-border-line px-2.5 py-1 rounded-md transition-colors"
          >
            ADMIN
          </Link>
        )}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/search"
          aria-label="Search Catalogue"
          className="w-9 h-9 rounded-xl bg-graphite-2 border border-border-line flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
        >
          <Search className="w-4 h-4" />
        </Link>

        <Link
          href="/cart"
          aria-label="Shopping Cart"
          className="relative px-3.5 py-2 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-semibold hover:bg-secondary-container transition-colors flex items-center gap-2 shadow-lg"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="font-mono text-xs font-bold bg-on-primary-container text-primary px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
