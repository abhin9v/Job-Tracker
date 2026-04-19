import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { STATUS_COLORS } from '../../utils/constants';

const CHART_STYLE = {
  fontSize: 11,
  fontFamily: 'DM Sans, sans-serif',
};

export function TimelineChart({ data }) {
  const formatted = (data || []).map(d => ({
    date: format(parseISO(d._id), 'MMM d'),
    count: d.count,
  }));

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Applications Over Time (30 days)</h3>
      {formatted.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-8">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={formatted} style={CHART_STYLE}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d93e7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0d93e7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--text)' }}
            />
            <Area type="monotone" dataKey="count" stroke="#0d93e7" strokeWidth={2} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function StatusPieChart({ data }) {
  const formatted = (data || []).map(d => ({ name: d._id, value: d.count, color: STATUS_COLORS[d._id] || '#9ca3af' }));

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Status Breakdown</h3>
      {formatted.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-8">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={formatted} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
              {formatted.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function SourceChart({ data }) {
  const formatted = (data || []).map(d => ({ name: d._id, count: d.count }));

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Applications by Source</h3>
      {formatted.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-8">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formatted} style={CHART_STYLE}>
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="count" fill="#0d93e7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
