import { FEATURED_LEAD_ARTICLE, TOP_STORIES, OPINION_PIECES } from '../data/mockData';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://indian-news-server-eo2m.onrender.com/api';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const getAuthToken = () => localStorage.getItem('adminToken');
export const setAuthToken = (token) => localStorage.setItem('adminToken', token);
export const removeAuthToken = () => localStorage.removeItem('adminToken');
export const getAdminUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};
export const setAdminUser = (user) => localStorage.setItem('adminUser', JSON.stringify(user));
export const removeAdminUser = () => localStorage.removeItem('adminUser');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${formattedEndpoint}`, config);

    if (response.status === 401 && endpoint.startsWith('/admin')) {
      removeAuthToken();
      removeAdminUser();
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error;
  }
}

const getMockNewsFormatted = () => {
  const all = [
    FEATURED_LEAD_ARTICLE,
    ...TOP_STORIES,
    ...OPINION_PIECES
  ].map((item) => ({
    _id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    category: item.category,
    author: item.author || { name: 'Editorial Desk', role: 'Staff Reporter' },
    createdAt: new Date().toISOString(),
    readTime: item.readTime || '4 min read',
    featuredImage: item.featuredImage || '',
    imageCaption: item.imageCaption || '',
    isLive: Boolean(item.isLive),
    isBreaking: Boolean(item.isBreaking),
    views: item.likesCount || 0,
    tags: item.tags || [],
    content: item.content || [],
    featured: Boolean(item.id === 'lead-1' || item.isLive),
  }));
  return { news: all };
};

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (data) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Dashboard Stats
  getDashboardStats: () => request('/admin/dashboard'),

  // News
  getNews: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/news${query ? `?${query}` : ''}`);
      if (res && res.news && res.news.length > 0) {
        return res;
      }
      return getMockNewsFormatted();
    } catch {
      return getMockNewsFormatted();
    }
  },
  getNewsBySlug: async (slug) => {
    try {
      return await request(`/news/${slug}`);
    } catch {
      const mock = getMockNewsFormatted().news.find(n => n.slug === slug || n._id === slug);
      return { news: mock || getMockNewsFormatted().news[0] };
    }
  },
  createNews: (newsData) =>
    request('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    }),
  updateNews: (id, newsData) =>
    request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    }),
  deleteNews: (id) =>
    request(`/news/${id}`, {
      method: 'DELETE',
    }),
  toggleNewsStatus: (id) =>
    request(`/news/${id}/status`, {
      method: 'PATCH',
    }),
  toggleNewsFeatured: (id) =>
    request(`/news/${id}/featured`, {
      method: 'PATCH',
    }),

  // Facts
  getFacts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/facts${query ? `?${query}` : ''}`);
  },
  createFact: (data) =>
    request('/facts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFact: (id, data) =>
    request(`/facts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFact: (id) =>
    request(`/facts/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Media
  getMedia: () => request('/media'),
  uploadMedia: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/media/upload', {
      method: 'POST',
      body: formData,
    });
  },
  deleteMedia: (id) =>
    request(`/media/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
