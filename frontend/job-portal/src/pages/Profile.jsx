
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    company: '',
    about: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userData = await authAPI.getProfile();
        if (userData) {
          const nameParts = (userData.name || '').split(' ');
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            title: userData.title || '',
            company: userData.company || '',
            about: userData.about || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Set demo data on error
        setFormData({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1 555-123-4567',
          location: 'San Francisco, CA',
          title: 'Frontend Developer',
          company: 'TechCorp',
          about: 'Passionate developer with experience in React and modern web technologies.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        title: formData.title,
        company: formData.company,
        about: formData.about
      };
      await authAPI.updateProfile(updateData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-48"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-5xl shadow-xl">
                  👤
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h1>
                  <p className="text-gray-600 text-lg">{formData.title} {formData.company ? `at ${formData.company}` : ''}</p>
                  <div className="flex items-center gap-4 mt-2 text-gray-500">
                    <span>📍 {formData.location || 'Location not set'}</span>
                    <span>📧 {formData.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-green-400"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                    <Link
                      to="/dashboard"
                      className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                    >
                      View as Guest
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['profile', 'experience', 'education', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{formData.about || 'No about information added yet.'}</p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  💼
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{formData.title || 'Job Title'}</h3>
                  <p className="text-gray-600">{formData.company || 'Company Name'}</p>
                  <p className="text-sm text-gray-400">{formData.location || 'Location'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Bachelor's Degree</h3>
                  <p className="text-gray-600">University Name</p>
                  <p className="text-sm text-gray-400">Graduation Year</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{formData.email}</p>
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
                      className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{formData.phone || 'Not set'}</p>
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
                      className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{formData.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full">React</span>
                <span className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full">JavaScript</span>
                <span className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full">Node.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

