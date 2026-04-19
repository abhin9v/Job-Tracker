import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/applications', { params });
      setApplications(data.applications);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post('/applications', payload);
    toast.success('Application added!');
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.put(`/applications/${id}`, payload);
    toast.success('Application updated!');
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`/applications/${id}`);
    toast.success('Application deleted');
  }, []);

  const toggleStar = useCallback(async (id) => {
    const { data } = await api.patch(`/applications/${id}/star`);
    return data.starred;
  }, []);

  const exportCSV = useCallback(async () => {
    const response = await api.get('/applications/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  }, []);

  return { applications, total, loading, fetch, create, update, remove, toggleStar, exportCSV };
}
