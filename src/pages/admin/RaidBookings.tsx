import { useState } from 'react';
import { raidBookings, updateRaidStatus } from '../../data/store';
import type { RaidBooking as RaidType } from '../../types';
import Modal from '../../components/Modal';

const statusColors: Record<RaidType['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-zinc-500/20 text-zinc-400',
};

const statusOptions: RaidType['status'][] = ['pending', 'approved', 'completed', 'cancelled'];

export default function RaidBookings() {
  const [bookings, setBookings] = useState(raidBookings);
  const [viewBooking, setViewBooking] = useState<RaidType | null>(null);

  const refresh = () => setBookings([...raidBookings]);

  const handleStatusChange = (id: string, status: RaidType['status']) => {
    updateRaidStatus(id, status);
    refresh();
    if (viewBooking?.id === id) setViewBooking({ ...viewBooking, status });
  };

  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 sm:mb-6">Raid bookings</h1>
      <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900/50">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th className="p-3 sm:p-4 font-medium">Location</th>
              <th className="p-3 sm:p-4 font-medium hidden sm:table-cell">Scheduled</th>
              <th className="p-3 sm:p-4 font-medium">Purpose</th>
              <th className="p-3 sm:p-4 font-medium">Status</th>
              <th className="p-3 sm:p-4 font-medium hidden md:table-cell">Requested by</th>
              <th className="p-3 sm:p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                <td className="p-3 sm:p-4 font-medium text-white">{r.location}</td>
                <td className="p-3 sm:p-4 text-zinc-300 hidden sm:table-cell">
                  {new Date(r.scheduledDate).toLocaleDateString()}
                </td>
                <td className="p-3 sm:p-4 text-zinc-300">{r.purpose}</td>
                <td className="p-3 sm:p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-zinc-500 hidden md:table-cell">{r.requestedBy}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setViewBooking(r)}
                      className="rounded bg-zinc-600/50 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
                    >
                      View
                    </button>
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(r.id, 'approved')}
                          className="rounded bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(r.id, 'cancelled')}
                          className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'completed')}
                        className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/30"
                      >
                        Mark completed
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!viewBooking} onClose={() => setViewBooking(null)} title="Raid booking details">
        {viewBooking && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-white font-medium">{viewBooking.location}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Scheduled date</p>
              <p className="text-zinc-300">{new Date(viewBooking.scheduledDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Purpose</p>
              <p className="text-zinc-300">{viewBooking.purpose}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Requested by</p>
              <p className="text-zinc-400 text-sm">{viewBooking.requestedBy}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Requested at</p>
              <p className="text-zinc-400 text-sm">{new Date(viewBooking.requestedAt).toLocaleString()}</p>
            </div>
            <div className="pt-3 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Change status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(viewBooking.id, status)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${viewBooking.status === status ? 'ring-2 ring-amber-500 ' : ''}${statusColors[status]}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
