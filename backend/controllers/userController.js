import User from '../models/User.js';
import Notification from '../models/Notification.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeUserUpdates } from '../utils/userProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: 'job-portal',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      }),
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${safeName}`);
      },
    });

// Multer Upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const getUploadedAssetPath = (file) => {
  if (!file) {
    return '';
  }

  if (file.path && /^https?:\/\//i.test(file.path)) {
    return file.path;
  }

  return `/uploads/${file.filename}`;
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('savedJobs')
      .populate('applications')
      .populate('notifications');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    mergeUserUpdates(user, req.body);
    await user.save();
    const safeUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

export const getCandidateProfiles = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;
    const { search, city, verifiedOnly } = req.query;

    const query = { role: 'candidate' };

    if (verifiedOnly === 'true') {
      query.isVerified = true;
    }

    if (city && city !== 'All') {
      query['profile.location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'profile.headline': { $regex: search, $options: 'i' } },
        { 'profile.summary': { $regex: search, $options: 'i' } },
        { 'profile.skills': { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const candidates = await User.find(
      query,
      'name role isVerified profile createdAt',
    )
      .sort({ isVerified: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      candidates,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates',
      error: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message,
    });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message,
    });
  }
};

// Upload Resume
export const uploadResume = [
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          'profile.resume': getUploadedAssetPath(req.file),
        },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        resumeUrl: getUploadedAssetPath(req.file),
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Resume upload failed',
        error: error.message
      });
    }
  }
];

// Upload Profile Photo
export const uploadProfilePhoto = [
  upload.single('photo'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          'profile.photo': getUploadedAssetPath(req.file),
        },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Photo uploaded successfully',
        photoUrl: getUploadedAssetPath(req.file),
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Photo upload failed',
        error: error.message
      });
    }
  }
];

export { upload };
