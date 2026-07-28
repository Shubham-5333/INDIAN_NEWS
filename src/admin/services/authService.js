import api from './api';

export const authService = {
  login: async (username, password) => {
    const data = await api.post('/auth/login', { username, password });
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: data._id,
        username: data.username,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
    }
    return data;
  },

  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  updateProfile: async (profileData) => {
    const data = await api.put('/auth/profile', profileData);
    localStorage.setItem('adminUser', JSON.stringify(data));
    return data;
  },

  changePassword: async (passwords) => {
    return await api.put('/auth/change-password', passwords);
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem('adminToken'));
  },
};
