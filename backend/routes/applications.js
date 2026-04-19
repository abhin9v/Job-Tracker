const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Helper: build query filters from request query params
const buildFilters = (query, userId) => {
  const filter = { user: userId };
  if (query.status) filter.status = query.status;
  if (query.locationType) filter.locationType = query.locationType;
  if (query.source) filter.source = query.source;
  if (query.search) {
    filter.$or = [
      { companyName: { $regex: query.search, $options: 'i' } },
      { role: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.starred === 'true') filter.starred = true;
  return filter;
};

// GET /api/applications - List all with filters/sorting/pagination
router.get('/', async (req, res) => {
  try {
    const { sort = '-dateApplied', page = 1, limit = 50 } = req.query;
    const filter = buildFilters(req.query, req.user._id);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Application.countDocuments(filter),
    ]);

    res.json({ applications, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/export - Export to CSV
router.get('/export', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).lean();

    const headers = [
      'Company', 'Role', 'Location Type', 'City', 'Status', 'Date Applied',
      'Source', 'Salary', 'Has Referral', 'Referrer', 'Contact Name',
      'Contact Email', 'Resume Version', 'Notes', 'Follow-up Date', 'Result Date',
    ];

    const rows = applications.map((a) => [
      a.companyName, a.role, a.locationType, a.city, a.status,
      a.dateApplied ? new Date(a.dateApplied).toLocaleDateString() : '',
      a.source, a.salary, a.hasReferral ? 'Yes' : 'No', a.referrerName,
      a.contactName, a.contactEmail, a.resumeVersion,
      (a.notes || '').replace(/,/g, ';'),
      a.followUpDate ? new Date(a.followUpDate).toLocaleDateString() : '',
      a.resultDate ? new Date(a.resultDate).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="job-applications.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/:id
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/applications - Create
router.post(
  '/',
  [
    body('companyName').trim().notEmpty().withMessage('Company name required'),
    body('role').trim().notEmpty().withMessage('Role required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const application = await Application.create({ ...req.body, user: req.user._id });
      res.status(201).json(application);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /api/applications/:id - Update
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/applications/:id/star - Toggle star
router.patch('/:id/star', async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ message: 'Not found' });
    app.starred = !app.starred;
    await app.save();
    res.json({ starred: app.starred });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
