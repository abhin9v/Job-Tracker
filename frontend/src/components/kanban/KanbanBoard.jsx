import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, MapPin, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { STATUSES, STATUS_COLORS } from '../../utils/constants';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function KanbanCard({ app, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-3 cursor-default group hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-semibold text-[var(--text)] leading-tight">{app.companyName}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{app.role}</p>
        </div>
        {app.starred && <Star size={12} className="text-amber-400 shrink-0 mt-0.5" fill="currentColor" />}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-3">
        <span className="flex items-center gap-0.5"><MapPin size={10} /> {app.locationType}</span>
        {app.dateApplied && (
          <span className="flex items-center gap-0.5">
            <Calendar size={10} /> {format(new Date(app.dateApplied), 'dd MMM')}
          </span>
        )}
      </div>

      {app.salary && (
        <p className="text-[11px] text-[var(--text-muted)] mb-2">{app.salary}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[10px] bg-[var(--surface-2)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">
          {app.source}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(app)} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent)]">
            <Edit2 size={11} />
          </button>
          <button onClick={() => onDelete(app._id)} className="p-1 rounded text-[var(--text-muted)] hover:text-red-500">
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function KanbanBoard({ onEdit, onDelete, refreshKey }) {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/applications', { params: { limit: 200 } });
      const grouped = {};
      STATUSES.forEach(s => { grouped[s] = []; });
      data.applications.forEach(app => {
        if (grouped[app.status]) grouped[app.status].push(app);
      });
      setColumns(grouped);
    } catch {
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [refreshKey]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {STATUSES.map(status => (
        <div key={status} className="shrink-0 w-64">
          {/* Column header */}
          <div className={`card border-t-2 mb-3`} style={{ borderTopColor: STATUS_COLORS[status] }}>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm font-semibold text-[var(--text)]">{status}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${STATUS_COLORS[status]}20`, color: STATUS_COLORS[status] }}
              >
                {columns[status]?.length || 0}
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            <AnimatePresence>
              {(columns[status] || []).map(app => (
                <KanbanCard
                  key={app._id}
                  app={app}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
            {(columns[status] || []).length === 0 && (
              <div className="text-center py-6 text-[var(--text-muted)] text-xs border-2 border-dashed border-[var(--border)] rounded-xl">
                No applications
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
