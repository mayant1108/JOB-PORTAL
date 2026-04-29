import { Link } from 'react-router-dom';
import Icon from './Icon';

const footerColumns = [
  {
    title: 'Candidates',
    links: [
      { to: '/jobs', label: 'Browse jobs' },
      { to: '/candidate-dashboard', label: 'Applications' },
      { to: '/candidate-dashboard', label: 'Profile and CV' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { to: '/employer-dashboard', label: 'Post a job' },
      { to: '/candidates', label: 'Search profiles' },
      { to: '/employer-dashboard', label: 'Ad management' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { to: '/admin-dashboard', label: 'Admin verification' },
      { to: '/login', label: 'Phone OTP login' },
      { to: '/signup', label: 'Google sign-up' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-16 px-4 pb-4 sm:px-6 lg:px-8">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-950/20 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_repeat(3,minmax(0,1fr))]">
            <div>
              <div className="flex items-center gap-3">
                <span className="brand-mark">
                  <Icon name="briefcase" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-black tracking-tight">JobPortal</h3>
                  <p className="text-sm text-slate-400">Verified hiring and talent discovery</p>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
                Verified jobs, searchable profiles, admin approvals, promotions, and dashboard-ready workflows in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="chip border-white/10 bg-white/10 text-slate-100">Trusted jobs</span>
                <span className="chip border-white/10 bg-white/10 text-slate-100">Talent search</span>
                <span className="chip border-white/10 bg-white/10 text-slate-100">Admin review</span>
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">{column.title}</h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 JobPortal. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Icon name="shield" className="h-4 w-4" />
              <span>Built for verified hiring workflows</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
