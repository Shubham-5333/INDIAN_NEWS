import api from './api';

export const newsService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams({ adminView: 'true', ...params }).toString();
    return await api.get(`/news?${query}`);
  },

  getBySlug: async (slug) => {
    return await api.get(`/news/${slug}`);
  },

  create: async (newsData) => {
    return await api.post('/news', newsData);
  },

  update: async (id, newsData) => {
    return await api.put(`/news/${id}`, newsData);
  },

  delete: async (id) => {
    return await api.delete(`/news/${id}`);
  },

  toggleStatus: async (id) => {
    return await api.patch(`/news/${id}/status`);
  },

  toggleFeatured: async (id) => {
    return await api.patch(`/news/${id}/featured`);
  },
};
