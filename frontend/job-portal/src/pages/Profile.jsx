import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { getStoredUser, hasActiveSession, saveAuthSession } from '../utils/auth';

const DEFAULT_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  title: '',
  company: '',
  about: '',
};

const mapUserToFormData = (user = {}) => {
  const nameParts = (user.name || '').trim().split(/\s+/).filter(Boolean);

  return {
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' '),
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    title: user.title || '',
    company: user.company || '',
    about: user.about || '',
  };
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState(DEFAULT_FORM_DATA);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!hasActiveSession()) {
        navigate('/login');
        return;
      }

      try {
        const response = await authAPI.getProfile();
        const currentUser = response?.user || response;
        const nextFormData = mapUserToFormData(currentUser);

        setFormData(nextFormData);
        setInitialFormData(nextFormData);
        saveAuthSession(response);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        const storedUser = getStoredUser();

        if (storedUser) {
          const nextFormData = mapUserToFormData(storedUser);
          setFormData(nextFormData);
          setInitialFormData(nextFormData);
          setFeedback({
            type: 'warning',
            message: 'Live profile data could not be loaded, so your saved session details are shown.',
          });
        } else {
          setFeedback({
            type: 'error',
            message: 'Unable to load your profile right now.',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));

    if (feedback.message) {
      setFeedback({ type: '', message: '' });
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim() || formData.email;
      const updateData = {
        name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        title: formData.title,
        company: formData.company,
        about: formData.about,
      };

      const response = await authAPI.updateProfile(updateData);
      const updatedUser = response?.user || response;
      const nextFormData = mapUserToFormData(updatedUser);

      saveAuthSession(response);
      setFormData(nextFormData);
      setInitialFormData(nextFormData);
      setIsEditing(false);
      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      console.error('Failed to update profile:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setFeedback({ type: '', message: '' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-4xl animate-spin">⏳</div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const feedbackStyles = {
    success: 'border-green-200 bg-green-50 text-green-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800" />

      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-end">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl shadow-xl">
                  👤
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {formData.title || 'Professional headline not set'}{' '}
                    {formData.company ? `at ${formData.company}` : ''}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-500">
                    <span>📍 {formData.location || 'Location not set'}</span>
                    <span>📧 {formData.email || 'Email not set'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3 md:mt-0">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-green-400"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                    <Link
                      to="/dashboard"
                      className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Back to Dashboard
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {feedback.message && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 ${feedbackStyles[feedback.type] || feedbackStyles.error}`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mb-6 rounded-2xl bg-white shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['profile', 'experience', 'education', 'settings'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-2 py-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">About</h2>
              {isEditing ? (
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="leading-relaxed text-gray-600">
                  {formData.about || 'No about information added yet.'}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Professional Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-500">Current Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-900">{formData.title || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Current Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-900">{formData.company || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Work Experience</h2>
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-2xl">
                  💼
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{formData.title || 'Job Title'}</h3>
                  <p className="text-gray-600">{formData.company || 'Company Name'}</p>
                  <p className="text-sm text-gray-400">{formData.location || 'Location'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Education</h2>
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-2xl">
                  🎓
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Bachelor&apos;s Degree</h3>
                  <p className="text-gray-600">University Name</p>
                  <p className="text-sm text-gray-400">Graduation Year</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{formData.firstName || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{formData.lastName || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{formData.email || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{formData.phone || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{formData.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Skills</h2>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                  React
                </span>
                <span className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                  JavaScript
                </span>
                <span className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                  Node.js
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
