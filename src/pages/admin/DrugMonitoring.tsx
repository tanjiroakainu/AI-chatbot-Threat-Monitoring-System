import { useState } from 'react';
import {
  drugMonitoring,
  addDrugRecord,
  updateDrugStatus,
  updateDrugRecord,
  deleteDrugRecord,
} from '../../data/store';
import type { DrugMonitoring as DrugType } from '../../types';
import Modal from '../../components/Modal';

const statusColors: Record<DrugType['status'], string> = {
  reported: 'bg-yellow-500/20 text-yellow-400',
  seized: 'bg-emerald-500/20 text-emerald-400',
  under_investigation: 'bg-blue-500/20 text-blue-400',
};

const statusOptions: DrugType['status'][] = ['reported', 'under_investigation', 'seized'];

export default function DrugMonitoringPage() {
  const [records, setRecords] = useState(drugMonitoring);
  const [viewRecord, setViewRecord] = useState<DrugType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DrugType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = () => setRecords([...drugMonitoring]);

  const handleStatusChange = (id: string, status: DrugType['status']) => {
    updateDrugStatus(id, status);
    refresh();
    if (viewRecord?.id === id) setViewRecord({ ...viewRecord, status });
  };

  const handleDelete = (id: string) => {
    deleteDrugRecord(id);
    refresh();
    setDeleteConfirm(null);
    if (viewRecord?.id === id) setViewRecord(null);
    if (editingRecord?.id === id) setEditingRecord(null);
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Drug monitoring</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 transition-colors w-full sm:w-auto"
        >
          Add record
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900/50">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th className="p-3 sm:p-4 font-medium">Substance</th>
              <th className="p-3 sm:p-4 font-medium hidden md:table-cell">Location</th>
              <th className="p-3 sm:p-4 font-medium">Quantity</th>
              <th className="p-3 sm:p-4 font-medium">Status</th>
              <th className="p-3 sm:p-4 font-medium hidden sm:table-cell">Reported</th>
              <th className="p-3 sm:p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                <td className="p-3 sm:p-4 font-medium text-white">{r.substance}</td>
                <td className="p-3 sm:p-4 text-zinc-300 hidden md:table-cell">{r.location}</td>
                <td className="p-3 sm:p-4 text-zinc-300">{r.quantity}</td>
                <td className="p-3 sm:p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColors[r.status]}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-zinc-500 hidden sm:table-cell">
                  {new Date(r.reportedAt).toLocaleDateString()}
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setViewRecord(r)}
                      className="rounded bg-zinc-600/50 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditingRecord(r)}
                      className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(r.id)}
                      className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View + Change status modal */}
      <Modal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="Drug record details"
      >
        {viewRecord && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Substance</p>
              <p className="text-white font-medium">{viewRecord.substance}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-zinc-300">{viewRecord.location}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Quantity</p>
              <p className="text-zinc-300">{viewRecord.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Reported</p>
              <p className="text-zinc-400 text-sm">{new Date(viewRecord.reportedAt).toLocaleString()}</p>
            </div>
            <div className="pt-3 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Change status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(viewRecord.id, status)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${viewRecord.status === status ? 'ring-2 ring-amber-500 ' : ''}${statusColors[status]}`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add record modal */}
      <AddEditDrugModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={(data) => {
          addDrugRecord(data);
          refresh();
          setShowAdd(false);
        }}
      />

      {/* Edit record modal */}
      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Edit drug record"
      >
        {editingRecord && (
          <EditDrugForm
            record={editingRecord}
            onSave={(data) => {
              updateDrugRecord(editingRecord.id, data);
              refresh();
              setEditingRecord(null);
            }}
            onCancel={() => setEditingRecord(null)}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete record"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-zinc-300">Are you sure you want to delete this drug monitoring record?</p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AddEditDrugModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { substance: string; location: string; quantity: string; status: DrugType['status'] }) => void;
}) {
  const [substance, setSubstance] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState<DrugType['status']>('reported');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!substance.trim() || !location.trim() || !quantity.trim()) return;
    onSave({ substance: substance.trim(), location: location.trim(), quantity: quantity.trim(), status });
    setSubstance('');
    setLocation('');
    setQuantity('');
    setStatus('reported');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add drug record">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Substance</label>
          <input
            type="text"
            value={substance}
            onChange={(e) => setSubstance(e.target.value)}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DrugType['status'])}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400">
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditDrugForm({
  record,
  onSave,
  onCancel,
}: {
  record: DrugType;
  onSave: (data: { substance: string; location: string; quantity: string; status: DrugType['status'] }) => void;
  onCancel: () => void;
}) {
  const [substance, setSubstance] = useState(record.substance);
  const [location, setLocation] = useState(record.location);
  const [quantity, setQuantity] = useState(record.quantity);
  const [status, setStatus] = useState<DrugType['status']>(record.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!substance.trim() || !location.trim() || !quantity.trim()) return;
    onSave({ substance: substance.trim(), location: location.trim(), quantity: quantity.trim(), status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Substance</label>
        <input
          type="text"
          value={substance}
          onChange={(e) => setSubstance(e.target.value)}
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Quantity</label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as DrugType['status'])}
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white focus:border-amber-500 outline-none"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400">
          Save
        </button>
      </div>
    </form>
  );
}
