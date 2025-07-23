import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import type { RootState, AppDispatch } from '@/store';
import {
  login,
  register,
  logout as logoutAction,
  getCurrentUser,
  getUserByToken,
  clearError,
  clearAuth,
  restoreAuth,
} from '../slices/auth.slice';
import type { FormSignUp } from '@/types';
import { checkTokenExpiration } from '@/utils';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // Logout function - định nghĩa trước để sử dụng trong useEffect
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

  // Kiểm tra token expiration mỗi khi token thay đổi
  useEffect(() => {
    if (auth.token) {
      console.log("Checking token expiration:", auth.token);
      const isTokenExpired = checkTokenExpiration(auth.token);
      
      if (isTokenExpired) {
        console.log('Token expired, auto logout...');
        dispatch(clearAuth());
        localStorage.removeItem('token');
      }
    }
  }, [auth.token, dispatch]);

  // Restore auth khi có token hợp lệ nhưng chưa có user
  useEffect(() => {
    if (auth.token && !auth.user && !auth.loading) {
      const isTokenExpired = checkTokenExpiration(auth.token);
      
      if (!isTokenExpired) {
        console.log('Token valid, restoring user info...');
        dispatch(restoreAuth());
        dispatch(getCurrentUser());
      }
    }
  }, [auth.token, auth.user, auth.loading, dispatch]);

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

  // Get current user
  const handleGetCurrentUser = useCallback(async () => {
    try {
      const result = await dispatch(getCurrentUser()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);


  const handleGetCurrentUserByToken = useCallback(
    async (token: string) => {
      try {
        const result = await dispatch(getUserByToken(token)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

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
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

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
    getCurrentUserByToken: handleGetCurrentUserByToken,
    // Utilities
    hasPermission,
    hasRole,
    isAdmin,
  };
};