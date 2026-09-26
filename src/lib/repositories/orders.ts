import { Order, OrderStatus } from '@/types/database';
import { createClient } from '../supabase/client';

// Local runtime order memory store for local development when Supabase DB connection is inactive
const IN_MEMORY_ORDERS: Map<string, Order> = new Map();

export class OrderRepository {
  static async saveOrder(order: Order): Promise<Order> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      IN_MEMORY_ORDERS.set(order.id, order);
      IN_MEMORY_ORDERS.set(order.order_reference, order);
      return order;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      console.error('Database Error saving order:', error);
      throw new Error(`Failed to save order to database: ${error.message}`);
    }

    return data as Order;
  }

  static async findByReferenceAndPhone(
    reference: string,
    phone: string
  ): Promise<Order | null> {
    const cleanRef = reference.trim().toUpperCase();
    const cleanPhone = phone.trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const match = IN_MEMORY_ORDERS.get(cleanRef);
      if (match && match.customer_phone.includes(cleanPhone)) {
        return match;
      }
      return null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*), payment:payments(*), delivery:delivery(*)')
      .eq('order_reference', cleanRef)
      .ilike('customer_phone', `%${cleanPhone}%`)
      .single();

    if (error || !data) return null;
    return data as Order;
  }

  static async findById(id: string): Promise<Order | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return IN_MEMORY_ORDERS.get(id) || null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*), payment:payments(*), delivery:delivery(*)')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as Order;
  }

  static async getAllOrders(): Promise<Order[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return Array.from(new Set(IN_MEMORY_ORDERS.values())).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*), payment:payments(*), delivery:delivery(*)')
      .order('created_at', { ascending: false });

    if (error || !data) return Array.from(new Set(IN_MEMORY_ORDERS.values()));
    return data as Order[];
  }

  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    reason?: string
  ): Promise<boolean> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const existing = IN_MEMORY_ORDERS.get(orderId);
      if (existing) {
        existing.order_status = newStatus;
        existing.updated_at = new Date().toISOString();
        return true;
      }
      return false;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ order_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    // Insert history
    await supabase.from('order_status_history').insert([
      {
        order_id: orderId,
        to_status: newStatus,
        reason: reason || 'Status transition',
      },
    ]);

    return true;
  }
}
