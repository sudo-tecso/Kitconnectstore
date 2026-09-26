import crypto from 'crypto';
import { DeliveryRepository } from '../repositories/delivery';
import { DeliveryStatus } from '@/types/database';
import { RateLimiter } from '../security/rateLimiter';

export class DeliveryService {
  /**
   * Generates a 6-digit cryptographic OTP code and returns its SHA-256 hash
   */
  static generateOtpAndHash(): { rawOtp: string; hash: string } {
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = crypto.createHash('sha256').update(rawOtp).digest('hex');
    return { rawOtp, hash };
  }

  /**
   * Hashes a raw input string with SHA-256
   */
  static hashOtp(rawOtp: string): string {
    return crypto.createHash('sha256').update(rawOtp.trim()).digest('hex');
  }

  /**
   * Verifies a customer delivery OTP code server-side with rate limiting & max 5 attempt limit
   */
  static async verifyDeliveryOtp(
    orderId: string,
    submittedOtp: string,
    ipAddress = 'unknown'
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Rate Limiting Check
    const rateCheck = RateLimiter.check(`delivery-otp-${orderId}-${ipAddress}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: 'Too many verification attempts. Please wait 15 minutes before trying again.',
      };
    }

    const deliveryRecord = await DeliveryRepository.findByOrderId(orderId);
    if (!deliveryRecord) {
      return { success: false, error: 'Delivery record not found' };
    }

    if (deliveryRecord.status === 'VERIFIED' || deliveryRecord.status === 'DELIVERED') {
      return { success: true };
    }

    // Max 5 attempts per delivery record
    if (deliveryRecord.verification_attempts >= 5) {
      return {
        success: false,
        error: 'Maximum verification attempts exceeded. Delivery verification locked.',
      };
    }

    // Check expiration
    if (
      deliveryRecord.verification_expires_at &&
      new Date(deliveryRecord.verification_expires_at) < new Date()
    ) {
      return { success: false, error: 'Delivery verification code has expired' };
    }

    // Compare SHA-256 hash
    const submittedHash = this.hashOtp(submittedOtp);
    const attempts = await DeliveryRepository.incrementAttempts(orderId);

    if (submittedHash !== deliveryRecord.verification_code_hash) {
      return {
        success: false,
        error: `Invalid verification code. ${5 - attempts} attempts remaining.`,
      };
    }

    // Update status to VERIFIED
    await DeliveryRepository.updateStatus(orderId, 'VERIFIED', true);
    RateLimiter.reset(`delivery-otp-${orderId}-${ipAddress}`);

    return { success: true };
  }

  static async updateDeliveryStatus(
    orderId: string,
    status: DeliveryStatus
  ): Promise<boolean> {
    return await DeliveryRepository.updateStatus(orderId, status);
  }
}
