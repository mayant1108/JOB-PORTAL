const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'],
  },
  salary: {
    type: String,
  },
  category: {
    type: String,
    default: 'General',
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  logo: {
    type: String,
    default: '💼',
  },
  applyLink: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
},
{ timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
