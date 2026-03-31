import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser, hasActiveSession } from '../utils/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = getStoredUser();
  const isLoggedIn = hasActiveSession();
  const isAdmin = Boolean(currentUser?.isAdmin);
  const initials = (currentUser?.name || 'Job Portal')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const publicLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/jobs', label: 'Jobs', icon: '💼' },
    { to: '/companies', label: 'Companies', icon: '🏢' },
  ];

  const privateLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'Profile', icon: '👤' },
    { to: '/applications', label: 'Applications', icon: '📝' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    clearAuthSession();
    closeMenu();
    navigate('/login');
  };

  const getNavLinkClass = (isActive, isScrolled = true) => {
    const baseClass =
      'flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200';

    if (isScrolled) {
      return isActive
        ? `${baseClass} bg-blue-50 text-blue-600`
        : `${baseClass} text-gray-600 hover:bg-blue-50/50 hover:text-blue-600`;
    }

    return isActive
      ? `${baseClass} bg-white/20 text-white`
      : `${baseClass} text-white/90 hover:bg-white/10 hover:text-white`;
  };

  const renderNavItem = (item, isScrolled = true) => (
    <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={closeMenu}>
      {({ isActive }) => (
        <div className={getNavLinkClass(isActive, isScrolled)}>
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      )}
    </NavLink>
  );

  return (
    <>
      <nav
        className={`fixed z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 py-2 shadow-lg backdrop-blur-md'
            : 'bg-gradient-to-r from-blue-600 to-blue-800 py-4'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="group flex items-center space-x-3" onClick={closeMenu}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${
                  scrolled ? 'bg-blue-600' : 'bg-white/20'
                }`}
              >
                <span className="text-2xl">💼</span>
              </div>
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                Job<span className={scrolled ? 'text-blue-600' : 'text-yellow-300'}>Portal</span>
              </span>
            </NavLink>

            <div className="hidden items-center space-x-1 lg:flex">
              {publicLinks.map((item) => renderNavItem(item, scrolled))}
              {isLoggedIn && privateLinks.map((item) => renderNavItem(item, scrolled))}
            </div>

            <div className="hidden items-center space-x-3 lg:flex">
              {isAdmin && (
                <NavLink to="/admin" onClick={closeMenu}>
                  {({ isActive }) => (
                    <div
                      className={
                        scrolled
                          ? isActive
                            ? 'flex items-center space-x-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-600'
                            : 'flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                          : isActive
                            ? 'flex items-center space-x-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-medium text-white'
                            : 'flex items-center space-x-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white'
                      }
                    >
                      <span>⚙️</span>
                      <span>Admin</span>
                    </div>
                  )}
                </NavLink>
              )}

              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={closeMenu}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'border-2 border-white text-white hover:bg-white/10'
                    }`}
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/profile" onClick={closeMenu}>
                    <div
                      className={`flex items-center space-x-3 rounded-xl px-3 py-2 transition-all duration-200 ${
                        scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                        <span className="text-sm font-bold text-white">{initials || 'JP'}</span>
                      </div>
                      <span className={scrolled ? 'text-gray-700' : 'text-white'}>
                        {currentUser?.name || 'My Account'}
                      </span>
                    </div>
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className={`relative h-12 w-12 rounded-xl transition-all duration-300 focus:outline-none ${
                  scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <div
                    className={`h-0.5 w-6 transition-all duration-300 ${
                      scrolled ? 'bg-gray-600' : 'bg-white'
                    } ${isOpen ? 'translate-y-1.5 rotate-45' : '-translate-y-1'}`}
                  />
                  <div
                    className={`my-1 h-0.5 w-6 transition-all duration-300 ${
                      scrolled ? 'bg-gray-600' : 'bg-white'
                    } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <div
                    className={`h-0.5 w-6 transition-all duration-300 ${
                      scrolled ? 'bg-gray-600' : 'bg-white'
                    } ${isOpen ? '-translate-y-1.5 -rotate-45' : 'translate-y-1'}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`absolute left-0 top-full w-full bg-white shadow-2xl transition-all duration-500 ease-in-out lg:hidden ${
            isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-4 opacity-0'
          }`}
        >
          <div className="max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">{initials || 'JP'}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {currentUser?.name || 'Welcome to JobPortal'}
                  </p>
                  <p className="text-sm text-blue-100">
                    {currentUser?.email || 'Find your next opportunity'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Browse
                </p>
                {publicLinks.map((item) => renderNavItem(item, true))}
              </div>

              {isLoggedIn && (
                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Your Account
                  </p>
                  {privateLinks.map((item) => renderNavItem(item, true))}
                </div>
              )}

              {isAdmin && (
                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Administration
                  </p>
                  <NavLink to="/admin" onClick={closeMenu}>
                    {({ isActive }) => (
                      <div
                        className={`flex items-center space-x-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-6 text-xl">⚙️</span>
                        <span className="font-medium">Admin Panel</span>
                      </div>
                    )}
                  </NavLink>
                </div>
              )}

              {!isLoggedIn ? (
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block w-full rounded-xl px-4 py-3 text-center font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block w-full rounded-xl px-4 py-3 text-center font-semibold transition-all duration-200 ${
                        isActive
                          ? 'border-2 border-blue-700 bg-blue-100 text-blue-700'
                          : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    Sign Up
                  </NavLink>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-red-200 px-4 py-3 text-center font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={location.pathname === '/' ? 'h-20 lg:h-24' : 'h-20'} />
    </>
  );
};

export default Navbar;
