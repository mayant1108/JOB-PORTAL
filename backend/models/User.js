import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate'
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    lastLogin: Date,

    otp: String,
    otpExpiry: Date,

    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    profile: {
      photo: String,
      coverImage: String,
      resume: String,

      headline: String,
      summary: String,

      dob: Date,
      gender: String,

      skills: [String],
      languages: [String],

      experience: {
        type: Number,
        default: 0
      },

      salaryExpectation: String,

      portfolio: String,
      github: String,
      linkedin: String,

      location: {
        country: String,
        state: String,
        city: String,
        area: String,
        pincode: String
      },

      education: [
        {
          degree: String,
          institution: String,
          field: String,
          year: Number
        }
      ],

      workHistory: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          currentlyWorking: Boolean,
          description: String
        }
      ],

      company: {
        name: String,
        description: String,
        website: String,
        logo: String
      }
    },

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ],

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
      }
    ],

    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Password Hash
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);