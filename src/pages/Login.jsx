import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/helpers';

const roleOptions = [
  { label: 'Candidate', value: 'candidate', icon: 'user' },
  { label: 'Employer', value: 'employer', icon: 'building' },
  { label: 'Admin', value: 'admin', icon: 'shield' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('candidate');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    const trimmedIdentifier = identifier.trim();
    const payload = {
      password,
      role,
      ...(trimmedIdentifier.includes('@')
        ? { email: trimmedIdentifier.toLowerCase() }
        : { phone: trimmedIdentifier }),
    };

    const result = await login(payload);

    if (result.success) {
      setMessage('Login successful. Redirecting...');
      setTimeout(() => {
        navigate(getDashboardPath(result.user?.role));
      }, 700);
    } else {
      setMessage(result.message || 'Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-teal-50 px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <span className="inline-block rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
            Secure account access
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight text-slate-900">
            Login and manage your
            <span className="block bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              hiring workflow
            </span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Candidates can track applications, employers can manage job postings, and admins can monitor approvals
            from one centralized dashboard.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: 'briefcase', title: 'Jobs' },
              { icon: 'users', title: 'Applications' },
              { icon: 'shield', title: 'Secure' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <Icon name={item.icon} className="mb-2 h-6 w-6 text-teal-600" />
                <p className="font-semibold text-slate-700">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl md:p-10">
          <h2 className="text-center text-3xl font-black text-slate-900">Sign In</h2>
          <p className="mt-2 text-center text-slate-500">Choose your account type and continue</p>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-slate-100 p-1">
            {roleOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setRole(item.value);
                  setMessage('');
                }}
                className={`rounded-lg py-2 text-sm font-semibold transition ${
                  role === item.value ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {message ? (
            <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">Email or phone</label>
              <input
                type="text"
                required
                className="mt-2 h-11 w-full rounded-xl border px-4 outline-none focus:border-teal-500"
                placeholder="Enter email or mobile number"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                className="mt-2 h-11 w-full rounded-xl border px-4 outline-none focus:border-teal-500"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-white"
            >
              {isLoading ? 'Please wait...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New user?{' '}
            <Link to="/signup" className="font-semibold text-teal-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
