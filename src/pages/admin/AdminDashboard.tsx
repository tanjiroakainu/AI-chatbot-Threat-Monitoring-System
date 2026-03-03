import { Link } from 'react-router-dom';
import { threatReports, raidBookings, drugMonitoring } from '../../data/store';

export default function AdminDashboard() {
  const pendingThreats = threatReports.filter((t) => t.status !== 'resolved').length;
  const pendingRaids = raidBookings.filter((r) => r.status === 'pending').length;
  const activeDrugs = drugMonitoring.filter((d) => d.status !== 'seized').length;

  const cards = [
    { label: 'Threat reports', value: threatReports.length, pending: pendingThreats, to: '/admin/threats' },
    { label: 'Raid bookings', value: raidBookings.length, pending: pendingRaids, to: '/admin/raids' },
    { label: 'Drug monitoring', value: drugMonitoring.length, active: activeDrugs, to: '/admin/drugs' },
  ];

  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 sm:mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, pending, active, to }) => (
          <Link
            key={to}
            to={to}
            className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 transition hover:border-amber-500/50 hover:bg-zinc-800/50"
          >
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{value}</p>
            {(pending !== undefined && pending > 0) && (
              <p className="mt-1 text-sm text-amber-400">{pending} pending</p>
            )}
            {(active !== undefined && active > 0) && (
              <p className="mt-1 text-sm text-rose-400">{active} active</p>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-zinc-200 mb-4">Quick links</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link to="/admin/threats" className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/30">
            View threat reports
          </Link>
          <Link to="/admin/raids" className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/30">
            Raid bookings
          </Link>
          <Link to="/admin/drugs" className="rounded-lg bg-rose-500/20 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/30">
            Drug monitoring
          </Link>
        </div>
      </div>
    </div>
  );
}
