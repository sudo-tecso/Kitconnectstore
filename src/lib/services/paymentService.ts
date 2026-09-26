import {
  PaymentProvider,
  PaymentInitiationRequest,
  PaymentInitiationResult,
  PaymentVerificationResult,
  WebhookEventPayload,
} from '@/types/payment';
import { PaymentRepository } from '../repositories/payments';
import { PaymentMethod, PaymentStatus } from '@/types/database';

/**
 * MoMo Payment Provider implementation adhering strictly to PaymentProvider interface.
 * Implements clean sandbox/adapter operations without inventing fake production integration credentials.
 */
export class MoMoPaymentProvider implements PaymentProvider {
  readonly providerName = 'MoMo_Generic_Adapter';

  async initiatePayment(
    request: PaymentInitiationRequest
  ): Promise<PaymentInitiationResult> {
    const payRef = `MOMO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      success: true,
      paymentReference: payRef,
      providerTransactionId: `TX-MOMO-${Date.now()}`,
      status: 'PENDING',
      instructionMessage: `A prompt has been sent to ${request.customerPhone}. Authorize the GHS ${request.amount.toFixed(2)} payment on your phone.`,
      rawResponse: {
        provider: this.providerName,
        status: 'PENDING',
        transactionId: `TX-MOMO-${Date.now()}`,
      },
    };
  }

  async verifyPayment(paymentReference: string): Promise<PaymentVerificationResult> {
    const existing = await PaymentRepository.findByReference(paymentReference);
    if (!existing) {
      return {
        success: false,
        paymentReference,
        status: 'FAILED',
        error: 'Payment record not found',
      };
    }

    return {
      success: existing.status === 'PAID',
      paymentReference,
      providerTransactionId: existing.provider_transaction_id || undefined,
      status: existing.status,
      paidAt: existing.paid_at || undefined,
    };
  }

  async handleWebhook(payload: WebhookEventPayload): Promise<PaymentVerificationResult> {
    // Idempotent webhook verification & processing
    const existing = await PaymentRepository.findByReference(payload.paymentReference);
    if (!existing) {
      return {
        success: false,
        paymentReference: payload.paymentReference,
        status: 'FAILED',
        error: 'Payment reference not found for webhook processing',
      };
    }

    // If already processed, return existing status safely (idempotent)
    if (existing.status === payload.status) {
      return {
        success: payload.status === 'PAID',
        paymentReference: payload.paymentReference,
        providerTransactionId: payload.providerTransactionId,
        status: payload.status,
      };
    }

    await PaymentRepository.updateStatus(
      payload.paymentReference,
      payload.status,
      payload.providerTransactionId
    );

    return {
      success: payload.status === 'PAID',
      paymentReference: payload.paymentReference,
      providerTransactionId: payload.providerTransactionId,
      status: payload.status,
    };
  }
}

export class PaymentService {
  private static providers: Map<PaymentMethod, PaymentProvider> = new Map([
    ['MOMO', new MoMoPaymentProvider()],
  ]);

  static getProvider(method: PaymentMethod): PaymentProvider | null {
    return this.providers.get(method) || null;
  }

  static async initiate(request: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
    if (request.method === 'COD') {
      const payRef = `COD-${Date.now()}`;
      return {
        success: true,
        paymentReference: payRef,
        status: 'PENDING',
        instructionMessage: 'Payment is due in Cash upon physical delivery.',
      };
    }

    const provider = this.getProvider(request.method);
    if (!provider) {
      return {
        success: false,
        paymentReference: '',
        status: 'FAILED',
        error: `No payment provider configured for method ${request.method}`,
      };
    }

    return await provider.initiatePayment(request);
  }

  static async updatePaymentStatus(
    paymentReference: string,
    status: PaymentStatus,
    providerTxId?: string
  ): Promise<boolean> {
    return await PaymentRepository.updateStatus(paymentReference, status, providerTxId);
  }
}
