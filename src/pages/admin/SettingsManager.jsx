import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Settings as SettingsIcon, Save, CheckCircle } from 'lucide-react';

export const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    websiteName: 'BREAKING HOURS',
    logo: '',
    favicon: '',
    footerText: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await api.getSettings();
        if (data) {
          setFormData({
            websiteName: data.websiteName || 'BREAKING HOURS',
            logo: data.logo || '',
            favicon: data.favicon || '',
            footerText: data.footerText || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            address: data.address || '',
            socialLinks: {
              facebook: data.socialLinks?.facebook || '',
              twitter: data.socialLinks?.twitter || '',
              instagram: data.socialLinks?.instagram || '',
              youtube: data.socialLinks?.youtube || '',
              linkedin: data.socialLinks?.linkedin || '',
            },
          });
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Settings update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-sans">Loading website settings...</div>;
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="flex justify-between items-center bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="text-blue-500" size={24} />
            <span>Global Site Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure branding, contact details, footer text, and social handles.</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs px-3 py-2 rounded-lg font-semibold uppercase">
            <CheckCircle size={16} />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3">
            Branding & Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Website Name</label>
              <input
                type="text"
                required
                value={formData.websiteName}
                onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Logo URL</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://... logo image URL"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Footer Copyright & Disclaimer Text</label>
            <textarea
              rows={3}
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Address / HQ</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3">
            Social Media Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Twitter / X URL</label>
              <input
                type="text"
                value={formData.socialLinks.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Facebook URL</label>
              <input
                type="text"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Instagram URL</label>
              <input
                type="text"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">YouTube URL</label>
              <input
                type="text"
                value={formData.socialLinks.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-colors"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
