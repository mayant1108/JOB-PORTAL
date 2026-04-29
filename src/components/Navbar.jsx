import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';
import Icon from './Icon';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/helpers';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, toggleLanguage } = useLocale();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/jobs', label: t.nav.jobs },
    { to: '/candidates', label: t.nav.talent },
    { to: '/candidate-dashboard', label: t.nav.candidate },
    { to: '/employer-dashboard', label: t.nav.employer },
    { to: '/admin-dashboard', label: t.nav.admin },
  ];

  const isActive = (path) => location.pathname === path;
  const dashboardPath = user ? getDashboardPath(user.role) : '/login';
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : '';

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 transition-all duration-300 sm:px-4">
      <div className="container-shell">
        <div
          className={`rounded-[30px] border px-4 py-3 transition-all duration-300 ${
            scrolled
              ? 'border-white/80 bg-white/80 shadow-card backdrop-blur-xl'
              : 'border-white/60 bg-white/70 shadow-soft backdrop-blur-lg'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex min-w-0 items-center gap-3 text-slate-950">
              <span className="brand-mark shrink-0">
                <Icon name="briefcase" className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-lg font-black tracking-tight sm:text-xl">JobPortal</span>
                <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                  Verified hiring and talent discovery
                </span>
              </span>
            </Link>

            <div className="nav-surface hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-pill z-0 overflow-hidden ${isActive(item.to) ? 'nav-pill-active' : ''}`}
                >
                  {isActive(item.to) ? (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 -z-10 rounded-full bg-slate-950"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={toggleLanguage}
                className="chip h-11 px-4 text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                aria-label="Toggle language"
              >
                <Icon name="globe" className="h-4 w-4" />
                {t.code}
              </button>

              {user ? (
                <>
                  <div className="chip h-11 px-4 text-slate-700">
                    <Icon name="user" className="h-4 w-4 text-slate-500" />
                    {roleLabel}
                  </div>
                  <Button to={dashboardPath} variant="ghost" className="h-11 rounded-full px-5">
                    Dashboard
                  </Button>
                  <Button type="button" onClick={logout} className="h-11 rounded-full px-5">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/login" variant="ghost" className="h-11 rounded-full px-5">
                    {t.nav.login}
                  </Button>
                  <Button to="/signup" className="h-11 rounded-full px-5">
                    {t.nav.signup}
                  </Button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
            </button>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden lg:hidden"
              >
                <div className="pt-4">
                  <div className="surface-card p-4">
                    <div className="grid gap-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            isActive(item.to) ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={toggleLanguage}
                        className="chip min-h-11 justify-center px-4 text-sm font-bold text-slate-700"
                      >
                        <Icon name="globe" className="h-4 w-4" />
                        {t.code}
                      </button>
                      {user ? (
                        <div className="chip min-h-11 justify-center px-4 text-sm font-bold text-slate-700">
                          <Icon name="user" className="h-4 w-4" />
                          {roleLabel}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {user ? (
                        <>
                          <Button to={dashboardPath} variant="ghost" className="h-11 rounded-full">
                            Dashboard
                          </Button>
                          <Button type="button" className="h-11 rounded-full" onClick={logout}>
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button to="/login" variant="ghost" className="h-11 rounded-full">
                            {t.nav.login}
                          </Button>
                          <Button to="/signup" className="h-11 rounded-full">
                            {t.nav.signup}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
