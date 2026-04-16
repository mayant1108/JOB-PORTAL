import { createContext, useContext, useEffect, useState } from 'react';

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
    const savedUser = localStorage.getItem('jobPortalUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const persistUser = (profile) => {
    localStorage.setItem('jobPortalUser', JSON.stringify(profile));
    localStorage.setItem('token', profile.token);
    setUser(profile);
  };

  const login = async (credentials = {}) => {
    try {
      const role = credentials.role || 'candidate';
      const profile = {
        id: Date.now(),
        name: role === 'candidate' ? 'Aarav Sharma' : 'Riya Mehta',
        email: credentials.email || 'user@example.com',
        phone: credentials.phone || '9876543210',
        role,
        token: `demo-${role}-token`,
        verified: true,
      };

      persistUser(profile);
      return { success: true, user: profile };
    } catch (error) {
      return { success: false, error: 'Unable to login right now' };
    }
  };

  const signup = async (userData = {}) => {
    try {
      const role = userData.role || 'candidate';
      const profile = {
        id: Date.now(),
        name: `${userData.firstName || 'Demo'} ${userData.lastName || 'User'}`,
        email: userData.email || 'user@example.com',
        phone: userData.phone || '',
        companyName: userData.companyName || '',
        role,
        token: `demo-${role}-token`,
        verified: true,
        pendingAdminApproval: role === 'candidate',
      };

      persistUser(profile);
      return { success: true, user: profile };
    } catch (error) {
      return { success: false, error: 'Unable to create account right now' };
    }
  };

  const logout = () => {
    localStorage.removeItem('jobPortalUser');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
