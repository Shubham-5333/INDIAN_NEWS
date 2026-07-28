import api from './api';

export const mediaService = {
  getAll: async () => {
    return await api.get('/media');
  },

  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: async (id) => {
    return await api.delete(`/media/${id}`);
  },
};
