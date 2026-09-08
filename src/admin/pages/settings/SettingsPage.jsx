import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { FormError } from '../../components/common/FormError';
import { Loader } from '../../components/common/Loader';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

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
        const data = await settingsService.getSettings();
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
        setError(err.message || 'Failed to load site settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      await settingsService.updateSettings(formData);
      showToast('success', 'Site settings saved successfully!');
    } catch (err) {
      setError(err.message || 'Settings update failed');
      showToast('error', err.message || 'Save error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading site settings..." />;
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <PageHeader
        title="Settings"
        description="Global website configuration and contact information."
        icon={SettingsIcon}
      />

      <FormError message={error} />

      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-6 shadow-sm">
        {/* Branding */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Branding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website Name"
              required
              value={formData.websiteName}
              onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
            />
            <Input
              label="Logo Image URL"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <Textarea
            label="Footer Copyright Text"
            rows={2}
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
          />
        </div>

        {/* Contact Info */}
        <div className="pt-4 border-t border-slate-700 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-slate-700 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Social Handles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Twitter / X"
              value={formData.socialLinks.twitter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                })
              }
            />
            <Input
              label="Facebook"
              value={formData.socialLinks.facebook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          <Button type="submit" variant="primary" icon={Save} loading={saving}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
