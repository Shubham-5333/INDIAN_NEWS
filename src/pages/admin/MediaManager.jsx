import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Image as ImageIcon, Upload, Trash2, Copy, Check } from 'lucide-react';

export const MediaManager = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.getMedia();
      setMediaList(res || []);
    } catch (err) {
      console.error('Error loading media assets:', err);
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
      await api.uploadMedia(file);
      fetchMedia();
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media asset?')) {
      try {
        await api.deleteMedia(id);
        fetchMedia();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-cyan-500" size={24} />
            <span>Media Assets Gallery</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload and manage image assets for news stories and articles.</p>
        </div>

        <label className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-colors">
          <Upload size={16} />
          <span>{uploading ? 'Uploading Asset...' : 'Upload New Image'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading media library...</div>
      ) : mediaList.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
          <ImageIcon size={48} className="mx-auto text-slate-600 mb-3" />
          <p>No media files uploaded yet.</p>
          <p className="text-xs mt-1 text-slate-500">Click "Upload New Image" above to upload photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div key={item._id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md group relative">
              <div className="aspect-square bg-slate-900 overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
                    onClick={() => handleDelete(item._id)}
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
    </div>
  );
};
