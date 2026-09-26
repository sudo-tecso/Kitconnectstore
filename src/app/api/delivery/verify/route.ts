import { NextResponse } from 'next/server';
import { DeliveryService } from '@/lib/services/deliveryService';

export async function POST(req: Request) {
  try {
    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { success: false, error: 'Order ID and OTP code are required.' },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || 'anon';
    const result = await DeliveryService.verifyDeliveryOtp(orderId, otp, clientIp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Delivery OTP code verified successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification error' },
      { status: 500 }
    );
  }
}
