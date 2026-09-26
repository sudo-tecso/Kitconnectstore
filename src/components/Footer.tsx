import React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Zap, Truck, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-low border-t border-border-line mt-20 pb-20 md:pb-12 pt-12 px-4 md:px-8 text-on-surface-variant">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-container-high border border-border-line flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg text-on-surface tracking-tight">KITCONNECT</span>
          </div>
          <p className="font-sans text-xs text-slate leading-relaxed">
            High-performance gadget accessories laboratory aesthetic with calibrated electronic precision.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-primary bg-graphite-2 px-3 py-1.5 rounded-lg border border-border-line w-fit">
            <span className="w-2 h-2 rounded-full bg-primary pulse-glow" />
            SYSTEM CALIBRATED: VER 1.0 MVP
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs text-outline uppercase tracking-wider">Storefront</h4>
          <Link href="/products" className="font-sans text-sm text-slate hover:text-primary transition-colors">
            All Products
          </Link>
          <Link href="/products?category=power-chargers" className="font-sans text-sm text-slate hover:text-primary transition-colors">
            Power & Chargers
          </Link>
          <Link href="/products?category=cables-adapters" className="font-sans text-sm text-slate hover:text-primary transition-colors">
            Cables & Adapters
          </Link>
          <Link href="/products?category=audio-acoustics" className="font-sans text-sm text-slate hover:text-primary transition-colors">
            Audio & Acoustics
          </Link>
        </div>

        {/* Customer Care & Security */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs text-outline uppercase tracking-wider">Customer Support</h4>
          <Link href="/order-tracking" className="font-sans text-sm text-slate hover:text-primary transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Track Order Status
          </Link>
          <Link href="/cart" className="font-sans text-sm text-slate hover:text-primary transition-colors">
            Cart & Checkout
          </Link>
          <div className="font-mono text-xs text-slate mt-2 flex flex-col gap-1">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-primary" /> Fast Regional Dispatch</span>
            <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-primary" /> COD & Mobile Money (MoMo)</span>
          </div>
        </div>

        {/* Technical Specs Ticker */}
        <div className="flex flex-col gap-3 bg-graphite-2 p-4 rounded-xl border border-border-line">
          <h4 className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> SPECIFICATION GUARANTEE
          </h4>
          <p className="font-sans text-xs text-slate leading-relaxed">
            All hardware accessories undergo strict thermal, voltage, and durability testing before dispatch.
          </p>
          <span className="font-mono text-[10px] text-slate-dim">
            LAB ID: KC-SPEC-2026
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-6 border-t border-border-line flex flex-col md:flex-row items-center justify-between text-xs text-slate-dim font-mono gap-4">
        <span>© 2026 KITCONNECT GADGET ACCESSORIES. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-primary transition-colors">ADMIN PORTAL</Link>
          <span>•</span>
          <span>ELECTRONIC PRECISION UI</span>
        </div>
      </div>
    </footer>
  );
};
