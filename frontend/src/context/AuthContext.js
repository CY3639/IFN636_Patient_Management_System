import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);

    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const handleAutoLogout = (reason = 'Session expired') => {
    console.log('Auto-logout triggered:', reason);
    setUser(null);
    alert(`${reason}. Please log in again.`);
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const getDefaultRoute = (userRole) => {
    switch (userRole) {
      case 'doctor':
        return '/prescriptions';
      case 'pharmacy':
        return '/pharmacy';
      case 'patient':
        return '/';
      default:
        return '/';
    }
  };

  const navigateToDefaultRoute = () => {
    if (user) {
      const route = getDefaultRoute(user.role);
      window.location.href = route;
    }
  };

  const token = user?.token || null;
  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    handleAutoLogout,
    getDefaultRoute,
    navigateToDefaultRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
