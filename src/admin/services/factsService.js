import api from './api';

export const factsService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams({ adminView: 'true', ...params }).toString();
    return await api.get(`/facts?${query}`);
  },

  create: async (factData) => {
    return await api.post('/facts', factData);
  },

  update: async (id, factData) => {
    return await api.put(`/facts/${id}`, factData);
  },

  delete: async (id) => {
    return await api.delete(`/facts/${id}`);
  },
};
