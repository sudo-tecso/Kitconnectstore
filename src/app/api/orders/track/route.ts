import { NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/repositories/orders';
import { RateLimiter } from '@/lib/security/rateLimiter';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');
  const phone = searchParams.get('phone');

  if (!ref || !phone) {
    return NextResponse.json(
      { success: false, error: 'Order reference and phone number are required.' },
      { status: 400 }
    );
  }

  // Extract IP or client identifier
  const ip = req.headers.get('x-forwarded-for') || 'anon-client';

  // Rate Limiting Check (Max 10 lookups per 15 min)
  const rateCheck = RateLimiter.check(`track-lookup-${ip}`, 10, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many tracking requests. Please wait 15 minutes before trying again.',
      },
      { status: 429 }
    );
  }

  const order = await OrderRepository.findByReferenceAndPhone(ref, phone);

  if (!order) {
    return NextResponse.json(
      { success: false, error: 'Order not found. Check reference and phone number.' },
      { status: 404 }
    );
  }

  // Return safe customer order representation (Never expose verification_code_hash or provider secrets!)
  const safeOrder = {
    id: order.id,
    order_reference: order.order_reference,
    customer_name: order.customer_name,
    subtotal: order.subtotal,
    delivery_fee: order.delivery_fee,
    total: order.total,
    currency: order.currency,
    payment_method: order.payment_method,
    order_status: order.order_status,
    created_at: order.created_at,
    items: order.items?.map((i) => ({
      product_name: i.product_name_snapshot,
      quantity: i.quantity,
      line_total: i.line_total,
    })),
    delivery: {
      status: order.delivery?.status || 'PENDING',
      estimated_delivery_at: order.delivery?.estimated_delivery_at,
    },
    payment: {
      status: order.payment?.status || 'PENDING',
      method: order.payment?.method,
    },
  };

  return NextResponse.json({
    success: true,
    order: safeOrder,
  });
}
