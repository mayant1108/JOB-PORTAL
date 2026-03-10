import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const getNavLinkClass = (isActive, isScrolled = true) => {
    const baseClass = "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2";
    
    if (isScrolled) {
      return isActive 
        ? `${baseClass} text-blue-600 bg-blue-50`
        : `${baseClass} text-gray-600 hover:text-blue-600 hover:bg-blue-50/50`;
    } else {
      return isActive 
        ? `${baseClass} text-white bg-white/20`
        : `${baseClass} text-white/90 hover:text-white hover:bg-white/10`;
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-gradient-to-r from-blue-600 to-blue-800 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 ${
                scrolled ? 'bg-blue-600' : 'bg-white/20'
              }`}>
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <span className={`text-2xl font-bold ${
                  scrolled ? 'text-gray-800' : 'text-white'
                }`}>
                  Job<span className={scrolled ? 'text-blue-600' : 'text-yellow-300'}>Portal</span>
                </span>
              </div>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {publicLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                >
                  {({ isActive }) => (
                    <div className={getNavLinkClass(isActive, scrolled)}>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              ))}

              {isLoggedIn && privateLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                >
                  {({ isActive }) => (
                    <div className={scrolled 
                      ? (isActive ? "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-purple-600 bg-purple-50" : "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50/50")
                      : (isActive ? "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-white bg-white/20" : "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10")
                    }>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-3">
              <NavLink to="/admin">
                {({ isActive }) => (
                  <div className={scrolled 
                    ? (isActive ? "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-purple-600 bg-purple-50" : "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50")
                    : (isActive ? "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-white bg-white/20" : "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 border border-white/20")
                  }>
                    <span>⚙️</span>
                    <span>Admin</span>
                  </div>
                )}
              </NavLink>

              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'border-2 border-white text-white hover:bg-white/10'
                    }`}
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <button className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                  scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">JD</span>
                  </div>
                  <span className={scrolled ? 'text-gray-700' : 'text-white'}>John Doe</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-12 h-12 rounded-xl focus:outline-none transition-all duration-300 ${
                  scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-6 h-0.5 transition-all duration-300 ${
                    scrolled ? 'bg-gray-600' : 'bg-white'
                  } ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`} />
                  <div className={`w-6 h-0.5 transition-all duration-300 my-1 ${
                    scrolled ? 'bg-gray-600' : 'bg-white'
                  } ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <div className={`w-6 h-0.5 transition-all duration-300 ${
                    scrolled ? 'bg-gray-600' : 'bg-white'
                  } ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-500 ease-in-out ${
            isOpen 
              ? 'opacity-100 translate-y-0 visible' 
              : 'opacity-0 -translate-y-4 invisible'
          }`}
        >
          <div className="max-h-[80vh] overflow-y-auto">
            {/* User Profile Section */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-white font-semibold">John Doe</p>
                  <p className="text-blue-100 text-sm">john@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-4">
              {/* Public Menu */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  Browse
                </p>
                {publicLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                  >
                    {({ isActive }) => (
                      <div className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                        <span className="text-xl w-6">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Private Menu */}
              {isLoggedIn && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                    Your Account
                  </p>
                  {privateLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                    >
                      {({ isActive }) => (
                        <div className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}>
                          <span className="text-xl w-6">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Admin Menu */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  Administration
                </p>
                <NavLink to="/admin">
                  {({ isActive }) => (
                    <div className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                      <span className="text-xl w-6">⚙️</span>
                      <span className="font-medium">Admin Panel</span>
                      {isActive && (
                        <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              </div>

              {/* Auth Section */}
              {!isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block w-full text-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`
                    }
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🔑</span>
                      <span>Login</span>
                    </span>
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `block w-full text-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-700'
                          : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>📝</span>
                      <span>Sign Up</span>
                    </span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20 lg:h-24" />
    </>
  );
};

export default Navbar;

