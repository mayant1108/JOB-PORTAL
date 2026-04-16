import { Link } from 'react-router-dom';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 py-12 text-white">
      <div className="container-shell">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="brand-mark">
                <Icon name="briefcase" className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold">JobPortal</h3>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-300">
              Verified jobs, searchable profiles, admin approvals, paid promotions, and chat-ready hiring workflows.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase text-white">Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/jobs" className="hover:text-white">Browse jobs</Link></li>
              <li><Link to="/candidate-dashboard" className="hover:text-white">Applications</Link></li>
              <li><Link to="/candidate-dashboard" className="hover:text-white">Profile CV</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase text-white">Employers</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/employer-dashboard" className="hover:text-white">Post a job</Link></li>
              <li><Link to="/candidates" className="hover:text-white">Search profiles</Link></li>
              <li><Link to="/employer-dashboard" className="hover:text-white">Ad management</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/admin-dashboard" className="hover:text-white">Admin verification</Link></li>
              <li><Link to="/login" className="hover:text-white">Phone OTP login</Link></li>
              <li><Link to="/signup" className="hover:text-white">Google sign-up</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
          &copy; 2026 JobPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

