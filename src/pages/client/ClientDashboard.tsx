import { Link } from 'react-router-dom';
import { threatReports, raidBookings } from '../../data/store';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboard() {
  const { user } = useAuth();
  const myReports = threatReports.filter((r) => r.reportedBy === user?.email);
  const myRaids = raidBookings.filter((r) => r.requestedBy === user?.email);

  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">Dashboard</h1>
      <p className="text-zinc-400 mb-6">Welcome, {user?.name}. Manage your reports and raid bookings.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-zinc-200 mb-2">My threat reports</h2>
          <p className="text-3xl font-bold text-amber-400">{myReports.length}</p>
          <Link to="/client/report-threat" className="mt-3 inline-block text-sm text-amber-400 hover:text-amber-300">
            Report a threat →
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-zinc-200 mb-2">My raid bookings</h2>
          <p className="text-3xl font-bold text-emerald-400">{myRaids.length}</p>
          <Link to="/client/book-raid" className="mt-3 inline-block text-sm text-emerald-400 hover:text-emerald-300">
            Book a raid →
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">Recent activity</h2>
        <ul className="space-y-2 text-sm text-zinc-400">
          {myReports.slice(0, 3).map((r) => (
            <li key={r.id} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
              <span className="text-zinc-300">{r.title}</span>
              <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs">{r.status}</span>
            </li>
          ))}
          {myReports.length === 0 && myRaids.length === 0 && (
            <li className="text-zinc-500">No activity yet. Report a threat or book a raid.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
