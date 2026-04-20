import mongoose from 'mongoose';

const interviewRoundSchema = new mongoose.Schema({
  round: { type: Number, required: true },
  type: { type: String, enum: ['Technical', 'HR', 'System Design', 'Managerial', 'Culture Fit', 'Other'], default: 'Technical' },
  date: { type: Date },
  notes: { type: String, default: '' },
  result: { type: String, enum: ['Passed', 'Failed', 'Pending', 'Unknown'], default: 'Pending' },
});

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Core fields
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },

    // Location
    locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
    city: { type: String, default: '' },

    // Status
    status: {
      type: String,
      enum: ['Applied', 'OA', 'Interview', 'Offer', 'Rejected', 'Ghosted'],
      default: 'Applied',
    },

    // Dates
    dateApplied: { type: Date, default: Date.now },
    followUpDate: { type: Date },
    resultDate: { type: Date },

    // Online Assessment
    hasOA: { type: Boolean, default: false },
    oaDate: { type: Date },
    oaScore: { type: String, default: '' },
    oaNotes: { type: String, default: '' },

    // Interview rounds
    interviewRounds: [interviewRoundSchema],

    // Job details
    jobDescriptionLink: { type: String, default: '' },
    salary: { type: String, default: '' },
    source: {
      type: String,
      enum: ['LinkedIn', 'Careers Page', 'Referral', 'Naukri', 'Indeed', 'AngelList', 'Twitter', 'Other'],
      default: 'LinkedIn',
    },

    // Referral
    hasReferral: { type: Boolean, default: false },
    referrerName: { type: String, default: '' },

    // Contact
    contactName: { type: String, default: '' },
    contactEmail: { type: String, default: '' },

    // Resume & Notes
    resumeVersion: { type: String, default: '' },
    notes: { type: String, default: '' },

    // Priority flag
    starred: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast querying by user + status
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, dateApplied: -1 });

export default mongoose.model('Application', applicationSchema);
