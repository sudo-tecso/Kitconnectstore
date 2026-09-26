'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderStatus, VALID_ORDER_TRANSITIONS } from '@/types/database';

interface OrderStatusActionFormProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export const OrderStatusActionForm: React.FC<OrderStatusActionFormProps> = ({
  orderId,
  currentStatus,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allowedNextStatuses = VALID_ORDER_TRANSITIONS[currentStatus] || [];

  const handleTransition = async (nextStatus: OrderStatus) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Transition failed');
      }

      setMessage(`Order transitioned to ${nextStatus} successfully.`);
      router.refresh();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (allowedNextStatuses.length === 0) {
    return (
      <div className="font-mono text-xs text-slate bg-graphite-1 p-4 rounded-xl border border-border-line">
        Order is in terminal state <strong className="text-primary">{currentStatus}</strong>. No further state transitions allowed.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-mono text-xs">
      <span className="text-slate">Available Status Transitions:</span>
      {message && <div className="p-2.5 bg-graphite-1 text-primary border border-border-line rounded-lg">{message}</div>}

      <div className="flex flex-wrap gap-2">
        {allowedNextStatuses.map((st) => (
          <button
            key={st}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleTransition(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              st === 'CANCELLED'
                ? 'bg-red-950 text-red-300 border border-red-800 hover:bg-red-900'
                : 'bg-primary-container text-on-primary-container hover:bg-secondary-container'
            }`}
          >
            Advance to {st}
          </button>
        ))}
      </div>
    </div>
  );
};
