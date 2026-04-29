import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import {
  buildProfileData,
  mergeUserUpdates,
  normalizeRole,
} from '../utils/userProfile.js';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing in .env');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, phone, password } = req.body;
    const role = normalizeRole(req.body.role);

    const uniqueConditions = [{ email }];
    if (phone) {
      uniqueConditions.push({ phone });
    }

    const existingUser = await User.findOne({ $or: uniqueConditions });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      profile: buildProfileData(req.body, {}, role),
    });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;
    const normalizedRole = role ? normalizeRole(role) : null;

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Email or phone is required' });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const user = email
      ? await User.findOne({ email: email.toLowerCase() })
      : await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (normalizedRole && user.role !== normalizedRole) {
      return res.status(403).json({ success: false, message: 'Please use the correct account type' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('savedJobs')
      .populate('applications')
      .populate('notifications');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    mergeUserUpdates(user, req.body);
    await user.save();
    const safeUser = await User.findById(user._id).select('-password');

    res.status(200).json({ success: true, message: 'Profile updated successfully', user: safeUser });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.status(200).json({ success: true, message: 'Reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate reset token', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
};
