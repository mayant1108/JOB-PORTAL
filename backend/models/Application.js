import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    experience: {
      type: String,
      default: 'Fresher'
    },

    education: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    expectedSalary: {
      type: Number,
      default: 0
    },

    noticePeriod: {
      type: String,
      default: 'Immediate'
    },

    portfolio: {
      type: String,
      trim: true
    },

    linkedin: {
      type: String,
      trim: true
    },

    github: {
      type: String,
      trim: true
    },

    coverLetter: {
      type: String,
      maxlength: 2000
    },

    resume: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        'applied',
        'reviewing',
        'shortlisted',
        'interview',
        'selected',
        'rejected',
        'hired'
      ],
      default: 'applied'
    },

    notes: {
      type: String
    },

    appliedDate: {
      type: Date,
      default: Date.now
    },

    responseDate: {
      type: Date
    },

    interviewDate: {
      type: Date
    },

    isViewed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// same user same job par dubara apply na kare
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);