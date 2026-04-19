import { useState } from 'react';
import { Plus } from 'lucide-react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import ApplicationForm from '../components/applications/ApplicationForm';
import { useApplications } from '../hooks/useApplications';
import toast from 'react-hot-toast';

export default function KanbanPage() {
  const { create, update, remove } = useApplications();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  const handleSubmit = async (data) => {
    if (editing) await update(editing._id, data);
    else await create(data);
    refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    await remove(id);
    refresh();
  };

  const openEdit = (app) => { setEditing(app); setFormOpen(true); };
  const openAdd = () => { setEditing(null); setFormOpen(true); };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Pipeline</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Kanban view of your application stages</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Application
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard onEdit={openEdit} onDelete={handleDelete} refreshKey={refreshKey} />
      </div>

      <ApplicationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
