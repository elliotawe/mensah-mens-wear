'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Megaphone, ShoppingBag, ExternalLink, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingBag },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    sessionStorage.removeItem('mensah_admin_auth');
    router.replace('/admin');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-obsidian)' }}>
      {/* Top bar */}
      <header
        className="h-12 flex items-center justify-between px-6 border-b shrink-0"
        style={{ background: 'var(--color-charcoal)', borderColor: 'rgba(201,168,76,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/mensah_logo.png"
            alt="Mensah"
            width={80}
            height={22}
            className="h-5 w-auto brightness-0 invert opacity-80"
          />
          <span className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)]">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[var(--color-taupe)] hover:text-[var(--color-parchment)] font-accent text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
          aria-label="Log out"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <nav
          className="hidden md:flex flex-col w-[240px] shrink-0 border-r py-6"
          style={{ background: '#111111', borderColor: 'rgba(255,255,255,0.06)' }}
          aria-label="Admin navigation"
        >
          <ul className="flex flex-col gap-1 px-3 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-[4px] font-body text-sm transition-colors duration-200',
                      active
                        ? 'text-[var(--color-gold)] bg-[var(--color-gold-muted)] border border-[rgba(201,168,76,0.25)]'
                        : 'text-[var(--color-taupe)] hover:text-[var(--color-parchment)] hover:bg-white/5 border border-transparent'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-[var(--color-taupe)] hover:text-[var(--color-parchment)] font-body text-sm transition-colors"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              View Store
            </a>
          </div>
        </nav>

        {/* Mobile bottom tab bar */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex border-t z-20"
          style={{ background: '#111111', borderColor: 'rgba(255,255,255,0.06)', zIndex: 20 }}
          aria-label="Admin navigation"
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-3 gap-1 font-accent text-[9px] tracking-widest uppercase transition-colors',
                  active ? 'text-[var(--color-gold)]' : 'text-[var(--color-taupe)]'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
