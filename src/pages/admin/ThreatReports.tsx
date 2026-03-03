import { useState } from 'react';
import { threatReports, updateThreatStatus } from '../../data/store';
import type { ThreatReport } from '../../types';
import Modal from '../../components/Modal';

const statusColors: Record<ThreatReport['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  investigating: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-emerald-500/20 text-emerald-400',
};

const severityColors: Record<ThreatReport['severity'], string> = {
  low: 'text-zinc-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400 font-semibold',
};

const statusOptions: ThreatReport['status'][] = ['pending', 'investigating', 'resolved'];

export default function ThreatReports() {
  const [reports, setReports] = useState(threatReports);
  const [viewReport, setViewReport] = useState<ThreatReport | null>(null);

  const refresh = () => setReports([...threatReports]);

  const handleStatusChange = (id: string, status: ThreatReport['status']) => {
    updateThreatStatus(id, status);
    refresh();
    if (viewReport?.id === id) setViewReport({ ...viewReport, status });
  };

  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 sm:mb-6">Threat reports</h1>
      <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900/50">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th className="p-3 sm:p-4 font-medium">Title</th>
              <th className="p-3 sm:p-4 font-medium hidden md:table-cell">Location</th>
              <th className="p-3 sm:p-4 font-medium">Severity</th>
              <th className="p-3 sm:p-4 font-medium">Status</th>
              <th className="p-3 sm:p-4 font-medium hidden sm:table-cell">Reported</th>
              <th className="p-3 sm:p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                <td className="p-3 sm:p-4">
                  <p className="font-medium text-white">{r.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{r.description}</p>
                </td>
                <td className="p-3 sm:p-4 text-zinc-300 hidden md:table-cell">{r.location}</td>
                <td className={`p-3 sm:p-4 ${severityColors[r.severity]}`}>{r.severity}</td>
                <td className="p-3 sm:p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-zinc-500 hidden sm:table-cell">
                  {new Date(r.reportedAt).toLocaleDateString()}
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setViewReport(r)}
                      className="rounded bg-zinc-600/50 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
                    >
                      View
                    </button>
                    {r.status !== 'investigating' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'investigating')}
                        className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/30"
                      >
                        Investigating
                      </button>
                    )}
                    {r.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'resolved')}
                        className="rounded bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/30"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!viewReport}
        onClose={() => setViewReport(null)}
        title="Threat report details"
      >
        {viewReport && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Title</p>
              <p className="text-white font-medium">{viewReport.title}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Description</p>
              <p className="text-zinc-300">{viewReport.description}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-zinc-300">{viewReport.location}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Severity</p>
                <p className={`${severityColors[viewReport.severity]}`}>{viewReport.severity}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Reported by</p>
                <p className="text-zinc-400 text-sm">{viewReport.reportedBy}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Reported</p>
                <p className="text-zinc-400 text-sm">{new Date(viewReport.reportedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Change status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(viewReport.id, status)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${viewReport.status === status ? 'ring-2 ring-amber-500 ' : ''}${statusColors[status]}`}
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
