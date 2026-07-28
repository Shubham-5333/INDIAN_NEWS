import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Lightbulb, Plus, Edit3, Trash2, CheckCircle, XCircle, Star, X } from 'lucide-react';

export const FactsManager = () => {
  const [facts, setFacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFact, setEditingFact] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    featured: false,
    status: 'published',
    source: 'Indian News Research Desk',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [factRes, catRes] = await Promise.all([
        api.getFacts({ adminView: 'true' }),
        api.getCategories(),
      ]);
      setFacts(factRes || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Error fetching facts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingFact(null);
    setFormData({
      title: '',
      content: '',
      category: categories[0]?.name || 'General',
      featured: false,
      status: 'published',
      source: 'Indian News Research Desk',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fact) => {
    setEditingFact(fact);
    setFormData({
      title: fact.title || '',
      content: fact.content || '',
      category: fact.category || 'General',
      featured: Boolean(fact.featured),
      status: fact.status || 'published',
      source: fact.source || 'Indian News Research Desk',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFact) {
        await api.updateFact(editingFact._id, formData);
      } else {
        await api.createFact(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(`Failed to save fact: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fact?')) {
      try {
        await api.deleteFact(id);
        fetchData();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={24} />
            <span>Facts & Trivia Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage fast facts, infographics data, and trivia snippets.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-colors"
        >
          <Plus size={16} />
          <span>Add New Fact</span>
        </button>
      </div>

      {/* Facts Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading facts data...</div>
        ) : facts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No facts entries in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {facts.map((fact) => (
                  <tr key={fact._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{fact.title}</div>
                      <div className="text-xs text-slate-400 max-w-md line-clamp-2 mt-1">{fact.content}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-900 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded font-semibold uppercase">
                        {fact.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{fact.source}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider border ${
                          fact.status === 'published'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800'
                        }`}
                      >
                        {fact.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {fact.featured && <Star size={16} className="text-amber-400 inline" fill="currentColor" />}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(fact)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-blue-400 rounded border border-slate-700 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(fact._id)}
                        className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700 transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700 mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                {editingFact ? 'Edit Fact' : 'Add New Fact'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Fact Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. World’s Highest Rail Bridge"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Fact Detail / Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter fact description..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Source
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                  />
                  <span>Featured Fact</span>
                </label>

                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider"
                >
                  Save Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
