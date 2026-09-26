'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Search, Truck, Clock, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { OrderStatus } from '@/types/database';

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; description: string }> = [
  { key: 'PENDING', label: 'Order Placed', description: 'Order created and registered' },
  { key: 'CONFIRMED', label: 'Confirmed', description: 'Order details verified' },
  { key: 'PROCESSING', label: 'Processing', description: 'Hardware packaged and calibrated' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Dispatch', description: 'Staged for regional courier' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Courier en route to address' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Recipient OTP verified & fulfilled' },
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();

  const [orderRef, setOrderRef] = useState(searchParams.get('ref') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');

  const [orderData, setOrderData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrder = async (refVal: string, phoneVal: string) => {
    if (!refVal.trim() || !phoneVal.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `/api/orders/track?ref=${encodeURIComponent(refVal)}&phone=${encodeURIComponent(phoneVal)}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Order lookup failed');
      }

      setOrderData(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not find order. Please verify Order Reference and Phone.');
      setOrderData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchParams.get('ref') && searchParams.get('phone')) {
      fetchOrder(searchParams.get('ref')!, searchParams.get('phone')!);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderRef, phone);
  };

  const getStepStatusIndex = (currentStatus: OrderStatus): number => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-graphite-1 border border-border-line p-6 md:p-8 rounded-2xl flex flex-col gap-2 glass-card">
        <span className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> SECURE ORDER LOOKUP & TIMELINE
        </span>
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-on-surface">
          Track Your Delivery
        </h1>
        <p className="font-sans text-xs text-slate max-w-lg">
          Enter your KC Order Reference (e.g. KC-9X2F8A) and registered phone number to securely inspect live delivery status.
        </p>

        {/* Lookup Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
          <div className="sm:col-span-5">
            <label className="font-mono text-[10px] text-outline uppercase tracking-wider block mb-1">
              Order Reference *
            </label>
            <input
              type="text"
              required
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="e.g. KC-9X2F8A"
              className="w-full bg-graphite-2 border border-border-line rounded-xl px-4 py-2.5 text-xs text-on-surface font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="font-mono text-[10px] text-outline uppercase tracking-wider block mb-1">
              Registered Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +233 24 123 4567"
              className="w-full bg-graphite-2 border border-border-line rounded-xl px-4 py-2.5 text-xs text-on-surface font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-bold hover:bg-secondary-container transition-colors shadow-lg flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Searching...' : 'Lookup'}</span>
            </button>
          </div>
        </form>
      </div>

      {errorMsg && (
        <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-xl font-sans text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Status Display & Timeline */}
      {orderData && (
        <div className="bg-graphite-2 border border-border-line rounded-2xl p-6 md:p-8 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-line pb-6 gap-4">
            <div>
              <span className="font-mono text-xs text-slate uppercase">ORDER REFERENCE</span>
              <h2 className="font-mono text-2xl font-bold text-primary">{orderData.order_reference}</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate">Current Status:</span>
              <span className="font-mono text-xs font-bold bg-secondary-container/30 text-primary border border-primary/40 px-3 py-1 rounded-full uppercase">
                {orderData.order_status}
              </span>
            </div>
          </div>

          {/* Timeline Visual Progress */}
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-xs text-primary uppercase tracking-widest">
              DELIVERY TIMELINE PROGRESS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
              {STATUS_STEPS.map((step, idx) => {
                const currentIdx = getStepStatusIndex(orderData.order_status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={step.key}
                    className={`flex flex-col p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-secondary-container/20 border-primary shadow-blue-glow'
                        : isCompleted
                        ? 'bg-graphite-1 border-primary/40 text-on-surface'
                        : 'bg-surface-container/40 border-border-line text-slate'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate">
                        STEP 0{idx + 1}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-dim" />
                      )}
                    </div>
                    <span className="font-sans font-bold text-xs text-on-surface mb-1">
                      {step.label}
                    </span>
                    <span className="font-sans text-[11px] text-slate leading-tight">
                      {step.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border-line font-mono text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-slate">Customer Name:</span>
              <span className="text-on-surface">{orderData.customer_name}</span>
              <span className="text-slate mt-2">Payment Method & Status:</span>
              <span className="text-primary font-bold">
                {orderData.payment_method} ({orderData.payment?.status || 'PENDING'})
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate">Total Amount:</span>
              <span className="text-primary font-bold text-base">
                GHS {Number(orderData.total).toFixed(2)}
              </span>
              <span className="text-slate mt-2">Delivery Status:</span>
              <span className="text-on-surface font-bold">
                {orderData.delivery?.status || 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="font-mono text-xs text-slate p-8">Loading Tracking Page...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
