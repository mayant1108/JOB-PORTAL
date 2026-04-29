import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import api from '../services/api';
import { splitList } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  headline: '',
  summary: '',
  skills: '',
  experience: '',
  education: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  photo: '',
  resume: '',
};

const Profile = () => {
  const navigate = useNavigate();
  const { setUser, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(emptyProfile);

  const mapUserToProfile = (user) => ({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    headline: user.profile?.headline || '',
    summary: user.profile?.summary || '',
    skills: user.profile?.skills?.join(', ') || '',
    experience: user.profile?.experience || '',
    education: Array.isArray(user.profile?.education)
      ? user.profile.education.map((item) => item.degree || item.institution || '').filter(Boolean).join(', ')
      : '',
    location: user.profile?.location?.city || '',
    linkedin: user.profile?.linkedin || '',
    github: user.profile?.github || '',
    portfolio: user.profile?.portfolio || '',
    photo: user.profile?.photo || '',
    resume: user.profile?.resume || '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      const response = await api.getProfile();

      if (!response.success) {
        logout();
        navigate('/login');
        return;
      }

      setUser(response.user);
      setProfile(mapUserToProfile(response.user));
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const payload = {
      name: profile.name,
      phone: profile.phone,
      profile: {
        headline: profile.headline,
        summary: profile.summary,
        skills: splitList(profile.skills),
        experience: Number.parseFloat(String(profile.experience || '0').replace(/[^0-9.]/g, '')) || 0,
        education: profile.education
          ? [{ degree: profile.education }]
          : [],
        location: { city: profile.location },
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
      },
    };

    const response = await api.updateProfile(payload);

    if (response.success) {
      setUser(response.user);
      setProfile(mapUserToProfile(response.user));
      setEditing(false);
      setMessage('Profile updated successfully.');
    } else {
      setMessage(response.message || 'Update failed.');
    }

    setSaving(false);
  };

  const handleUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append(type, file);

    const response = await api.uploadFile(formData, type);

    if (response.success) {
      setUser(response.user);
      setProfile(mapUserToProfile(response.user));
      setMessage(type === 'photo' ? 'Photo uploaded successfully.' : 'Resume uploaded successfully.');
    } else {
      setMessage(response.message || 'Upload failed.');
    }

    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
        <div className="h-fit rounded-3xl bg-white p-6 shadow-xl">
          <div className="text-center">
            <div className="relative mx-auto h-32 w-32">
              <img
                src={profile.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt="profile"
                className="h-32 w-32 rounded-full border-4 border-teal-100 object-cover"
              />

              <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-teal-600 p-2 text-white">
                <Icon name="camera" className="h-4 w-4" />
                <input type="file" hidden accept="image/*" onChange={(event) => handleUpload(event, 'photo')} />
              </label>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="font-medium text-teal-600">{profile.headline || 'No headline added'}</p>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone || '-'}</p>
            <p><strong>Experience:</strong> {profile.experience || '0'} Years</p>
            <p><strong>Location:</strong> {profile.location || '-'}</p>
          </div>

          <div className="mt-6 grid gap-3">
            <label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Upload Resume
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(event) => handleUpload(event, 'resume')} />
            </label>

            {profile.resume ? (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-center text-sm font-semibold text-teal-700"
              >
                View Resume
              </a>
            ) : null}

            <Button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full bg-red-500 text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900">My Profile</h1>

            {!editing ? (
              <Button onClick={() => setEditing(true)} className="bg-teal-600 text-white">
                Edit Profile
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-emerald-600 text-white">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>

          {message ? (
            <div className="mb-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
              {message}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {[
              ['name', 'Full Name'],
              ['phone', 'Phone Number'],
              ['headline', 'Headline'],
              ['experience', 'Experience'],
              ['location', 'Location'],
              ['linkedin', 'LinkedIn URL'],
              ['github', 'GitHub URL'],
              ['portfolio', 'Portfolio URL'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <input
                  name={key}
                  value={profile[key]}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-2 h-11 w-full rounded-xl border px-4 outline-none disabled:bg-slate-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">Skills</label>
            <input
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              disabled={!editing}
              className="mt-2 h-11 w-full rounded-xl border px-4 outline-none disabled:bg-slate-100"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">About Me</label>
            <textarea
              name="summary"
              rows="4"
              value={profile.summary}
              onChange={handleChange}
              disabled={!editing}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none disabled:bg-slate-100"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">Education</label>
            <textarea
              name="education"
              rows="3"
              value={profile.education}
              onChange={handleChange}
              disabled={!editing}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none disabled:bg-slate-100"
            />
          </div>

          {uploading ? (
            <p className="mt-4 text-sm font-medium text-teal-600">Uploading file...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
