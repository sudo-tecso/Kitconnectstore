import { PaymentMethod, PaymentStatus } from './database';

export interface PaymentInitiationRequest {
  orderId: string;
  orderReference: string;
  amount: number;
  currency: string;
  customerPhone: string;
  customerName: string;
  method: PaymentMethod;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentReference: string;
  providerTransactionId?: string;
  status: PaymentStatus;
  instructionMessage?: string;
  rawResponse?: Record<string, unknown>;
  error?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  paymentReference: string;
  providerTransactionId?: string;
  status: PaymentStatus;
  paidAt?: string;
  rawResponse?: Record<string, unknown>;
  error?: string;
}

export interface WebhookEventPayload {
  provider: string;
  event: string;
  paymentReference: string;
  providerTransactionId: string;
  status: PaymentStatus;
  amount: number;
  signature?: string;
  rawPayload: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly providerName: string;
  initiatePayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResult>;
  verifyPayment(paymentReference: string): Promise<PaymentVerificationResult>;
  handleWebhook(payload: WebhookEventPayload): Promise<PaymentVerificationResult>;
}
