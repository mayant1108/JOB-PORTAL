const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'],
    default: 'Applied',
  },
  resume: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  notes: {
    type: String,
  },
},
{ timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;

