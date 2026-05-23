'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminGate() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        sessionStorage.setItem('mensah_admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, var(--color-obsidian) 0%, #1A1408 100%)' }}
    >
      <div
        className="w-full max-w-[400px] rounded-[8px] p-10 flex flex-col gap-8"
        style={{
          background: 'var(--color-charcoal)',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/mensah_logo.png"
            alt="Mensah"
            width={120}
            height={32}
            className="h-8 w-auto brightness-0 invert opacity-90"
          />
          <span className="gold-rule mx-auto" aria-hidden="true" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-300 text-[var(--color-parchment)] mb-2">Staff Access</h1>
          <p className="font-body text-xs text-[var(--color-taupe)]">
            Enter your credentials to manage Mensah.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-pw" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-pw"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                className="w-full bg-transparent border-b border-[var(--color-taupe)]/40 py-3 pr-10 font-body text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-taupe)]/50 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={error}
                aria-describedby={error ? 'pw-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-taupe)] hover:text-[var(--color-parchment)] transition-colors cursor-pointer"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && (
              <p id="pw-error" className="font-body text-xs text-[var(--color-error)]" role="alert">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[11px] tracking-widest uppercase rounded-[4px] hover:bg-[var(--color-gold-light)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                Verifying…
              </>
            ) : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
