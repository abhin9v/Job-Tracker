import { motion } from 'framer-motion';
import { STATUS_COLORS } from '../../utils/constants';

export default function StatsGrid({ total, statusCounts }) {
  const counts = {};
  statusCounts?.forEach(({ _id, count }) => { counts[_id] = count; });

  const cards = [
    { label: 'Total Applied', value: total, color: '#0d93e7' },
    { label: 'Interviews', value: counts['Interview'] || 0, color: STATUS_COLORS.Interview },
    { label: 'Offers', value: counts['Offer'] || 0, color: STATUS_COLORS.Offer },
    { label: 'Rejected', value: counts['Rejected'] || 0, color: STATUS_COLORS.Rejected },
    { label: 'Ghosted', value: counts['Ghosted'] || 0, color: STATUS_COLORS.Ghosted },
    { label: 'In OA', value: counts['OA'] || 0, color: STATUS_COLORS.OA },
  ];

  const conversionRate = total > 0
    ? Math.round(((counts['Interview'] || 0) / total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card p-4"
        >
          <div className="text-2xl font-display font-bold mb-1" style={{ color: c.color }}>
            {c.value}
          </div>
          <div className="text-xs text-[var(--text-muted)]">{c.label}</div>
          {c.label === 'Total Applied' && total > 0 && (
            <div className="text-[10px] text-[var(--text-muted)] mt-1">{conversionRate}% → interview</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
