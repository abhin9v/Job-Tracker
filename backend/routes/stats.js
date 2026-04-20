import express from 'express';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// GET /api/stats - Dashboard stats
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    // Status breakdown
    const statusCounts = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Applications over time (last 30 days grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeline = await Application.aggregate([
      { $match: { user: userId, dateApplied: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateApplied' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Source breakdown
    const sourceCounts = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // Upcoming follow-ups (next 7 days)
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const followUps = await Application.find({
      user: userId,
      followUpDate: { $gte: now, $lte: sevenDaysLater },
    })
      .select('companyName role followUpDate status')
      .sort('followUpDate')
      .lean();

    const total = await Application.countDocuments({ user: userId });

    res.json({ total, statusCounts, timeline, sourceCounts, followUps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
