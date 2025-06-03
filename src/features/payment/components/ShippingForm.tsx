
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ShippingInfo } from '../types/payment.type';
import { AlertCircle, MapPin, User, Mail, Phone } from 'lucide-react';
import { z } from 'zod';

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

export type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  onChange: (info: ShippingInfo) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ shippingInfo, onChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
    trigger
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingInfo,
    mode: 'onChange'
  });

  // Watch all form values to sync with parent
  const watchedValues = watch();
  const prevValuesRef = useRef<ShippingInfo>();

  // Memoize onChange để tránh tạo function mới mỗi lần render
  const memoizedOnChange = useCallback(onChange, []);

  React.useEffect(() => {
    // Chỉ call onChange khi values thực sự thay đổi
    const currentValues = watchedValues as ShippingInfo;
    
    if (JSON.stringify(currentValues) !== JSON.stringify(prevValuesRef.current)) {
      prevValuesRef.current = currentValues;
      memoizedOnChange(currentValues);
    }
  }, [watchedValues, memoizedOnChange]);

  // Rest of the component remains the same...
  const vietnamCities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'vungtau', label: 'Vũng Tàu' },
  ];


  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    placeholder, 
    icon: Icon,
    ...props 
  }: any) => (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 mr-1 text-gray-500" />}
        {label} {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          {...register(name)}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors[name]
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
              : touchedFields[name] && !errors[name]
              ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
          placeholder={placeholder}
          {...props}
        />
        {touchedFields[name] && !errors[name] && (
          <div className="absolute right-3 top-3">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
      {errors[name] && (
        <div className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors[name]?.message}
        </div>
      )}
    </div>
  );

  const SelectField = ({ name, label, options, icon: Icon, ...props }: any) => (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 mr-1 text-gray-500" />}
        {label} {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...register(name)}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
          errors[name]
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
            : touchedFields[name] && !errors[name]
            ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
        {...props}
      >
        <option value="">Chọn {label.toLowerCase()}</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors[name]?.message}
        </div>
      )}
    </div>
  );

  const TextareaField = ({ name, label, ...props }: any) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...register(name)}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
          errors[name]
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
            : touchedFields[name] && !errors[name]
            ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
        {...props}
      />
      {errors[name] && (
        <div className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors[name]?.message}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h3>
        {isValid && Object.keys(touchedFields).length > 0 && (
          <div className="ml-auto flex items-center text-green-600">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Hoàn thành</span>
          </div>
        )}
      </div>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            name="fullName"
            label="Họ và tên"
            placeholder="Nhập họ và tên đầy đủ"
            icon={User}
            required
          />
          
          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="example@email.com"
            icon={Mail}
            required
          />
          
          <InputField
            name="phone"
            label="Số điện thoại"
            type="tel"
            placeholder="0987654321"
            icon={Phone}
            required
          />
          
          <SelectField
            name="city"
            label="Tỉnh/Thành phố"
            options={vietnamCities}
            icon={MapPin}
            required
          />
          
          <InputField
            name="district"
            label="Quận/Huyện"
            placeholder="Nhập quận/huyện"
            required
          />
          
          <InputField
            name="ward"
            label="Phường/Xã"
            placeholder="Nhập phường/xã"
            required
          />
        </div>
        
        <TextareaField
          name="address"
          label="Địa chỉ cụ thể"
          rows={3}
          placeholder="Số nhà, tên đường, tòa nhà..."
          required
        />
        
        <TextareaField
          name="notes"
          label="Ghi chú đơn hàng"
          rows={2}
          placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
        />

        {/* Form validation summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Trạng thái form:</span>
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${isValid ? 'text-green-600' : 'text-orange-600'}`}>
                {isValid ? '✓ Hợp lệ' : '⚠ Cần kiểm tra'}
              </span>
              <span className="text-gray-500">
                {Object.keys(errors).length > 0 && `${Object.keys(errors).length} lỗi`}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;