import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {  loginFailure, getUserByToken } from '../slices/auth.slice';

const GoogleCallback: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const tokenFromUrl = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        dispatch(loginFailure(error));
        navigate('/auth/login');
        return;
      }

      if (!tokenFromUrl) {
        console.error('No token received');
        dispatch(loginFailure('No token received'));
        navigate('/auth/login');
        return;
      }

      try {
        console.log('🔑 Processing token:', tokenFromUrl);

        // Store token immediately (for apiClient to use)
        localStorage.setItem('token', tokenFromUrl);

        // Sử dụng dispatch thay vì hook
        const result = await dispatch(getUserByToken(tokenFromUrl));
        
        if (getUserByToken.fulfilled.match(result)) {
          console.log('✅ OAuth login successful');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          throw new Error(result.payload || 'Failed to get user data');
        }
      } catch (error) {
        console.error('❌ OAuth callback error:', error);

        // Clean up on error
        localStorage.removeItem('token');

        dispatch(loginFailure('Authentication failed'));
        navigate('/auth/login');
      }
    };

    handleGoogleCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Completing Sign In</h3>
        <p className="text-gray-600">Please wait while we verify your account...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;