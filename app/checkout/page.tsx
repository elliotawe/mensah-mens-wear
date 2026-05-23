'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBasketContext } from '@/context/BasketContext';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  const { totalItems } = useBasketContext();
  const router = useRouter();

  useEffect(() => {
    if (totalItems === 0) {
      router.replace('/shop');
    }
  }, [totalItems, router]);

  if (totalItems === 0) return null;

  return (
    <div className="pt-20 min-h-screen bg-[var(--color-bg)]">
      <CheckoutForm />
    </div>
  );
}
