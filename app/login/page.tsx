'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: unknown; // Replace with a proper User type if/when you define one
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // 🚦 Redirect if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn')) {
      router.push('/orders');
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await res.json();

    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');

      // 🚀 Redirect to stored path or menu page
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/menu';
      localStorage.removeItem('redirectAfterLogin');

      router.push(redirectTo);
    } else {
      setMessage(`❌ Login failed: ${data.message ?? 'Unknown error'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🔐 Login</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
