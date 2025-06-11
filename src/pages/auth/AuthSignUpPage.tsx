import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser, clearError } from "@/features/auth";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "@/components/common";
import { showError, showSuccess } from "@/components/common";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import SignUpForm from "@/features/auth/components/SignUpForm";
import type { FormSignUp } from "@/types/auth.type";
import type { RootState, AppDispatch } from "@/store";

export default function AuthSignUpPage() {
  const { loading, error, user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmitData = (data: FormSignUp) => {
    console.log("SignUp data:", data);
    showSuccess("Đăng ký thành công");
    dispatch(registerUser(data));
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated && user) {
      showSuccess(`Chào mừng bạn tới website! Đăng ký thành công.`);
      navigate('/'); // Redirect về home
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Clear error khi component mount
    dispatch(clearError());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Đăng ký</h2>
            <p className="mt-2 text-gray-600">Tạo tài khoản mới của bạn</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <GoogleLoginButton />

            <button
              type="button"
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium">Đăng ký với Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* SignUp Form Component */}
          <SignUpForm 
            onSubmit={handleSubmitData}
            loading={loading}
            error={error}
          />

          {/* Toggle to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?
              <Link
                to="/auth/login"
                className="ml-2 font-medium text-green-600 hover:text-green-500 transition duration-200"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a href="#" className="text-green-600 hover:text-green-500">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-green-600 hover:text-green-500">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}