import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/orderService';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items,
      paymentMethod,
      notes,
    } = body;

    if (!customerName || !customerPhone || !deliveryAddress || !items || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required checkout parameters' },
        { status: 400 }
      );
    }

    const result = await OrderService.createOrder({
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items,
      paymentMethod,
      notes,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create order' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      otpRaw: result.otpRaw,
    });
  } catch (error: any) {
    console.error('API Error /api/orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
