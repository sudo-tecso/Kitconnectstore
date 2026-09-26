import { describe, it, expect } from 'vitest';
import { isValidOrderTransition, OrderStatus } from '../types/database';

describe('Order Status State Machine Transition Rules', () => {
  it('allows valid sequential transitions', () => {
    expect(isValidOrderTransition('PENDING', 'CONFIRMED')).toBe(true);
    expect(isValidOrderTransition('CONFIRMED', 'PROCESSING')).toBe(true);
    expect(isValidOrderTransition('PROCESSING', 'READY_FOR_DELIVERY')).toBe(true);
    expect(isValidOrderTransition('READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY')).toBe(true);
    expect(isValidOrderTransition('OUT_FOR_DELIVERY', 'DELIVERED')).toBe(true);
  });

  it('allows valid cancellation from non-terminal states', () => {
    expect(isValidOrderTransition('PENDING', 'CANCELLED')).toBe(true);
    expect(isValidOrderTransition('CONFIRMED', 'CANCELLED')).toBe(true);
    expect(isValidOrderTransition('PROCESSING', 'CANCELLED')).toBe(true);
  });

  it('blocks illegal status jumps', () => {
    expect(isValidOrderTransition('PENDING', 'DELIVERED')).toBe(false);
    expect(isValidOrderTransition('PROCESSING', 'DELIVERED')).toBe(false);
    expect(isValidOrderTransition('DELIVERED', 'PENDING')).toBe(false);
    expect(isValidOrderTransition('CANCELLED', 'CONFIRMED')).toBe(false);
  });
});
