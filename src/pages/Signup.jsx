import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/helpers';

const fieldClass =
  'mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

const defaultForm = {
  companyName: '',
  companyWebsite: '',
  phone: '',
  currentRole: '',
  preferredCity: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  experience: '',
  salary: '',
  skills: '',
};

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(defaultForm);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const apiRole = role === 'employer' ? 'recruiter' : role;
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: apiRole,
      ...(role === 'employer'
        ? {
            companyName: formData.companyName.trim(),
            companyWebsite: formData.companyWebsite.trim(),
          }
        : {
            currentRole: formData.currentRole.trim(),
            preferredCity: formData.preferredCity.trim(),
            experience: formData.experience.trim(),
            salary: formData.salary.trim(),
            skills: formData.skills.trim(),
          }),
    };

    const result = await signup(payload);

    if (result.success) {
      setSuccessMessage('Account created successfully. Redirecting...');
      setTimeout(() => {
        navigate(getDashboardPath(result.user?.role));
      }, 900);
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-orange-600" />
              <p className="text-sm font-bold uppercase tracking-wide text-orange-700">Official onboarding</p>
            </div>

            <h1 className="text-5xl font-black leading-tight text-slate-900 lg:text-6xl">
              Build your
              <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                verified profile
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              Create an account to apply for jobs, publish openings, manage applicants, and maintain your profile from
              the backend-powered dashboard.
            </p>

            <div className="mt-4 grid gap-4">
              {[
                { icon: 'building', text: 'Employers can post jobs, track applicants, and manage hiring pipeline.' },
                { icon: 'user', text: 'Candidates can build profiles, upload resumes, and apply to verified jobs.' },
                { icon: 'shield', text: 'All key actions are connected to backend APIs for real account data.' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold leading-6 text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-xl" />
            <div className="relative rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm lg:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-900">Create account</h2>
                <p className="mt-2 text-slate-500">Select your role to complete the correct onboarding flow</p>
              </div>

              <div className="mb-8 flex gap-3 rounded-xl bg-slate-100 p-1.5">
                {[
                  { value: 'candidate', label: 'Job Seeker', icon: 'user' },
                  { value: 'employer', label: 'Employer', icon: 'building' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setRole(item.value);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      role === item.value
                        ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <div className="flex items-center gap-2">
                    <Icon name="alert" className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              ) : null}

              {successMessage ? (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4" />
                    {successMessage}
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="grid gap-5">
                {role === 'employer' ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Company name</span>
                      <input
                        required
                        name="companyName"
                        className={fieldClass}
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Company website</span>
                      <input
                        name="companyWebsite"
                        className={fieldClass}
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        placeholder="https://company.com"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Current job title</span>
                      <input
                        name="currentRole"
                        className={fieldClass}
                        value={formData.currentRole}
                        onChange={handleInputChange}
                        placeholder="e.g., Frontend Developer"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Preferred city</span>
                      <input
                        name="preferredCity"
                        className={fieldClass}
                        value={formData.preferredCity}
                        onChange={handleInputChange}
                        placeholder="e.g., Bengaluru"
                      />
                    </label>
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">First name</span>
                    <input
                      required
                      name="firstName"
                      className={fieldClass}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Last name</span>
                    <input
                      required
                      name="lastName"
                      className={fieldClass}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Email address</span>
                    <input
                      name="email"
                      type="email"
                      className={fieldClass}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Phone number</span>
                    <input
                      name="phone"
                      className={fieldClass}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10 digit number"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Password</span>
                  <input
                    name="password"
                    type="password"
                    className={fieldClass}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    required
                  />
                </label>

                {role === 'candidate' ? (
                  <div className="grid gap-5 md:grid-cols-3">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Experience</span>
                      <input
                        name="experience"
                        className={fieldClass}
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 2.5 years"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Expected salary</span>
                      <input
                        name="salary"
                        className={fieldClass}
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g., INR 8 LPA"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Skills</span>
                      <input
                        name="skills"
                        className={fieldClass}
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="React, Node, Tailwind"
                      />
                    </label>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="accent"
                  className="mt-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating account...
                    </span>
                  ) : (
                    <>
                      <Icon name="check" className="h-4 w-4" />
                      Create account
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-teal-600 transition-colors hover:text-teal-700">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
