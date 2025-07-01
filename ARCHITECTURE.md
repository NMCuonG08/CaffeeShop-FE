# Code Architecture Improvements

Tài liệu này mô tả các cải thiện về cấu trúc code để dễ maintain hơn.

## 🚀 Những cải tiến chính

### 1. Constants Centralization (`src/constants/`)

Tất cả constants được centralized để tránh magic numbers/strings:

```typescript
import { PAYMENT_TYPES, DATE_FORMAT_CONFIG, BUSINESS_CONFIG } from '@/constants';
```

### 2. Utility Functions Refactoring (`src/utils/`)

#### Formatting Utils
```typescript
import { formatCurrency, formatDate, formatPrice, formatVNDAsUSD } from '@/utils';

// Trước
const formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Sau
const formatted = formatCurrency(amount);
```

#### Error Handling Utils
```typescript
import { withErrorHandling, createError, getErrorMessage } from '@/utils';

// Async operations với error handling
const [result, error] = await withErrorHandling(async () => {
  return await apiCall();
});
```

#### Payment Utils
```typescript
import { getPaymentTypeLabel } from '@/utils';

// Trước
const getPaymentTypeLabel = (paymentType) => {
  switch (paymentType) {
    case 'COD': return 'Thanh toán khi nhận hàng';
    // ...
  }
};

// Sau
const label = getPaymentTypeLabel(paymentType);
```

### 3. Configuration Management (`src/configs/`)

#### Environment Config
```typescript
import { ENV_CONFIG, isDevelopment } from '@/configs';

const apiUrl = ENV_CONFIG.API_URL;
if (isDevelopment()) {
  console.log('Development mode');
}
```

#### App Config
```typescript
import { API_CONFIG, THEME_CONFIG, VALIDATION_CONFIG } from '@/configs';

const maxFileSize = UPLOAD_CONFIG.MAX_FILE_SIZE;
const primaryColor = THEME_CONFIG.COLORS.PRIMARY;
```

### 4. Custom Hooks (`src/hooks/`)

#### Formatter Hook
```typescript
import { useFormatter } from '@/hooks/useFormatter';

const MyComponent = () => {
  const { currency, date, price } = useFormatter();
  
  return (
    <div>
      <span>{currency(1000000)}</span>
      <span>{date(new Date())}</span>
    </div>
  );
};
```

### 5. Error Boundary Component (`src/components/common/ErrorBoundary.tsx`)

```typescript
import { ErrorBoundary } from '@/components/common';

<ErrorBoundary onError={(error, errorInfo) => console.log(error)}>
  <MyComponent />
</ErrorBoundary>
```

## 📁 Cấu trúc thư mục được cải tiến

```
src/
├── constants/          # Centralized constants
│   └── index.ts       # Payment types, formats, business rules
├── configs/           # Configuration management
│   ├── app.config.ts  # App-wide settings
│   ├── env.config.ts  # Environment variables
│   └── index.ts
├── utils/             # Utility functions
│   ├── formatCurrency.ts  # Formatting utilities
│   ├── payment.ts         # Payment-related utilities
│   ├── error.ts           # Error handling utilities
│   └── index.ts
├── hooks/             # Custom hooks
│   └── useFormatter.ts    # Formatting hook
└── components/common/
    ├── ErrorBoundary.tsx  # Error boundary component
    └── index.ts
```

## 🔧 Migration Guide

### Bước 1: Cập nhật imports
```typescript
// Trước
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Sau
import { formatCurrency } from '@/utils';
```

### Bước 2: Sử dụng constants
```typescript
// Trước
if (paymentType === 'COD') { ... }

// Sau
import { PAYMENT_TYPES } from '@/constants';
if (paymentType === PAYMENT_TYPES.COD) { ... }
```

### Bước 3: Wrap components với ErrorBoundary
```typescript
import { ErrorBoundary } from '@/components/common';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## ✅ Benefits

1. **DRY (Don't Repeat Yourself)**: Loại bỏ duplicate code
2. **Type Safety**: Better TypeScript support
3. **Maintainability**: Centralized configuration
4. **Error Handling**: Consistent error management
5. **Performance**: Memoized formatting functions
6. **Developer Experience**: Better IDE support và autocomplete

## 🎯 Next Steps

1. Áp dụng constants vào toàn bộ codebase
2. Replace tất cả duplicate formatting functions
3. Add validation utilities
4. Implement logging service
5. Add performance monitoring utilities
