import React, { useState, useCallback, useEffect } from 'react';
import { type ShippingInfo } from '../types/payment.type';
import { AlertCircle, MapPin, User, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { showError, showSuccess } from '@/components';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUserInfo } from '@/features/auth/hooks/useUserInfo';

const shippingSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên không được quá 50 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),

  email: z
    .string()
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),

  phone: z
    .string()
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ (VD: 0987654321)')
    .min(10, 'Số điện thoại phải có 10 số')
    .max(10, 'Số điện thoại phải có 10 số'),

  city: z
    .string()
    .min(1, 'Vui lòng chọn tỉnh/thành phố'),

  district: z
    .string()
    .min(2, 'Quận/huyện phải có ít nhất 2 ký tự')
    .max(50, 'Quận/huyện không được quá 50 ký tự'),

  ward: z
    .string()
    .min(2, 'Phường/xã phải có ít nhất 2 ký tự')
    .max(50, 'Phường/xã không được quá 50 ký tự'),

  address: z
    .string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự'),

  notes: z
    .string()
    .max(500, 'Ghi chú không được quá 500 ký tự')
    .optional()
});

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  onChange: (info: ShippingInfo) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ shippingInfo, onChange }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  const vietnamCities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'vungtau', label: 'Vũng Tàu' },
  ];

  const { isAuthenticated, user } = useAuth();
  const { userInfo, loading, error, updating, updateUserInfo } = useUserInfo(
    user?.id,
  );

  // Load user info vào form khi có data
  useEffect(() => {
    if (userInfo && isAuthenticated) {
      const userShippingInfo: ShippingInfo = {
        fullName: userInfo.fullName || '', // fullname thay vì full_name
        email: userInfo.email || user?.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        city: userInfo.city || '',
        district: userInfo.district || '',
        ward: userInfo.ward || '',
        notes: ''
      };

      // Chỉ update nếu form đang trống hoặc chưa có thông tin
      const isFormEmpty = !shippingInfo.fullName && !shippingInfo.phone && !shippingInfo.address;

      if (isFormEmpty) {
        onChange(userShippingInfo);
        showSuccess('Đã tải thông tin giao hàng từ hồ sơ của bạn');
      }
    }
  }, [userInfo, isAuthenticated, user, onChange]);

  // Show notification based on auth status
  useEffect(() => {
    if (!isAuthenticated) {
      showError('Bạn cần đăng nhập để sử dụng tính năng này');
    }
  }, [isAuthenticated]);

  // Handle update user info
  const handleUpdateUserInfo = async () => {
    if (!isAuthenticated || !user?.id) {
      showError('Bạn cần đăng nhập để cập nhật thông tin');
      return;
    }

    if (!validateAllFields()) {
      showError('Vui lòng kiểm tra lại thông tin trước khi cập nhật');
      return;
    }

    setIsLoadingUserInfo(true);
    try {
      const updateData = {
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        district: shippingInfo.district,
        ward: shippingInfo.ward,
      };

      await updateUserInfo(updateData);
      showSuccess('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Update user info error:', error);
      showError('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoadingUserInfo(false);
    }
  };

  // Handle load user info manually
  const handleLoadUserInfo = async () => {
    if (!userInfo) {
      showError('Không tìm thấy thông tin người dùng');
      return;
    }

    const userShippingInfo: ShippingInfo = {
      fullName: userInfo.fullName || '', // fullname thay vì full_name
      email: userInfo.email || user?.email || '',
      phone: userInfo.phone || '',
      address: userInfo.address || '',
      city: userInfo.city || '',
      district: userInfo.district || '',
      ward: userInfo.ward || '',
      notes: shippingInfo.notes || '' // Giữ nguyên notes hiện tại
    };

    onChange(userShippingInfo);
    showSuccess('Đã tải lại thông tin từ hồ sơ của bạn');
  };

  const validateField = useCallback((name: string, value: string) => {
    try {
      const fieldSchema = shippingSchema.shape[name as keyof typeof shippingSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [name]: '' }));
        return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0]?.message || 'Lỗi validation' }));
        return false;
      }
    }
    return true;
  }, []);

  const validateAllFields = useCallback(() => {
    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    Object.keys(shippingInfo).forEach(key => {
      const value = shippingInfo[key as keyof ShippingInfo] || '';
      try {
        const fieldSchema = shippingSchema.shape[key as keyof typeof shippingSchema.shape];
        if (fieldSchema) {
          fieldSchema.parse(value);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors[key] = error.errors[0]?.message || 'Lỗi validation';
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);
    setShowValidation(true);
    return !hasErrors;
  }, [shippingInfo]);

  const handleInputChange = useCallback((field: keyof ShippingInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const updatedInfo = { ...shippingInfo, [field]: value };
      onChange(updatedInfo);

      if (showValidation && errors[field]) {
        validateField(field, value);
      }
    }, [shippingInfo, onChange, showValidation, errors, validateField]);

  const handleBlur = useCallback((field: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));

    if (showValidation) {
      validateField(field, value);
    }
  }, [validateField, showValidation]);

  const isFormValid = useCallback(() => {
    try {
      shippingSchema.parse(shippingInfo);
      return true;
    } catch {
      return false;
    }
  }, [shippingInfo]);

  const triggerValidation = useCallback(() => {
    return validateAllFields();
  }, [validateAllFields]);

  React.useImperativeHandle(React.useRef(), () => ({
    triggerValidation
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h3>
          {isFormValid() && showValidation && (
            <div className="ml-4 flex items-center text-green-600">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Good</span>
            </div>
          )}
        </div>

        {/* User info actions */}
        {isAuthenticated && (
          <div className="flex items-center space-x-2">
            {userInfo && (
              <button
                type="button"
                onClick={handleLoadUserInfo}
                disabled={loading || isLoadingUserInfo}
                className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Tải lại thông tin
              </button>
            )}

            <button
              type="button"
              onClick={handleUpdateUserInfo}
              disabled={updating || isLoadingUserInfo || !isFormValid()}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User className={`h-4 w-4 mr-1 ${updating || isLoadingUserInfo ? 'animate-pulse' : ''}`} />
              {updating || isLoadingUserInfo ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Validation result:', isFormValid());
                console.log('Form data:', shippingInfo);
                console.log('Errors:', errors);
                const result = validateAllFields();
                console.log('Full validation:', result);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Check
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-blue-700">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            <span className="text-sm">Đang tải thông tin người dùng...</span>
          </div>
        </div>
      )}

      {/* User info status */}
      {isAuthenticated && userInfo && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <User className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Thông tin từ hồ sơ: <strong>{userInfo.fullname || 'Chưa có tên'}</strong>
              {userInfo.phone && <span> • {userInfo.phone}</span>}
            </span>
          </div>
        </div>
      )}

      {/* Not authenticated warning */}
      {!isAuthenticated && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Đăng nhập để tự động điền thông tin và lưu vào hồ sơ của bạn
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shippingInfo.fullName || ''}
              onChange={handleInputChange('fullName')}
              onBlur={(e) => handleBlur('fullName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${showValidation && errors.fullName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              placeholder="Nhập họ và tên đầy đủ"
            />
            {showValidation && errors.fullName && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={shippingInfo.email || ''}
              onChange={handleInputChange('email')}
              onBlur={(e) => handleBlur('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${showValidation && errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              placeholder="example@email.com"
            />
            {showValidation && errors.email && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={shippingInfo.phone || ''}
              onChange={handleInputChange('phone')}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${showValidation && errors.phone
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              placeholder="0987654321"
            />
            {showValidation && errors.phone && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Tỉnh/Thành phố */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              value={shippingInfo.city || ''}
              onChange={handleInputChange('city')}
              onBlur={(e) => handleBlur('city', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${showValidation && errors.city
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {vietnamCities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showValidation && errors.city && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.city}
              </div>
            )}
          </div>

          {/* Quận/Huyện */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shippingInfo.district || ''}
              onChange={handleInputChange('district')}
              onBlur={(e) => handleBlur('district', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${showValidation && errors.district
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              placeholder="Nhập quận/huyện"
            />
            {showValidation && errors.district && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.district}
              </div>
            )}
          </div>

          {/* Phường/Xã */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shippingInfo.ward || ''}
              onChange={handleInputChange('ward')}
              onBlur={(e) => handleBlur('ward', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${showValidation && errors.ward
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              placeholder="Nhập phường/xã"
            />
            {showValidation && errors.ward && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.ward}
              </div>
            )}
          </div>
        </div>

        {/* Địa chỉ cụ thể */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Địa chỉ cụ thể <span className="text-red-500">*</span>
          </label>
          <textarea
            value={shippingInfo.address || ''}
            onChange={handleInputChange('address')}
            onBlur={(e) => handleBlur('address', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${showValidation && errors.address
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            rows={3}
            placeholder="Số nhà, tên đường, tòa nhà..."
          />
          {showValidation && errors.address && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.address}
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ghi chú đơn hàng
          </label>
          <textarea
            value={shippingInfo.notes || ''}
            onChange={handleInputChange('notes')}
            onBlur={(e) => handleBlur('notes', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${showValidation && errors.notes
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            rows={2}
            placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
          />
          {showValidation && errors.notes && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.notes}
            </div>
          )}
        </div>

        {/* Trạng thái form */}
        {showValidation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trạng thái form:</span>
              <div className="flex items-center space-x-4">
                <span className={`font-medium ${isFormValid() ? 'text-green-600' : 'text-orange-600'}`}>
                  {isFormValid() ? '✓ Hợp lệ' : '⚠ Cần kiểm tra'}
                </span>
                <span className="text-gray-500">
                  {Object.keys(errors).filter(key => errors[key]).length > 0 &&
                    `${Object.keys(errors).filter(key => errors[key]).length} lỗi`}
                </span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  💡 Thông tin sẽ được lưu vào hồ sơ khi bạn nhấn "Cập nhật hồ sơ"
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingForm;