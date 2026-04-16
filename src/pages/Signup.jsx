import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

const fieldClass =
  'mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState('candidate');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await signup(Object.fromEntries(form.entries()));
    if (result.success) {
      navigate(role === 'candidate' ? '/candidate-dashboard' : '/employer-dashboard');
    }
  };

  return (
    <div className="bg-slate-50">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Create account</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Candidate and employer onboarding</h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            The sign-up flow captures company details, personal information, OTP verification, email confirmation, and
            role-specific profile setup.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              'Employer: company name, phone, email, Google sign-up, OTP verification',
              'Candidate: personal details, preferred cities, skills, experience, education',
              'Admin approval before public job posts or candidate profiles go live',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">Sign up</h2>
            <p className="mt-1 text-sm text-slate-500">Switch role to see the required onboarding fields.</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {['candidate', 'employer'].map((item) => (
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

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input type="hidden" name="role" value={role} />

            {role === 'employer' ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Company name</span>
                  <input name="companyName" className={fieldClass} defaultValue="NorthStar BPO" />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Phone number</span>
                  <input name="phone" className={fieldClass} defaultValue="9876543210" />
                </label>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Current job title</span>
                  <input name="currentRole" className={fieldClass} defaultValue="Frontend Developer" />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Preferred city</span>
                  <input name="preferredCity" className={fieldClass} defaultValue="Bengaluru" />
                </label>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="text-sm font-bold text-slate-700">First name</span>
                <input name="firstName" className={fieldClass} defaultValue={role === 'candidate' ? 'Aarav' : 'Riya'} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">Last name</span>
                <input name="lastName" className={fieldClass} defaultValue={role === 'candidate' ? 'Sharma' : 'Mehta'} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="text-sm font-bold text-slate-700">Email address</span>
                <input name="email" type="email" className={fieldClass} defaultValue="user@example.com" />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">Password</span>
                <input name="password" type="password" className={fieldClass} defaultValue="password" />
              </label>
            </div>

            {role === 'candidate' ? (
              <div className="grid gap-4 md:grid-cols-3">
                <label>
                  <span className="text-sm font-bold text-slate-700">Total experience</span>
                  <input name="experience" className={fieldClass} defaultValue="3.5 years" />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Current salary</span>
                  <input name="salary" className={fieldClass} defaultValue="Rs 10 LPA" />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-700">Skills</span>
                  <input name="skills" className={fieldClass} defaultValue="React, Tailwind, Node" />
                </label>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                OTP verified
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                Email confirmation sent
              </label>
            </div>

            <Button type="submit" variant="accent" className="w-full">
              <Icon name="check" className="h-4 w-4" />
              Create account
            </Button>
            <Button type="button" variant="ghost" className="w-full">
              <Icon name="globe" className="h-4 w-4" />
              Sign up with Google
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:text-teal-800">
              Login here
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Signup;
