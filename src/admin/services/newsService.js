import api from './api';

export const newsService = {
  getAll: async (params = {}) => {
    const cleanParams = new URLSearchParams();
    cleanParams.append('adminView', 'true');
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val !== undefined && val !== null && val !== '' && val !== 'All' && val !== 'undefined') {
        cleanParams.append(key, val);
      }
    });
    return await api.get(`/news?${cleanParams.toString()}`);
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
