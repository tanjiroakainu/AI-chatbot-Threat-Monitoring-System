import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password || !name.trim()) {
      setError('Name, email and password required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (register(email, password, name)) {
      navigate('/client');
    } else {
      setError('Email already registered. Try logging in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950/70">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-amber-500/30 bg-zinc-900/80 p-6 sm:p-8 shadow-xl shadow-amber-500/5">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight mb-1">Client registration</h1>
          <p className="text-zinc-400 text-sm mb-6">Create a client account for the Threat Monitoring System</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
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
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 py-2.5 font-medium text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">
              Sign in
            </Link>
          </p>
          <p className="mt-4 text-center text-sm text-zinc-400">
            <Link to="/" className="text-amber-400 hover:text-amber-300 font-medium">
              ← Home
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-600">Developer: Raminder Jangao</p>
      </div>
    </div>
  );
}
