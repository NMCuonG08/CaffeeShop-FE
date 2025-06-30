import apiClient from '@/configs/apiClient';

export const getAllStats = async () => {
    return apiClient.post(`/auth/google`);
  }