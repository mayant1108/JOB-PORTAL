import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      name: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String,
        trim: true
      },

      website: {
        type: String,
        trim: true
      },

      logo: {
        type: String
      },

      email: {
        type: String,
        trim: true,
        lowercase: true
      },

      phone: {
        type: String,
        trim: true
      },

      foundedYear: Number,

      size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '500+']
      },

      industry: {
        type: String,
        trim: true
      }
    },

    description: {
      type: String,
      required: true
    },

    shortDescription: {
      type: String,
      maxlength: 200
    },

    type: {
      type: String,
      enum: [
        'Full-time',
        'Part-time',
        'Freelance',
        'Temporary',
        'Contract',
        'Internship'
      ],
      required: true
    },

    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      required: true
    },

    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Junior', 'Mid', 'Senior', 'Expert'],
      default: 'Fresher'
    },

    location: {
      country: String,

      state: String,

      city: {
        type: String,
        required: true
      },

      area: String,

      pincode: String,

      coordinates: {
        lat: Number,
        lng: Number
      }
    },

    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      },

      period: {
        type: String,
        enum: ['month', 'year'],
        default: 'month'
      },

      isNegotiable: {
        type: Boolean,
        default: true
      }
    },

    openings: {
      type: Number,
      default: 1
    },

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    responsibilities: [
      {
        type: String,
        trim: true
      }
    ],

    requirements: [
      {
        type: String,
        trim: true
      }
    ],

    benefits: [
      {
        type: String,
        trim: true
      }
    ],

    education: {
      type: String
    },

    languages: [String],

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    deadline: Date,

    status: {
      type: String,
      enum: ['active', 'pending', 'rejected', 'closed', 'expired'],
      default: 'pending'
    },

    featured: {
      type: Boolean,
      default: false
    },

    isPromoted: {
      type: Boolean,
      default: false
    },

    applicantsCount: {
      type: Number,
      default: 0
    },

    views: {
      type: Number,
      default: 0
    },

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Job', jobSchema);
