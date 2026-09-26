import { describe, it, expect } from 'vitest';
import { DeliveryService } from '../lib/services/deliveryService';

describe('Delivery OTP Hashing and Verification Security Tests', () => {
  it('generates a 6-digit OTP and consistent SHA-256 hash', () => {
    const { rawOtp, hash } = DeliveryService.generateOtpAndHash();
    expect(rawOtp).toMatch(/^\d{6}$/);

    const manualHash = DeliveryService.hashOtp(rawOtp);
    expect(hash).toBe(manualHash);
  });

  it('never exposes raw OTP in hash output', () => {
    const { rawOtp, hash } = DeliveryService.generateOtpAndHash();
    expect(hash).not.toContain(rawOtp);
  });

  it('correctly compares matching OTP hash', () => {
    const rawOtp = '894219';
    const hash = DeliveryService.hashOtp(rawOtp);

    expect(DeliveryService.hashOtp('894219')).toBe(hash);
    expect(DeliveryService.hashOtp('123456')).not.toBe(hash);
  });
});
