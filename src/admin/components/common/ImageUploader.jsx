import React, { useState } from 'react';
import { mediaService } from '../../services/mediaService';
import { formatImageUrl } from '../../../api/client';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';

export const ImageUploader = ({ value, onChange, label = 'Featured Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    try {
      setUploading(true);
      const res = await mediaService.upload(file);
      const imageUrl = res.url || (res.images && res.images[0]) || (res.data && res.data.url);
      if (imageUrl) {
        onChange(imageUrl);
      }
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 font-sans">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>

      <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
        {/* Direct URL input */}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL or upload image file..."
          className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
        />

        {/* Upload button & drop zone */}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors">
            <Upload size={14} />
            <span>{uploading ? 'Uploading...' : 'Choose Image File'}</span>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-red-400 hover:text-red-300 underline font-semibold"
            >
              Clear Image
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Image Preview Box */}
        {value && (
          <div className="relative mt-2 rounded-lg overflow-hidden border border-slate-700 max-h-48 bg-slate-950 flex items-center justify-center">
            <img src={formatImageUrl(value)} alt="Preview" className="max-h-48 object-contain w-full" />
          </div>
        )}
      </div>
    </div>
  );
};
