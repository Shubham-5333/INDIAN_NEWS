import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/modal/Modal';
import { ConfirmationDialog } from '../../components/modal/ConfirmationDialog';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { FolderTree, Plus, Edit3, Trash2 } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      setCategories(res || []);
    } catch (err) {
      showToast('error', err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaveLoading(true);
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
        description: formData.description,
      };

      if (editingCat) {
        await categoryService.update(editingCat._id, payload);
        showToast('success', 'Category updated successfully');
      } else {
        await categoryService.create(payload);
        showToast('success', 'Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      showToast('error', err.message || 'Category save failed');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await categoryService.delete(deleteId);
      showToast('success', 'Category deleted successfully');
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      showToast('error', err.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      render: (row) => <span className="font-bold text-white uppercase">{row.name}</span>,
    },
    {
      header: 'Slug',
      render: (row) => <span className="text-slate-400 font-mono text-xs">{row.slug}</span>,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 bg-slate-900 hover:bg-slate-700 text-blue-400 rounded border border-slate-700 transition-colors"
            title="Edit Category"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700 transition-colors"
            title="Delete Category"
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
        title="Categories"
        description="Manage news and facts taxonomy."
        icon={FolderTree}
        actions={
          <Button icon={Plus} onClick={openCreateModal}>
            Add Category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyTitle="No categories found."
        emptyDescription="Click 'Add Category' above to create a new category."
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Create Category'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
                slug: !editingCat ? e.target.value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : formData.slug,
              })
            }
            placeholder="Category name..."
          />

          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="category-slug"
          />

          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Category description..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saveLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saveLoading}>
              Save Category
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
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
};
