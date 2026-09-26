import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/orderService';

export async function POST(req: Request) {
  try {
    const { orderId, nextStatus } = await req.json();

    if (!orderId || !nextStatus) {
      return NextResponse.json(
        { success: false, error: 'Order ID and target status are required.' },
        { status: 400 }
      );
    }

    const result = await OrderService.transitionOrderStatus(orderId, nextStatus);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Transition failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order transitioned to ${nextStatus}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
