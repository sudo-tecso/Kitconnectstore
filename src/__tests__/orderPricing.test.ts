import { describe, it, expect } from 'vitest';
import { OrderService } from '../lib/services/orderService';
import { MOCK_PRODUCTS } from '../lib/mockData';

describe('Order Pricing Calculation Tests', () => {
  it('correctly calculates subtotal and total for single product', async () => {
    const item = { productId: MOCK_PRODUCTS[0].id, quantity: 2 };
    const { subtotal, total } = await OrderService.calculateOrderTotals([item]);

    const expectedSubtotal = MOCK_PRODUCTS[0].price * 2;
    expect(subtotal).toBe(expectedSubtotal);
    expect(total).toBe(expectedSubtotal);
  });

  it('correctly aggregates multiple cart line items', async () => {
    const items = [
      { productId: MOCK_PRODUCTS[0].id, quantity: 1 },
      { productId: MOCK_PRODUCTS[1].id, quantity: 3 },
    ];
    const { subtotal } = await OrderService.calculateOrderTotals(items);

    const expectedSubtotal = MOCK_PRODUCTS[0].price * 1 + MOCK_PRODUCTS[1].price * 3;
    expect(subtotal).toBe(expectedSubtotal);
  });

  it('throws an error if an invalid or inactive product ID is requested', async () => {
    const items = [{ productId: 'non-existent-id', quantity: 1 }];
    await expect(OrderService.calculateOrderTotals(items)).rejects.toThrow();
  });
});
