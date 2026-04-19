import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { STATUSES, LOCATION_TYPES, SOURCES, INTERVIEW_TYPES, ROUND_RESULTS } from '../../utils/constants';

const defaultForm = {
  companyName: '', role: '', locationType: 'Remote', city: '', status: 'Applied',
  dateApplied: new Date().toISOString().split('T')[0], followUpDate: '', resultDate: '',
  hasOA: false, oaDate: '', oaScore: '', oaNotes: '',
  interviewRounds: [],
  jobDescriptionLink: '', salary: '', source: 'LinkedIn',
  hasReferral: false, referrerName: '',
  contactName: '', contactEmail: '',
  resumeVersion: '', notes: '', starred: false,
};

export default function ApplicationForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(defaultForm);
  const [tab, setTab] = useState('basic');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      const cleaned = { ...defaultForm, ...initial };
      if (cleaned.dateApplied) cleaned.dateApplied = cleaned.dateApplied.split('T')[0];
      if (cleaned.followUpDate) cleaned.followUpDate = cleaned.followUpDate.split('T')[0];
      if (cleaned.resultDate) cleaned.resultDate = cleaned.resultDate.split('T')[0];
      if (cleaned.oaDate) cleaned.oaDate = cleaned.oaDate.split('T')[0];
      setForm(cleaned);
    } else {
      setForm(defaultForm);
    }
    setTab('basic');
  }, [initial, open]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target ? e.target.value : e }));
  const toggle = (field) => () => setForm(f => ({ ...f, [field]: !f[field] }));

  const addRound = () => setForm(f => ({
    ...f,
    interviewRounds: [...f.interviewRounds, { round: f.interviewRounds.length + 1, type: 'Technical', date: '', notes: '', result: 'Pending' }],
  }));

  const updateRound = (i, field, value) => setForm(f => {
    const rounds = [...f.interviewRounds];
    rounds[i] = { ...rounds[i], [field]: value };
    return { ...f, interviewRounds: rounds };
  });

  const removeRound = (i) => setForm(f => ({
    ...f,
    interviewRounds: f.interviewRounds.filter((_, idx) => idx !== i),
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(form); onClose(); }
    finally { setLoading(false); }
  };

  const TABS = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'process', label: 'Process' },
    { id: 'details', label: 'Details' },
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative card w-full max-w-2xl max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <h2 className="font-display text-lg font-bold text-[var(--text)]">
              {initial ? 'Edit Application' : 'Add Application'}
            </h2>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-5 pt-4">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {tab === 'basic' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Company Name *</label>
                    <input className="input" value={form.companyName} onChange={set('companyName')} required placeholder="Google, Meta..." />
                  </div>
                  <div>
                    <label className="label">Role / Job Title *</label>
                    <input className="input" value={form.role} onChange={set('role')} required placeholder="SWE, Product Manager..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Status</label>
                    <select className="input" value={form.status} onChange={set('status')}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Date Applied</label>
                    <input className="input" type="date" value={form.dateApplied} onChange={set('dateApplied')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Location Type</label>
                    <select className="input" value={form.locationType} onChange={set('locationType')}>
                      {LOCATION_TYPES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city} onChange={set('city')} placeholder="Bangalore, Mumbai..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Source</label>
                    <select className="input" value={form.source} onChange={set('source')}>
                      {SOURCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Salary / CTC</label>
                    <input className="input" value={form.salary} onChange={set('salary')} placeholder="₹12 LPA, $120k..." />
                  </div>
                </div>

                <div>
                  <label className="label">Job Description Link</label>
                  <input className="input" value={form.jobDescriptionLink} onChange={set('jobDescriptionLink')} placeholder="https://..." />
                </div>
              </>
            )}

            {tab === 'process' && (
              <>
                {/* Online Assessment */}
                <div className="card p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={form.hasOA} onChange={toggle('hasOA')} />
                      <div className="w-9 h-5 bg-[var(--border)] rounded-full peer peer-checked:bg-[var(--accent)] transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </label>
                    <span className="text-sm font-medium text-[var(--text)]">Online Assessment</span>
                  </div>
                  {form.hasOA && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">OA Date</label>
                        <input className="input" type="date" value={form.oaDate} onChange={set('oaDate')} />
                      </div>
                      <div>
                        <label className="label">Score</label>
                        <input className="input" value={form.oaScore} onChange={set('oaScore')} placeholder="e.g. 280/300" />
                      </div>
                      <div className="col-span-2">
                        <label className="label">OA Notes</label>
                        <textarea className="input resize-none" rows={2} value={form.oaNotes} onChange={set('oaNotes')} placeholder="Platform, difficulty, topics..." />
                      </div>
                    </div>
                  )}
                </div>

                {/* Interview Rounds */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--text)]">Interview Rounds</h3>
                    <button type="button" onClick={addRound} className="btn-secondary text-xs py-1.5 px-3">
                      <Plus size={13} /> Add Round
                    </button>
                  </div>
                  {form.interviewRounds.map((round, i) => (
                    <div key={i} className="card p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text)]">Round {round.round}</span>
                        <button type="button" onClick={() => removeRound(i)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="label">Type</label>
                          <select className="input" value={round.type} onChange={e => updateRound(i, 'type', e.target.value)}>
                            {INTERVIEW_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">Date</label>
                          <input className="input" type="date" value={round.date?.split('T')[0] || ''} onChange={e => updateRound(i, 'date', e.target.value)} />
                        </div>
                        <div>
                          <label className="label">Result</label>
                          <select className="input" value={round.result} onChange={e => updateRound(i, 'result', e.target.value)}>
                            {ROUND_RESULTS.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="label">Notes</label>
                        <textarea className="input resize-none" rows={2} value={round.notes} onChange={e => updateRound(i, 'notes', e.target.value)} placeholder="Topics covered, feedback..." />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Follow-up Date</label>
                    <input className="input" type="date" value={form.followUpDate} onChange={set('followUpDate')} />
                  </div>
                  <div>
                    <label className="label">Result Date</label>
                    <input className="input" type="date" value={form.resultDate} onChange={set('resultDate')} />
                  </div>
                </div>
              </>
            )}

            {tab === 'details' && (
              <>
                {/* Referral */}
                <div className="card p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={form.hasReferral} onChange={toggle('hasReferral')} />
                      <div className="w-9 h-5 bg-[var(--border)] rounded-full peer peer-checked:bg-[var(--accent)] transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </label>
                    <span className="text-sm font-medium text-[var(--text)]">Referred by someone</span>
                  </div>
                  {form.hasReferral && (
                    <input className="input" value={form.referrerName} onChange={set('referrerName')} placeholder="Referrer's name..." />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">HR / Contact Name</label>
                    <input className="input" value={form.contactName} onChange={set('contactName')} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="label">Contact Email</label>
                    <input className="input" type="email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="hr@company.com" />
                  </div>
                </div>

                <div>
                  <label className="label">Resume Version</label>
                  <input className="input" value={form.resumeVersion} onChange={set('resumeVersion')} placeholder="v3-swe-2024, tailored-ml..." />
                </div>

                <div>
                  <label className="label">Notes</label>
                  <textarea className="input resize-none" rows={4} value={form.notes} onChange={set('notes')} placeholder="Company culture, your impressions, follow-up actions..." />
                </div>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-[var(--border)]">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary min-w-[120px] justify-center">
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : initial ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
