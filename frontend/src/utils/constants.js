export const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected', 'Ghosted'];

export const STATUS_COLORS = {
  Applied: '#3b82f6',
  OA: '#a855f7',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
  Ghosted: '#9ca3af',
};

export const LOCATION_TYPES = ['Remote', 'On-site', 'Hybrid'];

export const SOURCES = [
  'LinkedIn', 'Careers Page', 'Referral', 'Naukri', 'Indeed', 'AngelList', 'Twitter', 'Other',
];

export const INTERVIEW_TYPES = [
  'Technical', 'HR', 'System Design', 'Managerial', 'Culture Fit', 'Other',
];

export const ROUND_RESULTS = ['Pending', 'Passed', 'Failed', 'Unknown'];

export const SORT_OPTIONS = [
  { value: '-dateApplied', label: 'Date Applied (Newest)' },
  { value: 'dateApplied', label: 'Date Applied (Oldest)' },
  { value: 'companyName', label: 'Company A–Z' },
  { value: '-companyName', label: 'Company Z–A' },
  { value: 'status', label: 'Status' },
];
