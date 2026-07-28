import React, { useState, useEffect } from 'react';
import { factsService } from '../../services/factsService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/tables/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { Modal } from '../../components/modal/Modal';
import { ConfirmationDialog } from '../../components/modal/ConfirmationDialog';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Select } from '../../components/common/Select';
import { Lightbulb, Plus, Edit3, Trash2 } from 'lucide-react';

export const FactsList = () => {
  const [facts, setFacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFact, setEditingFact] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'General',
    status: 'published',
    seoTitle: '',
    seoDescription: '',
  });

  const { showToast } = useToast();

  const fetchFacts = async () => {
    try {
      setLoading(true);
      const [factRes, catRes] = await Promise.all([
        factsService.getAll(),
        categoryService.getAll(),
      ]);
      setFacts(factRes || []);
      setCategories(catRes || []);
    } catch (err) {
      showToast('error', err.message || 'Failed to load facts data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !editingFact ? title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : prev.slug,
      seoTitle: !editingFact ? title : prev.seoTitle,
    }));
  };

  const openCreateModal = () => {
    setEditingFact(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      category: categories[0]?.name || 'General',
      status: 'published',
      seoTitle: '',
      seoDescription: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fact) => {
    setEditingFact(fact);
    setFormData({
      title: fact.title || '',
      slug: fact.slug || '',
      content: fact.content || '',
      category: fact.category || 'General',
      status: fact.status || 'published',
      seoTitle: fact.seoTitle || fact.title || '',
      seoDescription: fact.seoDescription || fact.content?.substring(0, 160) || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      setSaveLoading(true);
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
        content: formData.content,
        category: formData.category,
        status: formData.status,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.content.substring(0, 160),
      };

      if (editingFact) {
        await factsService.update(editingFact._id, payload);
        showToast('success', 'Fact updated successfully');
      } else {
        await factsService.create(payload);
        showToast('success', 'Fact created successfully');
      }
      setIsModalOpen(false);
      fetchFacts();
    } catch (err) {
      showToast('error', err.message || 'Failed to save fact');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await factsService.delete(deleteId);
      showToast('success', 'Fact deleted successfully');
      setDeleteId(null);
      fetchFacts();
    } catch (err) {
      showToast('error', err.message || 'Delete fact failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredFacts = facts.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.content.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Title',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <div className="text-xs text-slate-400 max-w-md line-clamp-1 mt-0.5">{row.content}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="bg-slate-900 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded font-semibold uppercase">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 bg-slate-900 hover:bg-slate-700 text-blue-400 rounded border border-slate-700 transition-colors"
            title="Edit Fact"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700 transition-colors"
            title="Delete Fact"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Facts Management"
        description="Create and manage facts, category tags, and SEO details."
        icon={Lightbulb}
        actions={
          <Button icon={Plus} onClick={openCreateModal}>
            Add New Fact
          </Button>
        }
      />

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search facts..."
          className="w-full md:w-96"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredFacts}
        loading={loading}
        emptyTitle="No facts found."
        emptyDescription="Click 'Add New Fact' above to create your first fact entry."
      />

      {/* Modal for Create/Edit Fact */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFact ? 'Edit Fact' : 'Create New Fact'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveSubmit} className="space-y-4 font-sans">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Fact title..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="fact-slug"
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.map((c) => ({ value: c.name, label: c.name }))}
            />

            <Select
              label="Publish Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
          </div>

          <Textarea
            label="Content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value, seoDescription: formData.seoDescription || e.target.value.substring(0, 160) })}
            placeholder="Fact content detail..."
          />

          <div className="pt-2 border-t border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">SEO Settings</h4>
            <Input
              label="SEO Title"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="SEO Title..."
            />
            <Textarea
              label="SEO Description"
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="SEO Description..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saveLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saveLoading}>
              Save Fact
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Fact Entry"
        message="Are you sure you want to delete this fact entry?"
      />
    </div>
  );
};
