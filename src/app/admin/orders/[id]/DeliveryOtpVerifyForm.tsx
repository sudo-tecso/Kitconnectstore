'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

interface DeliveryOtpVerifyFormProps {
  orderId: string;
  isVerified: boolean;
}

export const DeliveryOtpVerifyForm: React.FC<DeliveryOtpVerifyFormProps> = ({
  orderId,
  isVerified,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-4 rounded-xl font-mono text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Delivery OTP code successfully verified. Recipient confirmed.</span>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/delivery/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, otp }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'OTP verification failed');
      }

      setStatusMsg({ success: true, text: 'Delivery OTP verified successfully!' });
      router.refresh();
    } catch (err: any) {
      setStatusMsg({ success: false, text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3 font-mono text-xs">
      <p className="text-slate leading-relaxed">
        Enter the 6-digit OTP code provided by the customer upon physical delivery to verify recipient identity.
      </p>

      {statusMsg && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 ${
            statusMsg.success
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : 'bg-red-950 text-red-300 border border-red-800'
          }`}
        >
          {statusMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <KeyRound className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit OTP (e.g. 894219)"
            className="w-full bg-graphite-1 border border-border-line rounded-xl pl-9 pr-3 py-2.5 text-xs text-on-surface tracking-widest font-bold focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || otp.length < 6}
          className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-sans text-xs font-bold hover:bg-secondary-container transition-colors disabled:opacity-50"
        >
          Verify
        </button>
      </div>
    </form>
  );
};
