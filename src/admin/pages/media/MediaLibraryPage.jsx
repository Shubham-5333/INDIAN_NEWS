import React, { useState, useEffect } from 'react';
import { mediaService } from '../../services/mediaService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmationDialog } from '../../components/modal/ConfirmationDialog';
import { Modal } from '../../components/modal/Modal';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Eye } from 'lucide-react';

export const MediaLibraryPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Preview Modal
  const [previewMedia, setPreviewMedia] = useState(null);

  // Delete Confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useToast();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await mediaService.getAll();
      setMediaList(res || []);
    } catch (err) {
      showToast('error', err.message || 'Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      await mediaService.upload(file);
      showToast('success', 'Image uploaded successfully!');
      fetchMedia();
    } catch (err) {
      showToast('error', err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await mediaService.delete(deleteId);
      showToast('success', 'Image deleted successfully');
      setDeleteId(null);
      fetchMedia();
    } catch (err) {
      showToast('error', err.message || 'Delete image failed');
    } fontFinally: {
      setDeleteLoading(false);
    }
  };

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('info', 'Image URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter((m) =>
    m.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Media Library Assets"
        description="Upload photos, graphics, and images for news stories."
        icon={ImageIcon}
        actions={
          <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2 transition-colors">
            <Upload size={16} />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        }
      />

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search media files by name..."
          className="w-full md:w-80"
        />
      </div>

      {loading ? (
        <SkeletonLoader rows={4} type="card" />
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          title="No media assets found"
          description="Upload images to populate your central media library."
          icon={ImageIcon}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div key={item._id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md group relative flex flex-col justify-between">
              <div
                onClick={() => setPreviewMedia(item)}
                className="aspect-square bg-slate-950 overflow-hidden relative cursor-pointer group-hover:opacity-90 transition-opacity"
              >
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye size={24} className="text-white" />
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-semibold text-white truncate">{item.originalName}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{(item.size / 1024).toFixed(1)} KB</p>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700">
                  <button
                    onClick={() => handleCopyUrl(item._id, item.url)}
                    className="flex-1 bg-slate-900 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-1 px-2 rounded border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedId === item._id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedId === item._id ? 'Copied!' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-1 bg-slate-900 hover:bg-red-950 text-red-400 rounded border border-slate-700 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewMedia)}
        onClose={() => setPreviewMedia(null)}
        title="Image Preview"
        maxWidth="max-w-3xl"
      >
        {previewMedia && (
          <div className="space-y-4">
            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center max-h-[60vh]">
              <img src={previewMedia.url} alt="" className="max-h-[60vh] object-contain" />
            </div>
            <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 break-all">
              {previewMedia.url}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Media Asset"
        message="Are you sure you want to delete this media asset?"
      />
    </div>
  );
};
