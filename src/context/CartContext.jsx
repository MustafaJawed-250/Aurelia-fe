import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'aurelia_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD': {
      const { product, quantity = 1 } = action.payload;
      const existing = state.find((i) => i.product_id === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock_quantity || 99);
        return state.map((i) =>
          i.product_id === product.id ? { ...i, quantity: nextQty } : i
        );
      }
      return [
        ...state,
        {
          product_id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          image: product.image_urls?.[0] || '',
          stock_quantity: product.stock_quantity,
          quantity: Math.min(quantity, product.stock_quantity || 1),
        },
      ];
    }
    case 'UPDATE_QTY': {
      const { product_id, quantity } = action.payload;
      if (quantity <= 0) return state.filter((i) => i.product_id !== product_id);
      return state.map((i) => {
        if (i.product_id !== product_id) return i;
        const max = i.stock_quantity || 99;
        return { ...i, quantity: Math.min(Math.max(1, quantity), max) };
      });
    }
    case 'REMOVE':
      return state.filter((i) => i.product_id !== action.payload);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: loadCart() });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  const addItem = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD', payload: { product, quantity } });
  }, []);

  const updateQty = useCallback((product_id, quantity) => {
    dispatch({ type: 'UPDATE_QTY', payload: { product_id, quantity } });
  }, []);

  const removeItem = useCallback((product_id) => {
    dispatch({ type: 'REMOVE', payload: product_id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, count, subtotal, ready }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
