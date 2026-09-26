import { Order, OrderStatus, PaymentMethod, isValidOrderTransition, Address, OrderItem } from '@/types/database';
import { OrderRepository } from '../repositories/orders';
import { ProductRepository } from '../repositories/products';
import { DeliveryService } from './deliveryService';
import { PaymentService } from './paymentService';
import { createClient } from '../supabase/client';

export interface CreateOrderInput {
  profileId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: Address;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export class OrderService {
  /**
   * Calculates subtotal, delivery fee, and total for cart items server-side
   */
  static async calculateOrderTotals(
    items: Array<{ productId: string; quantity: number }>
  ): Promise<{ subtotal: number; deliveryFee: number; total: number }> {
    let subtotal = 0;

    for (const item of items) {
      const product = await ProductRepository.getProductBySlugOrId(item.productId);
      if (!product || !product.is_active) {
        throw new Error(`Product ${item.productId} is unavailable or inactive.`);
      }
      subtotal += product.price * item.quantity;
    }

    const deliveryFee = Number(process.env.DELIVERY_FEE_GHS) || 0; // Default GHS 0 or env setting
    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total };
  }

  /**
   * Creates an order atomically.
   * Executes PostgreSQL create_order_tx RPC when Supabase connection is active,
   * or safely initializes order data locally for dev catalogue testing.
   */
  static async createOrder(input: CreateOrderInput): Promise<{
    success: boolean;
    order?: Order;
    otpRaw?: string;
    error?: string;
  }> {
    if (!input.customerName || !input.customerName.trim()) {
      return { success: false, error: 'Customer name is required' };
    }

    if (!input.customerPhone || !input.customerPhone.trim()) {
      return { success: false, error: 'Customer phone number is required' };
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Cart cannot be empty' };
    }

    // Generate Delivery OTP and SHA-256 Hash
    const { rawOtp, hash } = DeliveryService.generateOtpAndHash();
    const { subtotal, deliveryFee, total } = await this.calculateOrderTotals(input.items);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Direct Database Execution via RPC
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = createClient();
      const rpcItems = input.items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
      }));

      const { data, error } = await supabase.rpc('create_order_tx', {
        p_profile_id: input.profileId || null,
        p_customer_name: input.customerName,
        p_customer_phone: input.customerPhone,
        p_customer_email: input.customerEmail || null,
        p_delivery_address: input.deliveryAddress,
        p_items: rpcItems,
        p_payment_method: input.paymentMethod,
        p_delivery_fee: deliveryFee,
        p_otp_hash: hash,
      });

      if (error) {
        console.error('RPC Error executing create_order_tx:', error);
        return { success: false, error: error.message };
      }

      const createdOrder = await OrderRepository.findById(data.order_id);
      return {
        success: true,
        order: createdOrder || undefined,
        otpRaw: rawOtp,
      };
    }

    // In-memory runtime order creation for local dev catalogue testing
    const orderId = `ord-${Date.now()}`;
    const orderRef = `KC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const orderItems: OrderItem[] = [];
    for (const item of input.items) {
      const p = await ProductRepository.getProductBySlugOrId(item.productId);
      if (!p) continue;
      orderItems.push({
        id: `item-${Date.now()}-${Math.random()}`,
        order_id: orderId,
        product_id: p.id,
        product_name_snapshot: p.name,
        sku_snapshot: p.sku,
        unit_price: p.price,
        quantity: item.quantity,
        line_total: p.price * item.quantity,
        created_at: new Date().toISOString(),
      });
    }

    const order: Order = {
      id: orderId,
      order_reference: orderRef,
      profile_id: input.profileId || null,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail || null,
      delivery_address: input.deliveryAddress,
      subtotal,
      delivery_fee: deliveryFee,
      discount: 0,
      total,
      currency: 'GHS',
      payment_method: input.paymentMethod,
      order_status: 'PENDING',
      notes: input.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderItems,
      payment: {
        id: `pay-${Date.now()}`,
        order_id: orderId,
        payment_reference: `PAY-${Date.now()}`,
        provider: input.paymentMethod === 'MOMO' ? 'MoMo_Adapter' : 'COD',
        provider_transaction_id: null,
        method: input.paymentMethod,
        status: 'PENDING',
        amount: total,
        currency: 'GHS',
        metadata: {},
        paid_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      delivery: {
        id: `del-${Date.now()}`,
        order_id: orderId,
        status: 'PENDING',
        verification_code_hash: hash,
        verification_expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        verification_attempts: 0,
        verified_at: null,
        delivered_at: null,
        estimated_delivery_at: new Date(Date.now() + 2 * 86400000).toISOString(),
        delivery_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    await OrderRepository.saveOrder(order);

    return {
      success: true,
      order,
      otpRaw: rawOtp,
    };
  }

  /**
   * Validates and executes order status transitions enforcing state machine logic
   */
  static async transitionOrderStatus(
    orderId: string,
    toStatus: OrderStatus,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const currentStatus = order.order_status;
    if (!isValidOrderTransition(currentStatus, toStatus)) {
      return {
        success: false,
        error: `Illegal order status transition from ${currentStatus} to ${toStatus}.`,
      };
    }

    // Inventory Lifecycle Rules
    if (toStatus === 'CANCELLED') {
      // Release reserved stock back to available pool
      await this.releaseReservedStock(order);
    } else if (toStatus === 'DELIVERED') {
      // If COD, mark payment paid upon delivery
      if (order.payment_method === 'COD' && order.payment) {
        await PaymentService.updatePaymentStatus(order.payment.payment_reference, 'PAID');
      }
    }

    const updated = await OrderRepository.updateOrderStatus(orderId, toStatus, reason);
    return { success: updated };
  }

  /**
   * Inventory lifecycle stock release helper
   */
  private static async releaseReservedStock(order: Order): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) return;

    const supabase = createClient();
    if (!order.items) return;

    for (const item of order.items) {
      if (!item.product_id) continue;
      try {
        await supabase.rpc('release_stock_tx', {
          p_product_id: item.product_id,
          p_qty: item.quantity,
        });
      } catch {
        // Safe catch if RPC is not present
      }
    }
  }
}
