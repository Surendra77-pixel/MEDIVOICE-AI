import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoginStatus = async () => {
      try {
        const response = await authService.getMe();
        if (response.success) {
          setUser(response.data);
        }
      } catch (err) {
        // Silently fail if not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setError(null);
        return response; // Return the full response which includes success and data.user
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      return response;
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) {
        const firstError = Object.values(data.errors[0])[0];
        throw firstError;
      }
      throw data?.message || 'Signup failed';
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const verifyOtp = async (otpData) => {
    try {
      const response = await authService.verifyOtp(otpData);
      return response;
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) throw Object.values(data.errors[0])[0];
      throw data?.message || 'Verification failed';
    }
  };

  const resendOtp = async (emailData) => {
    try {
      const response = await authService.resendOtp(emailData);
      return response;
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) throw Object.values(data.errors[0])[0];
      throw data?.message || 'Failed to resend OTP';
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) throw Object.values(data.errors[0])[0];
      throw data?.message || 'Failed to request password reset';
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await authService.resetPassword(resetData);
      return response;
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) throw Object.values(data.errors[0])[0];
      throw data?.message || 'Failed to reset password';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        setError
      }}
    >
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
