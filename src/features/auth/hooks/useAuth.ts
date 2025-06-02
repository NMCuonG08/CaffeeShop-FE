import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import type { RootState, AppDispatch } from '@/store';
import {
  login,
  register,
  logout as logoutAction,
  getCurrentUser,
  clearError,
  clearAuth,
  restoreAuth,
} from '../slices/auth.slice';
import type { FormSignUp } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // Restore auth khi app khởi động
  useEffect(() => {
    if (auth.token && !auth.user) {
      dispatch(restoreAuth());
      dispatch(getCurrentUser());
    }
  }, [dispatch, auth.token, auth.user]);

  // Login function
  const handleLogin = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const result = await dispatch(login(credentials)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  // Register function
  const handleRegister = useCallback(
    async (userData: FormSignUp) => {
      try {
        const result = await dispatch(register(userData)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      // Clear localStorage
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      // Vẫn clear auth state dù API logout fail
      dispatch(clearAuth());
      localStorage.removeItem('token');
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Get current user
  const handleGetCurrentUser = useCallback(async () => {
    try {
      const result = await dispatch(getCurrentUser()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if user has specific role (nếu cần)
  const hasRole = useCallback(
    (role: string) => {
      return auth.user?.roles?.includes(role) || false;
    },
    [auth.user]
  );

  // Check if user is admin (nếu cần)
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  return {
    // State
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getCurrentUser: handleGetCurrentUser,
    clearError: handleClearError,

    // Utilities
    hasRole,
    isAdmin,
  };
};