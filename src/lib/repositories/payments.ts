import { Payment, PaymentStatus } from '@/types/database';
import { createClient } from '../supabase/client';

const IN_MEMORY_PAYMENTS: Map<string, Payment> = new Map();

export class PaymentRepository {
  static async savePayment(payment: Payment): Promise<Payment> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      IN_MEMORY_PAYMENTS.set(payment.id, payment);
      IN_MEMORY_PAYMENTS.set(payment.payment_reference, payment);
      return payment;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    if (error) {
      console.error('Error saving payment:', error);
      throw new Error(`Failed to save payment: ${error.message}`);
    }

    return data as Payment;
  }

  static async findByReference(paymentReference: string): Promise<Payment | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return IN_MEMORY_PAYMENTS.get(paymentReference) || null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_reference', paymentReference)
      .single();

    if (error || !data) return IN_MEMORY_PAYMENTS.get(paymentReference) || null;
    return data as Payment;
  }

  static async updateStatus(
    paymentReference: string,
    status: PaymentStatus,
    providerTxId?: string
  ): Promise<boolean> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const now = new Date().toISOString();

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const p = IN_MEMORY_PAYMENTS.get(paymentReference);
      if (p) {
        p.status = status;
        if (providerTxId) p.provider_transaction_id = providerTxId;
        if (status === 'PAID') p.paid_at = now;
        p.updated_at = now;
        return true;
      }
      return false;
    }

    const supabase = createClient();
    const updates: Partial<Payment> = {
      status,
      updated_at: now,
    };

    if (providerTxId) updates.provider_transaction_id = providerTxId;
    if (status === 'PAID') updates.paid_at = now;

    const { error } = await supabase
      .from('payments')
      .update(updates)
      .eq('payment_reference', paymentReference);

    if (error) {
      console.error('Error updating payment status:', error);
      return false;
    }

    return true;
  }
}
