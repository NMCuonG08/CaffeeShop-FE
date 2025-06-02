import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginSuccess, loginFailure } from '../slices/auth.slice';

const GoogleCallback: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      dispatch(loginFailure(error));
      navigate('/login');
    } else if (token) {
      // Decode JWT để lấy user info
      try {
        const decodedToken = decodeURIComponent(token);
        const payload = JSON.parse(atob(decodedToken.split('.')[1]));
        
        const user = {
          id: payload.sub || payload.id || '',
          email: payload.email || '',
          name: payload.name || '',
          firstName: payload.firstName || payload.given_name,
          lastName: payload.lastName || payload.family_name,
          picture: payload.picture
        };

        // Dispatch loginSuccess với token string, không phải object
        dispatch(loginSuccess({ user, token: decodedToken }));
        navigate('/');
      } catch (error) {
        console.error('Error decoding token:', error);
        dispatch(loginFailure('Invalid token format'));
        navigate('/login');
      }
    } else {
      dispatch(loginFailure('No token received'));
      navigate('/login');
    }
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;