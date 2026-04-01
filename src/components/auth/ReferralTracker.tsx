'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      console.log('Referral detected:', ref);
      // Store in localStorage for 30 days
      localStorage.setItem('gastroguide_ref', ref);
      // Also store in cookie for server-side accessibility if needed
      document.cookie = `gastroguide_ref=${ref}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}
