import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950/50">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 tracking-tight mb-3">
          Threat Monitoring System
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg mb-6 sm:mb-8">
          Threat reports, raid bookings, and drug monitoring for your organization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="w-full sm:w-auto rounded-xl bg-amber-500 px-8 py-3 font-medium text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto rounded-xl border border-amber-500/50 px-8 py-3 font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            Register as client
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto rounded-xl border border-zinc-500/50 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
          >
            Admin login
          </Link>
        </div>
        <p className="mt-8 text-sm text-zinc-500">Developer: Raminder Jangao</p>
      </div>
    </div>
  );
}
