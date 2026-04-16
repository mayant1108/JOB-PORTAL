import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('employer');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('password');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login({ email, password, phone, otp, role });
    if (result.success) {
      navigate(role === 'candidate' ? '/candidate-dashboard' : '/employer-dashboard');
      return;
    }
    setMessage(result.error || 'Unable to login');
  };

  return (
    <div className="bg-slate-50">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Secure login</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Phone OTP, Google, and role-based access</h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            Employers can use phone OTP and Google login. Candidates can use email login before applying, saving jobs,
            or chatting with employers.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['OTP authentication', 'Email confirmation', 'Google sign-in'].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <Icon name="shield" className="h-5 w-5 text-teal-600" />
                <p className="mt-3 text-sm font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-950">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500">Choose your role to continue to the right dashboard.</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              {['employer', 'candidate'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`rounded-md px-3 py-2 text-sm font-bold capitalize transition ${
                    role === item ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {role === 'employer' ? (
              <div className="grid gap-4">
                <label>
                  <span className="text-sm font-bold text-slate-700">Phone number</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="Enter mobile number"
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">OTP</span>
                  <input
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="6 digit OTP"
                  />
                </label>
              </div>
            ) : (
              <div className="grid gap-4">
                <label>
                  <span className="text-sm font-bold text-slate-700">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="name@example.com"
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="Password"
                  />
                </label>
              </div>
            )}

            {message ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p> : null}

            <div className="mt-6 grid gap-3">
              <Button type="submit" variant="accent" className="w-full">
                <Icon name="check" className="h-4 w-4" />
                Login
              </Button>
              <Button type="button" variant="ghost" className="w-full">
                <Icon name="globe" className="h-4 w-4" />
                Continue with Google
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              New here?{' '}
              <Link to="/signup" className="font-bold text-teal-700 hover:text-teal-800">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
