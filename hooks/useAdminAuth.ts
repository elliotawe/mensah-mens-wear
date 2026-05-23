'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  useEffect(() => {
    const auth = sessionStorage.getItem('mensah_admin_auth');
    if (auth !== 'true') router.replace('/admin');
  }, [router]);
}
