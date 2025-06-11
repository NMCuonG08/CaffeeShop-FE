import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "@/features/auth";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "@/components/common";
import { showError, showSuccess } from "@/components/common";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import LoginForm from "@/features/auth/components/LoginForm";
import type { FormLogin } from "@/types/auth.type";
import type { RootState, AppDispatch } from "@/store";

export default function AuthLogInPage() {
  const { loading, error, user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmitData = (data: FormLogin) => {
    console.log("Login data:", data);
    dispatch(login(data));
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
      showSuccess(`Chào mừng trở lại website!`);
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Left Side - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600">
          {/* Floating Coffee Beans */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-amber-200/30 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 20}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                ☕
              </div>
            ))}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
              <span className="text-4xl">☕</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              Café Aurora
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-300 to-orange-300 mx-auto rounded-full mb-6" />
            <p className="text-xl text-amber-100 leading-relaxed max-w-md">
              Nơi hương vị cà phê thượng hạng hòa quyện cùng không gian hiện đại
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <span className="text-xl">🌟</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-100">Cà phê premium</h3>
                <p className="text-sm text-amber-200/80">Hạt cà phê chọn lọc từ những vùng đất nổi tiếng</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-100">Không gian sang trọng</h3>
                <p className="text-sm text-amber-200/80">Thiết kế hiện đại, ánh sáng ấm áp</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <span className="text-xl">💝</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-100">Dịch vụ tận tâm</h3>
                <p className="text-sm text-amber-200/80">Đội ngũ barista chuyên nghiệp</p>
              </div>
            </div>
          </div>

          {/* Decorative Quote */}
          <div className="mt-12 text-center">
            <div className="relative">
              <span className="text-6xl text-white/20 absolute -top-4 -left-4">"</span>
              <p className="text-lg italic text-amber-100 relative z-10 max-w-xs">
                Mỗi ly cà phê là một câu chuyện, mỗi hương vị là một kỷ niệm
              </p>
              <span className="text-6xl text-white/20 absolute -bottom-4 -right-4">"</span>
            </div>
          </div>
        </div>

        {/* Animated Steam Effect */}
        <div className="absolute bottom-10 right-10">
          <div className="relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-6 bg-white/40 rounded-full blur-sm animate-pulse"
                  style={{ 
                    left: `${i * 4}px`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
            <div className="text-6xl opacity-80 animate-bounce">☕</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-2xl text-white">☕</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Café Aurora
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng trở lại!</h2>
              <p className="text-gray-600">Đăng nhập để tiếp tục hành trình cà phê của bạn</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <GoogleLoginButton />

              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 text-gray-700 hover:bg-white hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group"
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Đăng nhập với Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">Hoặc đăng nhập bằng email</span>
              </div>
            </div>

            {/* Login Form Component */}
            <LoginForm 
              onSubmit={handleSubmitData}
              loading={loading}
              error={error}
            />

            {/* Toggle to Register */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?
                <Link
                  to="/auth/signup"
                  className="ml-2 font-semibold text-amber-600 hover:text-orange-600 transition-colors duration-200 relative group"
                >
                  Đăng ký ngay
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-amber-50/80 rounded-xl border border-amber-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">🎁</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">Ưu đãi thành viên</p>
                  <p className="text-xs text-amber-600">Giảm 10% cho đơn hàng đầu tiên khi đăng nhập!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <a href="#" className="text-amber-600 hover:text-orange-600 font-medium">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-amber-600 hover:text-orange-600 font-medium">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi
            </p>
          </div>
        </div>
      </div>

      {/* Background Pattern cho mobile */}
      <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-200/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            ☕
          </div>
        ))}
      </div>

      {/* Custom CSS */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(5deg); }
            66% { transform: translateY(-5px) rotate(-3deg); }
          }
          
          @keyframes steam {
            0% { opacity: 0.8; transform: translateY(0px) scale(0.8); }
            50% { opacity: 0.5; transform: translateY(-20px) scale(1.2); }
            100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-steam {
            animation: steam 3s ease-out infinite;
          }
        `}
      </style>
    </div>
  );
}