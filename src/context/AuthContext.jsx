import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser =
      localStorage.getItem('jobPortalUser') || localStorage.getItem('user');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const persistUser = (profile, token) => {
    localStorage.setItem('jobPortalUser', JSON.stringify(profile));
    localStorage.setItem('user', JSON.stringify(profile));
    localStorage.setItem('token', token);
    setUser(profile);
  };

  const updateStoredUser = (profile) => {
    if (!profile) {
      return;
    }

    localStorage.setItem('jobPortalUser', JSON.stringify(profile));
    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
  };

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      if (response.success) {
        persistUser(response.user, response.token);
        return response;
      }
      return {
        success: false,
        message: response.message || response.error || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Network error. Check backend server.',
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.signup(userData);
      if (response.success) {
        persistUser(response.user, response.token);
        return response;
      }
      return {
        success: false,
        message: response.message || response.error || 'Signup failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Network error. Check backend server.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('jobPortalUser');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateStoredUser, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
