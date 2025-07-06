'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirects the root URL to /menu
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/menu');
  }, [router]);

  return null; // Could render a spinner or splash screen here
}
