'use client';

import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';

interface AddToCartFormProps {
  product: Product;
  isOutOfStock: boolean;
  maxStock: number;
}

export const AddToCartForm: React.FC<AddToCartFormProps> = ({
  product,
  isOutOfStock,
  maxStock,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleIncrement = () => {
    if (quantity < (maxStock > 0 ? maxStock : 99)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="font-mono text-xs text-slate uppercase tracking-wider">Quantity:</label>
        <div className="flex items-center border border-border-line rounded-xl bg-graphite-1 overflow-hidden">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isOutOfStock}
            className="p-2.5 text-slate hover:text-on-surface disabled:opacity-40 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-mono text-sm font-bold text-on-surface px-4 min-w-[2.5rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= maxStock || isOutOfStock}
            className="p-2.5 text-slate hover:text-on-surface disabled:opacity-40 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3.5 rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
          added
            ? 'bg-emerald-600 text-white'
            : isOutOfStock
            ? 'bg-surface-container text-slate cursor-not-allowed border border-border-line'
            : 'bg-primary-container text-on-primary-container hover:bg-secondary-container'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            <span>Added to Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
          </>
        )}
      </button>
    </div>
  );
};
