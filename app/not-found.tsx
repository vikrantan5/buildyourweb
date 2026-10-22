import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-electric">Error 404</p>
      <h1 className="mt-4 font-display text-7xl md:text-9xl font-bold text-gradient">404</h1>
      <p className="mt-4 max-w-md text-white/60">
        This page shipped to production... without us. Let&apos;s get you back to something that works.
      </p>
      <Link
        href="/"
        data-cursor="Open"
        data-testid="not-found-home"
        className="mt-8 rounded-full bg-gradient-to-r from-electric to-violett px-7 py-3.5 font-semibold transition-transform hover:scale-105"
      >
        Back to home
      </Link>
    </main>
  );
}
