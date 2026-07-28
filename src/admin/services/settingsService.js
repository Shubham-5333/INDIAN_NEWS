import api from './api';

export const settingsService = {
  getSettings: async () => {
    return await api.get('/settings');
  },

  updateSettings: async (settingsData) => {
    return await api.put('/settings', settingsData);
  },
};

export const adminService = {
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },
};
