import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from './Icon';
import { useLocale } from '../context/LocaleContext';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t, toggleLanguage } = useLocale();

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/jobs', label: t.nav.jobs },
    { to: '/candidates', label: t.nav.talent },
    { to: '/candidate-dashboard', label: t.nav.candidate },
    { to: '/employer-dashboard', label: t.nav.employer },
    { to: '/admin-dashboard', label: t.nav.admin },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="container-shell">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 font-bold text-slate-950">
            <span className="brand-mark">
              <Icon name="briefcase" className="h-5 w-5" />
            </span>
            <span className="text-xl tracking-normal">JobPortal</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive(item.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              aria-label="Toggle language"
            >
              <Icon name="globe" className="h-4 w-4" />
              {t.code}
            </button>
            <Button to="/login" variant="ghost">{t.nav.login}</Button>
            <Button to="/signup">{t.nav.signup}</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>

        {open ? (
          <div className="border-t border-slate-100 py-4 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive(item.to) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
              >
                <Icon name="globe" className="h-4 w-4" />
                {t.code}
              </button>
              <Button to="/login" variant="ghost" onClick={() => setOpen(false)}>{t.nav.login}</Button>
              <Button to="/signup" className="col-span-2" onClick={() => setOpen(false)}>{t.nav.signup}</Button>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;

