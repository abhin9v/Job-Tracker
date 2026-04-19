import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Edit2, Trash2, ExternalLink, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from '../ui/StatusBadge';

export default function ApplicationCard({ app, onEdit, onDelete, onToggleStar }) {
  const [starred, setStarred] = useState(app.starred);

  const handleStar = async (e) => {
    e.stopPropagation();
    setStarred(s => !s);
    await onToggleStar(app._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="card p-4 hover:shadow-md transition-all duration-200 group cursor-default"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-[var(--text)] truncate text-sm">{app.companyName}</h3>
            {app.hasReferral && (
              <span className="shrink-0 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
                Referred
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate">{app.role}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleStar}
            className={`p-1 rounded-lg transition-colors ${starred ? 'text-amber-400' : 'text-[var(--border)] opacity-0 group-hover:opacity-100'}`}
          >
            <Star size={14} fill={starred ? 'currentColor' : 'none'} />
          </button>
          <StatusBadge status={app.status} />
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] mb-3">
        {app.city && (
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {app.locationType}{app.city ? ` · ${app.city}` : ''}
          </span>
        )}
        {!app.city && (
          <span className="flex items-center gap-1"><MapPin size={11} /> {app.locationType}</span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {app.dateApplied ? format(new Date(app.dateApplied), 'dd MMM yyyy') : '—'}
        </span>
        {app.salary && (
          <span className="flex items-center gap-1"><DollarSign size={11} /> {app.salary}</span>
        )}
        {app.contactName && (
          <span className="flex items-center gap-1"><User size={11} /> {app.contactName}</span>
        )}
      </div>

      {/* Interview rounds chips */}
      {app.interviewRounds?.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {app.interviewRounds.map((r, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                r.result === 'Passed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                r.result === 'Failed' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' :
                'bg-[var(--surface-2)] text-[var(--text-muted)]'
              }`}
            >
              R{r.round} {r.type}
            </span>
          ))}
        </div>
      )}

      {/* Source + actions */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[var(--text-muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-full">
          {app.source}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {app.jobDescriptionLink && (
            <a href={app.jobDescriptionLink} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)] transition-all"
              onClick={e => e.stopPropagation()}>
              <ExternalLink size={13} />
            </a>
          )}
          <button onClick={() => onEdit(app)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)] transition-all">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(app._id)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Follow-up reminder */}
      {app.followUpDate && new Date(app.followUpDate) >= new Date() && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <Calendar size={11} />
          Follow up: {format(new Date(app.followUpDate), 'dd MMM yyyy')}
        </div>
      )}
    </motion.div>
  );
}
