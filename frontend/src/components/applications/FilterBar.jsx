import { Search, SlidersHorizontal, X } from 'lucide-react';
import { STATUSES, LOCATION_TYPES, SOURCES, SORT_OPTIONS } from '../../utils/constants';

export default function FilterBar({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const clear = () => onChange({ search: '', status: '', locationType: '', source: '', sort: '-dateApplied', starred: false });
  const hasFilters = filters.search || filters.status || filters.locationType || filters.source || filters.starred;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          className="input pl-9"
          placeholder="Search company or role..."
          value={filters.search}
          onChange={set('search')}
        />
      </div>

      {/* Status */}
      <select className="input w-auto min-w-[130px]" value={filters.status} onChange={set('status')}>
        <option value="">All Status</option>
        {STATUSES.map(s => <option key={s}>{s}</option>)}
      </select>

      {/* Location */}
      <select className="input w-auto min-w-[120px]" value={filters.locationType} onChange={set('locationType')}>
        <option value="">All Locations</option>
        {LOCATION_TYPES.map(l => <option key={l}>{l}</option>)}
      </select>

      {/* Source */}
      <select className="input w-auto min-w-[120px]" value={filters.source} onChange={set('source')}>
        <option value="">All Sources</option>
        {SOURCES.map(s => <option key={s}>{s}</option>)}
      </select>

      {/* Sort */}
      <select className="input w-auto min-w-[180px]" value={filters.sort} onChange={set('sort')}>
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Starred toggle */}
      <button
        onClick={() => onChange({ ...filters, starred: !filters.starred })}
        className={`btn-secondary py-2.5 text-xs ${filters.starred ? 'border-amber-400 text-amber-500' : ''}`}
      >
        ★ Starred
      </button>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clear} className="btn-ghost text-xs py-2.5">
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}
