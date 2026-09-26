import React from 'react';
import Link from 'next/link';
import { OrderRepository as OrderRepo } from '@/lib/repositories/orders';
import { TraceLine } from '@/components/TraceLine';
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, Copy } from 'lucide-react';

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ otp?: string }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { id } = await params;
  const { otp } = await searchParams;

  const order = await OrderRepo.findById(id);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 my-4">
      {/* Success Header Card */}
      <div className="bg-graphite-1 border border-border-line rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 glass-card relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-primary-container/20 border border-primary flex items-center justify-center text-primary pulse-glow">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <div>
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            ORDER PLACED SUCCESSFULLY
          </span>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-on-surface mt-1">
            Thank You for Your Order!
          </h1>
          <p className="font-sans text-xs text-slate mt-1">
            Your gadget accessories order has been created and registered in our system.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-graphite-2 border border-border-line px-6 py-3 rounded-xl flex items-center gap-4">
          <div className="flex flex-col text-left">
            <span className="font-mono text-[10px] text-slate uppercase">ORDER REFERENCE</span>
            <span className="font-mono text-lg font-bold text-primary">
              {order ? order.order_reference : `KC-${id.substring(0, 6).toUpperCase()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Verification Code Box */}
      <div className="bg-secondary-container/20 border border-primary/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-graphite-1 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm text-on-surface">Delivery Verification Code (OTP)</span>
            <span className="font-sans text-xs text-slate">Provide this code to your courier agent upon delivery.</span>
          </div>
        </div>

        <div className="bg-graphite-1 border border-primary px-4 py-2 rounded-xl font-mono text-xl font-bold text-primary tracking-widest shadow-blue-glow">
          {otp || '894-219'}
        </div>
      </div>

      {/* Order Details & Summary Breakdown */}
      {order && (
        <div className="bg-graphite-2 border border-border-line rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <h3 className="font-mono text-xs text-primary uppercase tracking-wider">
            RECAP & DELIVERY DETAILS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs border-b border-border-line pb-6">
            <div className="flex flex-col gap-1">
              <span className="text-slate">Customer Name:</span>
              <span className="text-on-surface font-bold">{order.customer_name}</span>
              <span className="text-slate mt-2">Phone Number:</span>
              <span className="text-on-surface font-bold">{order.customer_phone}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate">Payment Method:</span>
              <span className="text-primary font-bold">{order.payment_method}</span>
              <span className="text-slate mt-2">Delivery Address:</span>
              <span className="text-on-surface font-bold">
                {order.delivery_address.address_line_1}, {order.delivery_address.city},{' '}
                {order.delivery_address.region}
              </span>
            </div>
          </div>

          {/* Items Recap */}
          {order.items && order.items.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs text-slate uppercase">Ordered Items</span>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs font-mono">
                  <span className="text-on-surface">
                    {item.quantity}x {item.product_name_snapshot}
                  </span>
                  <span className="text-primary font-bold">GHS {item.line_total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <TraceLine />

          <div className="flex justify-between items-baseline font-mono text-base font-bold">
            <span className="text-on-surface">Total Amount:</span>
            <span className="text-primary text-xl">GHS {order.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="flex justify-center">
        <Link
          href={`/order-tracking?ref=${order?.order_reference || ''}&phone=${encodeURIComponent(
            order?.customer_phone || ''
          )}`}
          className="px-8 py-3.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-sm font-bold hover:bg-secondary-container transition-colors flex items-center gap-2 shadow-lg"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Track Order Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
