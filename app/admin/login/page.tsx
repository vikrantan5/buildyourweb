'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { signInAction } from '@/actions/auth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    const res = await signInAction(values.email, values.password);
    setLoading(false);
    if (res.ok) {
      router.push(params.get('next') || '/admin');
      router.refresh();
    } else {
      toast.error(res.error ?? 'Login failed');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5">
      <div className="absolute h-80 w-80 rounded-full bg-violett/15 blur-[110px]" aria-hidden />
      <div className="relative w-full max-w-sm rounded-2xl glass p-8" data-testid="admin-login-card">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-violett font-display font-bold">W</span>
          <div>
            <h1 className="font-display text-lg font-bold">Admin Login</h1>
            <p className="text-xs text-white/45">Owner access only</p>
          </div>
        </div>
        {params.get('error') === 'not-admin' && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300">
            This account doesn&apos;t have admin access.
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="admin-login-form">
          <label className="block">
            <span className="mb-1.5 block text-xs text-white/60">Email</span>
            <input type="email" autoComplete="email" data-testid="admin-login-email" {...register('email')}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-electric/60" />
            {errors.email && <span className="mt-1 block text-xs text-red-400">{errors.email.message}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-white/60">Password</span>
            <input type="password" autoComplete="current-password" data-testid="admin-login-password" {...register('password')}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-electric/60" />
            {errors.password && <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>}
          </label>
          <button type="submit" disabled={loading} data-testid="admin-login-submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett py-3 font-semibold disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={15} /> Sign in</>}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-xs text-white/40 hover:text-white/70">← Back to site</a>
      </div>
    </main>
  );
}
