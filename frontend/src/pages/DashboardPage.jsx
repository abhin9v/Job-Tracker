import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatsGrid from '../components/dashboard/StatsGrid';
import { TimelineChart, StatusPieChart, SourceChart } from '../components/dashboard/Charts';
import FollowUpReminders from '../components/dashboard/FollowUpReminders';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Here's your job search overview</p>
      </div>

      {/* Stats */}
      <StatsGrid total={stats?.total || 0} statusCounts={stats?.statusCounts || []} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimelineChart data={stats?.timeline} />
        <StatusPieChart data={stats?.statusCounts} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SourceChart data={stats?.sourceCounts} />
        <FollowUpReminders followUps={stats?.followUps} />
      </div>
    </div>
  );
}
