import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create the Authentication Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in when the component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.getUserProfile();
        if (res.success) {
          setUser(res);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.register(userData);
      setUser(res);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.login(credentials);
      setUser(res);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.updateUserProfile(userData);
      setUser(prev => ({ ...prev, ...res }));
      return res;
    } catch (err) {
      setError(err.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a country to favorites
  const addFavorite = async (countryCode) => {
    try {
      const res = await api.addFavoriteCountry(countryCode);
      if (res.success) {
        setUser(prev => ({ ...prev, favoriteCountries: res.favoriteCountries }));
      }
      return res;
    } catch (err) {
      setError(err.message || 'Failed to add favorite');
      throw err;
    }
  };

  // Remove a country from favorites
  const removeFavorite = async (countryCode) => {
    try {
      const res = await api.removeFavoriteCountry(countryCode);
      if (res.success) {
        setUser(prev => ({ ...prev, favoriteCountries: res.favoriteCountries }));
      }
      return res;
    } catch (err) {
      setError(err.message || 'Failed to remove favorite');
      throw err;
    }
  };

  // For backward compatibility
  const addFavoriteCountry = addFavorite;
  const removeFavoriteCountry = removeFavorite;

  // Clear any errors
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    addFavorite,
    removeFavorite,
    addFavoriteCountry,
    removeFavoriteCountry,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;