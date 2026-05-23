'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ItemDisplay } from '@/lib/api/items';

export interface BasketItem {
  item: ItemDisplay;
  qty: number;
  item_note?: string;
}

interface BasketState {
  items: BasketItem[];
  isOpen: boolean;
}

type BasketAction =
  | { type: 'ADD_ITEM'; item: ItemDisplay; qty?: number; note?: string }
  | { type: 'REMOVE_ITEM'; item_id: string }
  | { type: 'UPDATE_QTY'; item_id: string; qty: number }
  | { type: 'UPDATE_NOTE'; item_id: string; note: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' };

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (!action.item.in_stock) return state;
      const qty = action.qty ?? 1;
      const existing = state.items.find(b => b.item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(b =>
            b.item.id === action.item.id
              ? { ...b, qty: b.qty + qty, item_note: action.note ?? b.item_note }
              : b
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { item: action.item, qty, item_note: action.note }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(b => b.item.id !== action.item_id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(b => b.item.id !== action.item_id) };
      }
      return {
        ...state,
        items: state.items.map(b =>
          b.item.id === action.item_id ? { ...b, qty: action.qty } : b
        ),
      };
    }
    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map(b =>
          b.item.id === action.item_id ? { ...b, item_note: action.note } : b
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface BasketContextValue {
  items: BasketItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: ItemDisplay, qty?: number, note?: string) => void;
  removeItem: (item_id: string) => void;
  updateQty: (item_id: string, qty: number) => void;
  updateNote: (item_id: string, note: string) => void;
  clearBasket: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, { items: [], isOpen: false });

  const totalItems = state.items.reduce((sum, b) => sum + b.qty, 0);
  const totalPrice = state.items.reduce((sum, b) => sum + b.item.price_minor * b.qty, 0);

  const addItem = useCallback((item: ItemDisplay, qty = 1, note?: string) =>
    dispatch({ type: 'ADD_ITEM', item, qty, note }), []);
  const removeItem = useCallback((item_id: string) =>
    dispatch({ type: 'REMOVE_ITEM', item_id }), []);
  const updateQty = useCallback((item_id: string, qty: number) =>
    dispatch({ type: 'UPDATE_QTY', item_id, qty }), []);
  const updateNote = useCallback((item_id: string, note: string) =>
    dispatch({ type: 'UPDATE_NOTE', item_id, note }), []);
  const clearBasket = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), []);
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), []);

  return (
    <BasketContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQty,
      updateNote,
      clearBasket,
      openDrawer,
      closeDrawer,
    }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasketContext() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasketContext must be used within BasketProvider');
  return ctx;
}
