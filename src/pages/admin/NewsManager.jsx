import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Newspaper, Plus, Search, Edit3, Trash2, CheckCircle, XCircle, Star, Eye, Upload, X, Tag, FileText } from 'lucide-react';

export const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Economy',
    featuredImage: '',
    imageCaption: '',
    tags: '',
    status: 'published',
    featured: false,
    isLive: false,
    isBreaking: false,
    authorName: 'Editorial Desk',
    authorRole: 'Senior Reporter',
    seoTitle: '',
    seoDescription: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, catRes] = await Promise.all([
        api.getNews({ adminView: 'true', limit: 100 }),
        api.getCategories(),
      ]);
      setNews(newsRes.news || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Error fetching news list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: categories[0]?.name || 'Economy',
      featuredImage: '',
      imageCaption: '',
      tags: '',
      status: 'published',
      featured: false,
      isLive: false,
      isBreaking: false,
      authorName: 'Editorial Desk',
      authorRole: 'Senior Reporter',
      seoTitle: '',
      seoDescription: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      summary: article.summary || '',
      content: Array.isArray(article.content) ? article.content.join('\n\n') : article.content || '',
      category: article.category || 'Economy',
      featuredImage: article.featuredImage || '',
      imageCaption: article.imageCaption || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '',
      status: article.status || 'published',
      featured: Boolean(article.featured),
      isLive: Boolean(article.isLive),
      isBreaking: Boolean(article.isBreaking),
      authorName: article.author?.name || 'Editorial Desk',
      authorRole: article.author?.role || 'Senior Reporter',
      seoTitle: article.seoTitle || article.title || '',
      seoDescription: article.seoDescription || article.summary || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await api.uploadMedia(file);
      if (res.url) {
        setFormData((prev) => ({ ...prev, featuredImage: res.url }));
      }
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        featuredImage: formData.featuredImage,
        imageCaption: formData.imageCaption,
        tags: formData.tags,
        status: formData.status,
        featured: formData.featured,
        isLive: formData.isLive,
        isBreaking: formData.isBreaking,
        author: {
          name: formData.authorName,
          role: formData.authorRole,
        },
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      };

      if (editingArticle) {
        await api.updateNews(editingArticle._id, payload);
      } else {
        await api.createNews(payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(`Failed to save news article: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await api.deleteNews(id);
        fetchData();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.toggleNewsStatus(id);
      fetchData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await api.toggleNewsFeatured(id);
      fetchData();
    } catch (err) {
      alert(`Featured update failed: ${err.message}`);
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Newspaper className="text-red-500" size={24} />
            <span>News & Articles Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create, edit, publish/unpublish, and manage news stories.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-colors"
        >
          <Plus size={16} />
          <span>Add New Article</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, summary..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading news articles...</div>
        ) : filteredNews.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No articles found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredNews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.featuredImage ? (
                          <img
                            src={item.featuredImage}
                            alt=""
                            className="w-12 h-12 rounded object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                            <Newspaper size={20} className="text-slate-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white max-w-xs md:max-w-md truncate">{item.title}</div>
                          <div className="text-xs text-slate-400 truncate max-w-xs">{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-900 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded font-semibold uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(item._id)}
                        className={`text-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider border flex items-center gap-1 transition-colors ${item.status === 'published'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800 hover:bg-amber-900/60'
                          }`}
                      >
                        {item.status === 'published' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>{item.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item._id)}
                        className={`p-1.5 rounded-lg border transition-colors ${item.featured
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-slate-300'
                          }`}
                        title="Toggle Featured"
                      >
                        <Star size={16} fill={item.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono flex items-center gap-1 mt-3">
                      <Eye size={14} />
                      <span>{item.views}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-blue-400 rounded border border-slate-700 transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700 mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="text-red-500" size={20} />
                <span>{editingArticle ? 'Edit Article' : 'Create New News Article'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter breaking news or article headline"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    URL Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. rbi-policy-rates-2026"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Summary / Lead Synopsis *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Short 2-3 sentence summary displayed on card grids..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>

              {/* Body Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Main Article Content (Paragraphs separated by double linebreaks) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter full news article text here..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg p-3 text-sm font-mono focus:outline-none"
                />
              </div>

              {/* Featured Image & Caption */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://... or upload local image below"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none mb-3"
                  />
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                      <Upload size={14} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Image Caption / Credit
                  </label>
                  <input
                    type="text"
                    value={formData.imageCaption}
                    onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                    placeholder="e.g. Photo: Press Trust of India"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none mb-3"
                  />
                  {formData.featuredImage && (
                    <img src={formData.featuredImage} alt="Preview" className="h-16 object-cover rounded border border-slate-700" />
                  )}
                </div>
              </div>

              {/* Tags & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="RBI, Economy, Inflation, Banking"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 accent-red-600"
                  />
                  <span>Featured Lead Story</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isLive}
                    onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 accent-red-600"
                  />
                  <span>Live Updates Tag</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isBreaking}
                    onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0 accent-red-600"
                  />
                  <span>Show in Breaking Ticker</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-red-600/30"
                >
                  {editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
