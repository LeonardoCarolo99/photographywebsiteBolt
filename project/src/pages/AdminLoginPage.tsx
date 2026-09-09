import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Camera, Lock, Mail, Loader2, UserPlus } from 'lucide-react';

export function AdminLoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.3) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Camera className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
            <span className="font-display text-2xl tracking-[0.3em] text-gold-400">APEX LENS</span>
          </div>
          <p className="mt-2 font-body text-xs uppercase tracking-wider text-gray-600">Admin Backoffice</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8">
          <h1 className="font-display text-3xl tracking-wide text-white">
            {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h1>
          <div className="mt-2 h-px w-16 bg-gold-400" />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/50 py-3 pl-10 pr-4 font-body text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gold-400/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-md border border-white/10 bg-black/50 py-3 pl-10 pr-4 font-body text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gold-400/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="font-body text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-400 px-6 py-3 font-body text-sm font-semibold text-black transition-all hover:bg-gold-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="font-body text-sm text-gray-500 transition-colors hover:text-gold-400"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="#/"
            className="font-body text-xs text-gray-600 transition-colors hover:text-gray-400"
          >
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
