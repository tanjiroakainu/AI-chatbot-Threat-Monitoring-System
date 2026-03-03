import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password required.');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/client');
    } else {
      setError(result.error ?? 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950/70">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-amber-500/30 bg-zinc-900/80 p-6 sm:p-8 shadow-xl shadow-amber-500/5">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight mb-1">Threat Monitoring System</h1>
          <p className="text-zinc-400 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 py-2.5 font-medium text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            No account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium">
              Register as client
            </Link>
          </p>
          <p className="mt-4 text-center text-sm text-zinc-400">
            <Link to="/" className="text-amber-400 hover:text-amber-300 font-medium">
              ← Home
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-500">
          Admin: admin@gmail.com / admin123 · Client: client@example.com / client123
        </p>
        <p className="mt-2 text-center text-xs text-zinc-600">Developer: Raminder Jangao</p>
      </div>
    </div>
  );
}
