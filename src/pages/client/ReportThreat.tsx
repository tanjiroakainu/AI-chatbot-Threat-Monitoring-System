import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addThreatReport } from '../../data/store';
import type { ThreatReport } from '../../types';

const severityOptions: ThreatReport['severity'][] = ['low', 'medium', 'high', 'critical'];

export default function ReportThreat() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<ThreatReport['severity']>('medium');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !description.trim() || !location.trim()) return;
    addThreatReport({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      severity,
      status: 'pending',
      reportedBy: user.email,
    });
    setSuccess(true);
    setTimeout(() => navigate('/client'), 1500);
  };

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-zinc-900/80 p-8 text-center">
        <p className="text-emerald-400 font-medium">Threat report submitted successfully.</p>
        <p className="text-zinc-400 text-sm mt-1">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 sm:mb-6">Report a threat</h1>
      <div className="max-w-xl rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder="Brief title for the threat"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
              placeholder="Describe what you observed"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder="Address or area"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as ThreatReport['severity'])}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            >
              {severityOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              Submit report
            </button>
            <button
              type="button"
              onClick={() => navigate('/client')}
              className="rounded-lg border border-zinc-600 px-6 py-2.5 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
