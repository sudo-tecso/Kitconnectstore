'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { TraceLine } from '@/components/TraceLine';
import { PaymentMethod } from '@/types/database';
import { ShieldCheck, Truck, CreditCard, AlertCircle, ArrowRight, Phone, MapPin, User } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [landmark, setLandmark] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-graphite-2 border border-border-line rounded-2xl p-12 text-center my-12 flex flex-col items-center gap-4">
        <h2 className="font-bold text-xl text-on-surface">Your Cart is Empty</h2>
        <p className="font-sans text-xs text-slate">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/products')}
          className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-semibold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('Full Name is required for guest checkout.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMsg('Phone Number is required for delivery verification.');
      return;
    }

    if (!addressLine1.trim() || !city.trim() || !region.trim()) {
      setErrorMsg('Please complete your delivery address (Line 1, City, Region).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          deliveryAddress: {
            full_name: customerName,
            phone: customerPhone,
            address_line_1: addressLine1,
            city,
            region,
            landmark: landmark || null,
          },
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process order submission');
      }

      clearCart();
      // Pass raw OTP to confirmation page if returned for guest convenience
      router.push(`/order-confirmation/${data.order.id}?otp=${data.otpRaw || ''}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while creating your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-graphite-1 border border-border-line p-6 rounded-2xl flex flex-col gap-1">
        <span className="font-mono text-xs text-primary uppercase tracking-widest">
          SECURE GUEST CHECKOUT
        </span>
        <h1 className="font-sans font-bold text-2xl text-on-surface">Order & Delivery Checkout</h1>
      </div>

      {errorMsg && (
        <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-xl font-sans text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Customer Contact Info */}
          <div className="bg-graphite-2 rounded-2xl border border-border-line p-6 flex flex-col gap-4">
            <h3 className="font-mono text-xs text-primary uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> 1. Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  Phone Number (Required for OTP) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +233 24 123 4567"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-graphite-2 rounded-2xl border border-border-line p-6 flex flex-col gap-4">
            <h3 className="font-mono text-xs text-primary uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 2. Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  Street Address / House Line *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. 14 Innovation Street, Block 4"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  City / Area *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Accra"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  Region *
                </label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Greater Accra"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-outline uppercase tracking-wider">
                  Landmark / Delivery Instructions
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Tech Hub Plaza"
                  className="bg-graphite-1 border border-border-line rounded-lg px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Canonical Payment Method Selector */}
          <div className="bg-graphite-2 rounded-2xl border border-border-line p-6 flex flex-col gap-4">
            <h3 className="font-mono text-xs text-primary uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> 3. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-primary bg-secondary-container/20 shadow-[0_0_15px_rgba(47,111,255,0.15)]'
                    : 'border-border-line bg-graphite-1 hover:border-slate'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-on-surface">Cash on Delivery (COD)</span>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-primary"
                  />
                </div>
                <p className="font-sans text-xs text-slate leading-relaxed">
                  Pay physical cash upon delivery after inspecting equipment and verifying delivery OTP.
                </p>
              </label>

              {/* Option 2: Mobile Money */}
              <label
                className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'MOMO'
                    ? 'border-primary bg-secondary-container/20 shadow-[0_0_15px_rgba(47,111,255,0.15)]'
                    : 'border-border-line bg-graphite-1 hover:border-slate'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-on-surface">Mobile Money (MoMo)</span>
                  <input
                    type="radio"
                    name="payment"
                    value="MOMO"
                    checked={paymentMethod === 'MOMO'}
                    onChange={() => setPaymentMethod('MOMO')}
                    className="accent-primary"
                  />
                </div>
                <p className="font-sans text-xs text-slate leading-relaxed">
                  Authorize instant mobile money prompt on your phone for immediate confirmation.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-4 bg-graphite-2 p-6 rounded-2xl border border-border-line flex flex-col gap-4 sticky top-20">
          <h3 className="font-mono text-xs text-primary uppercase tracking-widest">
            ORDER REVIEW ({items.length} Items)
          </h3>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center text-xs">
                <span className="font-sans text-on-surface line-clamp-1 flex-1">
                  {quantity}x {product.name}
                </span>
                <span className="font-mono text-primary ml-2 font-semibold">
                  GHS {(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <TraceLine />

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
            <span className="text-on-surface">Total Amount:</span>
            <span className="text-primary text-xl">GHS {total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-sm font-bold hover:bg-secondary-container transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? 'Processing Order...' : 'Submit Order & Get OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
