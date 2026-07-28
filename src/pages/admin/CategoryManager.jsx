import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { FolderTree, Plus, Edit3, Trash2, X } from 'lucide-react';

export const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({ name: '', slug: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.updateCategory(editingCat._id, formData);
      } else {
        await api.createCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(`Category save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderTree className="text-emerald-500" size={24} />
            <span>Category Taxonomy Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Organize articles and content into structured categories.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-colors"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No categories found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white uppercase">{cat.name}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{cat.slug}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-sm">{cat.description || '—'}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-blue-400 rounded border border-slate-700"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700 mb-6">
              <h3 className="text-lg font-bold text-white uppercase">
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Technology"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="technology"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this news category..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-200 font-bold rounded-lg text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
