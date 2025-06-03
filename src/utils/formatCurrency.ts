// src/utils/formatCurrency.ts
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };