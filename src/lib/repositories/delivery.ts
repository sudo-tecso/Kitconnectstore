import { Delivery, DeliveryStatus } from '@/types/database';
import { createClient } from '../supabase/client';

const IN_MEMORY_DELIVERIES: Map<string, Delivery> = new Map();

export class DeliveryRepository {
  static async saveDelivery(delivery: Delivery): Promise<Delivery> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      IN_MEMORY_DELIVERIES.set(delivery.order_id, delivery);
      return delivery;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('delivery')
      .insert([delivery])
      .select()
      .single();

    if (error) {
      console.error('Error saving delivery record:', error);
      throw new Error(`Failed to save delivery: ${error.message}`);
    }

    return data as Delivery;
  }

  static async findByOrderId(orderId: string): Promise<Delivery | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return IN_MEMORY_DELIVERIES.get(orderId) || null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('delivery')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) return IN_MEMORY_DELIVERIES.get(orderId) || null;
    return data as Delivery;
  }

  static async updateStatus(
    orderId: string,
    status: DeliveryStatus,
    verified?: boolean
  ): Promise<boolean> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const now = new Date().toISOString();

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const del = IN_MEMORY_DELIVERIES.get(orderId);
      if (del) {
        del.status = status;
        if (verified) del.verified_at = now;
        if (status === 'DELIVERED') del.delivered_at = now;
        del.updated_at = now;
        return true;
      }
      return false;
    }

    const supabase = createClient();
    const updates: Partial<Delivery> = {
      status,
      updated_at: now,
    };

    if (verified) updates.verified_at = now;
    if (status === 'DELIVERED') updates.delivered_at = now;

    const { error } = await supabase
      .from('delivery')
      .update(updates)
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating delivery record:', error);
      return false;
    }

    return true;
  }

  static async incrementAttempts(orderId: string): Promise<number> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const del = IN_MEMORY_DELIVERIES.get(orderId);
      if (del) {
        del.verification_attempts += 1;
        return del.verification_attempts;
      }
      return 1;
    }

    const supabase = createClient();
    const current = await this.findByOrderId(orderId);
    const newCount = (current?.verification_attempts || 0) + 1;

    await supabase
      .from('delivery')
      .update({ verification_attempts: newCount, updated_at: new Date().toISOString() })
      .eq('order_id', orderId);

    return newCount;
  }
}
