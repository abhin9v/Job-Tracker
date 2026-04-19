import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, Grid, List } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import ApplicationCard from '../components/applications/ApplicationCard';
import ApplicationForm from '../components/applications/ApplicationForm';
import FilterBar from '../components/applications/FilterBar';
import toast from 'react-hot-toast';

const defaultFilters = { search: '', status: '', locationType: '', source: '', sort: '-dateApplied', starred: false };

export default function ApplicationsPage() {
  const { applications, total, loading, fetch, create, update, remove, toggleStar, exportCSV } = useApplications();
  const [filters, setFilters] = useState(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    const params = { ...filters };
    if (!params.status) delete params.status;
    if (!params.locationType) delete params.locationType;
    if (!params.source) delete params.source;
    if (!params.search) delete params.search;
    if (!params.starred) delete params.starred;
    fetch(params);
  }, [filters, fetch]);

  useEffect(() => {
    const t = setTimeout(load, 200); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  const handleSubmit = async (data) => {
    if (editing) {
      await update(editing._id, data);
    } else {
      await create(data);
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    await remove(id);
    load();
  };

  const openEdit = (app) => { setEditing(app); setFormOpen(true); };
  const openAdd = () => { setEditing(null); setFormOpen(true); };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Applications</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {loading ? 'Loading...' : `${total} total application${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="btn-secondary text-xs">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Application
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-[var(--text)] font-medium">No applications yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Add your first application to get started</p>
          <button onClick={openAdd} className="btn-primary mt-4">
            <Plus size={16} /> Add Application
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <AnimatePresence>
            {applications.map(app => (
              <ApplicationCard
                key={app._id}
                app={app}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleStar={toggleStar}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Form modal */}
      <ApplicationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
