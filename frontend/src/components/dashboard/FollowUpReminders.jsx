import { Bell, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from '../ui/StatusBadge';

export default function FollowUpReminders({ followUps }) {
  if (!followUps?.length) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-[var(--text)]">Follow-ups This Week</h3>
        <span className="ml-auto text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
          {followUps.length}
        </span>
      </div>
      <div className="space-y-2">
        {followUps.map(f => (
          <div key={f._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-2)]">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">{f.companyName}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{f.role}</p>
            </div>
            <StatusBadge status={f.status} />
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
              <Calendar size={11} />
              {format(new Date(f.followUpDate), 'dd MMM')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
