import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    type: {
      type: String,
      enum: [
        'application',
        'status_update',
        'new_job',
        'message',
        'interview',
        'offer',
        'system',
        'reminder'
      ],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    },

    relatedModel: {
      type: String,
      enum: ['Job', 'Application', 'User', 'Message']
    },

    actionUrl: {
      type: String,
      trim: true
    },

    icon: {
      type: String
    },

    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal'
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: Date,

    isDeleted: {
      type: Boolean,
      default: false
    },

    expiresAt: Date,

    data: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

// Fast fetch notifications
notificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
