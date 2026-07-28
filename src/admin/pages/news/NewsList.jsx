import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/tables/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmationDialog } from '../../components/modal/ConfirmationDialog';
import { Newspaper, Plus, Edit3, Trash2 } from 'lucide-react';

export const NewsList = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await newsService.getAll({
        search,
        category: selectedCat !== 'All' ? selectedCat : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        page,
        limit: 10,
      });
      setNews(res.news || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      showToast('error', err.message || 'Failed to load news list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getAll().then((cats) => setCategories(cats || []));
  }, []);

  useEffect(() => {
    fetchNews();
  }, [search, selectedCat, selectedStatus, page]);

  const handleToggleStatus = async (id) => {
    try {
      await newsService.toggleStatus(id);
      showToast('success', 'Article status updated');
      fetchNews();
    } catch (err) {
      showToast('error', err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await newsService.delete(deleteId);
      showToast('success', 'Article deleted successfully');
      setDeleteId(null);
      fetchNews();
    } catch (err) {
      showToast('error', err.message || 'Delete article failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: 'Featured Image',
      render: (row) => (
        row.featuredImage ? (
          <img src={row.featuredImage} alt="" className="w-12 h-12 rounded object-cover border border-slate-700 shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
            <Newspaper size={18} className="text-slate-500" />
          </div>
        )
      ),
    },
    {
      header: 'Title',
      render: (row) => (
        <div>
          <div className="font-semibold text-white max-w-xs md:max-w-md truncate">{row.title}</div>
          <div className="text-xs text-slate-400 truncate max-w-xs">{row.slug}</div>
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
      render: (row) => (
        <StatusChip status={row.status} clickable onClick={() => handleToggleStatus(row._id)} />
      ),
    },
    {
      header: 'Published Date',
      render: (row) => (
        <span className="text-xs text-slate-400">
          {new Date(row.createdAt || row.publishedAt).toLocaleDateString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(`/admin/news/edit/${row._id}`)}
            className="p-1.5 bg-slate-900 hover:bg-slate-700 text-blue-400 rounded border border-slate-700 transition-colors"
            title="Edit Article"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700 transition-colors"
            title="Delete Article"
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
        title="News & Articles"
        description="Manage news stories, categories, publish status, and SEO."
        icon={Newspaper}
        actions={
          <Button icon={Plus} onClick={() => navigate('/admin/news/new')}>
            Add New Article
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search news..."
          className="w-full md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setPage(1);
            }}
            options={[{ value: 'All', label: 'All Categories' }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={news}
        loading={loading}
        emptyTitle="No news found."
        emptyDescription="Try adjusting search or category filters, or click Add New Article to create one."
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete News Article"
        message="Are you sure you want to delete this news article?"
      />
    </div>
  );
};
