import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { ZodType } from "zod/v4";
import type { FormLogin } from "@/types/auth.type";

const formSchema: ZodType<FormLogin> = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(1, "Mật khẩu phải có ít nhất 6 ký tự"),
});

interface LoginFormProps {
  onSubmit: (data: FormLogin) => void;
  loading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormLogin>({
    resolver: zodResolver(formSchema)
  });

  return (
    <>
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        /* Custom focus styles */
        input:focus {
          transform: translateY(-1px);
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.25);
        }

        /* Custom checkbox styles */
        input[type="checkbox"]:checked {
          background-color: #f59e0b;
          border-color: #f59e0b;
        }

        /* Button ripple effect */
        button[type="submit"]:active {
          transform: scale(0.98);
        }
      `}</style>
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className="group">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-amber-600">
            <span className="flex items-center gap-2">
              <span>📧</span>
              Email Address
            </span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={`
                appearance-none relative block w-full px-4 py-4 pl-12 
                border-2 placeholder-gray-400 text-gray-900 rounded-2xl 
                bg-white/70 backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                hover:border-amber-300 transition-all duration-300
                ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'}
              `}
              placeholder="your@email.com"
              {...register("email")}
            />
            {/* Email Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
          {errors.email && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-slide-down">
              <span>⚠️</span>
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="group">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-amber-600">
            <span className="flex items-center gap-2">
              <span>🔒</span>
              Mật khẩu
            </span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className={`
                appearance-none relative block w-full px-4 py-4 pl-12 pr-12
                border-2 placeholder-gray-400 text-gray-900 rounded-2xl 
                bg-white/70 backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                hover:border-amber-300 transition-all duration-300
                ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'}
              `}
              placeholder="••••••••"
              {...register("password")}
            />
            {/* Password Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            {/* Toggle Password Visibility */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-slide-down">
              <span>⚠️</span>
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors"
            />
            <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 select-none cursor-pointer">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div className="text-sm">
            <a 
              href="#" 
              className="font-medium text-amber-600 hover:text-orange-600 transition-colors duration-200 relative group"
            >
              Quên mật khẩu?
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50/80 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-slide-down backdrop-blur-sm">
            <span className="text-lg">❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-6">
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">☕</span>
              )}
            </span>
            
            <span className="relative">
              {loading ? "Đang xử lý..." : "Đăng nhập vào Aurora"}
            </span>
            
            {!loading && (
              <span className="absolute right-0 inset-y-0 flex items-center pr-6">
                <svg className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}

            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
          </button>
        </div>

        {/* Additional Login Info */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-4">
            <div className="flex items-center justify-center space-x-2 text-amber-800">
              <span className="text-lg">🔐</span>
              <span className="text-sm font-medium">Đăng nhập an toàn với mã hóa SSL</span>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm;