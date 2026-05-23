import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <p className="eyebrow">404</p>
        <span className="gold-rule mx-auto" aria-hidden="true" />
        <h1 className="font-display text-4xl md:text-5xl font-300 text-[var(--color-text-primary)] italic">
          Page Not Found
        </h1>
        <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--color-obsidian)] text-[var(--color-parchment)] font-accent text-[11px] tracking-widest uppercase px-8 h-11 rounded-[6px] hover:bg-[var(--color-charcoal)] transition-colors duration-200 mt-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
