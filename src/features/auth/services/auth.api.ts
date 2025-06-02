
import apiClient from '@/configs/apiClient';

export const googleLogin = async (data: { credential?: string; code?: string }) => {
    return apiClient.post(`/auth/google`, data);
  }