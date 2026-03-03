import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEVELOPER_NAME = 'Raminder Jangao';

interface LayoutProps {
  title: string;
  navItems: { to: string; label: string }[];
}

export default function Layout({ title, navItems }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col bg-zinc-950/75">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              to={user?.role === 'admin' ? '/admin' : '/client'}
              className="font-semibold text-amber-400 truncate shrink-0"
            >
              {title}
            </Link>
            <nav className="hidden md:flex gap-4 shrink-0">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors whitespace-nowrap"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-sm text-zinc-500 truncate max-w-[120px] sm:max-w-none">{user?.name}</span>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:block rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-900 px-4 py-3">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-zinc-400 hover:text-amber-400 py-2"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm text-zinc-400 hover:text-amber-400 py-2 md:hidden"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 min-w-0">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 bg-zinc-900/50 py-3 px-4 text-center text-xs text-zinc-500">
        Developer: {DEVELOPER_NAME}
      </footer>
    </div>
  );
}
