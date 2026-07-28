import api from './api';

export const categoryService = {
  getAll: async () => {
    return await api.get('/categories');
  },

  create: async (catData) => {
    return await api.post('/categories', catData);
  },

  update: async (id, catData) => {
    return await api.put(`/categories/${id}`, catData);
  },

  delete: async (id) => {
    return await api.delete(`/categories/${id}`);
  },
};
