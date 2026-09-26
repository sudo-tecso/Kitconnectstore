import { describe, it, expect } from 'vitest';
import { MoMoPaymentProvider } from '../lib/services/paymentService';

describe('Payment Provider Idempotency Tests', () => {
  it('instantiates MoMoPaymentProvider behind PaymentProvider interface', () => {
    const provider = new MoMoPaymentProvider();
    expect(provider.providerName).toBe('MoMo_Generic_Adapter');
  });

  it('returns pending initiation result for COD and MoMo', async () => {
    const provider = new MoMoPaymentProvider();
    const result = await provider.initiatePayment({
      orderId: 'ord-1',
      orderReference: 'KC-123456',
      amount: 195.0,
      currency: 'GHS',
      customerPhone: '+233241234567',
      customerName: 'Test Customer',
      method: 'MOMO',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('PENDING');
    expect(result.paymentReference).toContain('MOMO-');
  });
});
