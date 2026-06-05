import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/api/users/profile');
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }

    // Event listener for token expiration
    const handleAuthExpired = () => {
      logoutState();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.success) {
      const { accessToken, refreshToken, user: loggedUser } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(loggedUser);
      return loggedUser;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (fullName, email, phone, password, role) => {
    const response = await api.post('/api/auth/register', {
      fullName,
      email,
      phone,
      password,
      role,
    });
    return response.data;
  };

  const logoutState = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // Swallowed
    } finally {
      logoutState();
    }
  };

  const updateProfile = async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    if (response.data.success) {
      setUser((prev) => ({ ...prev, ...response.data.data }));
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'CUSTOMER',
        isOwner: user?.role === 'RESTAURANT_OWNER',
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
        refreshProfile: loadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
