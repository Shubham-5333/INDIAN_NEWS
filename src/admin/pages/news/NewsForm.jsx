import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Select } from '../../components/common/Select';
import { ImageUploader } from '../../components/common/ImageUploader';
import { RichTextEditor } from '../../components/common/RichTextEditor';
import { Button } from '../../components/common/Button';
import { FormError } from '../../components/common/FormError';
import { Loader } from '../../components/common/Loader';
import { Newspaper, Save, Send, ArrowLeft } from 'lucide-react';

export const NewsForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'General',
    featuredImage: '',
    status: 'published',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    const initForm = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats || []);

        if (isEdit) {
          const article = await newsService.getBySlug(id);
          setFormData({
            title: article.title || '',
            slug: article.slug || '',
            summary: article.summary || '',
            content: Array.isArray(article.content) ? article.content.join('\n\n') : article.content || '',
            category: article.category || (cats[0]?.name || 'General'),
            featuredImage: article.featuredImage || '',
            status: article.status || 'published',
            seoTitle: article.seoTitle || article.title || '',
            seoDescription: article.seoDescription || article.summary || '',
          });
        } else if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, category: cats[0].name }));
        }
      } catch (err) {
        setError(err.message || 'Failed to load article data');
      } finally {
        setLoading(false);
      }
    };

    initForm();
  }, [id, isEdit]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isEdit ? title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : prev.slug,
      seoTitle: !isEdit ? title : prev.seoTitle,
    }));
  };

  const handleSubmit = async (e, forceStatus) => {
    if (e) e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!formData.summary.trim()) {
      setError('Article summary is required.');
      return;
    }
    if (!formData.content.trim()) {
      setError('Article content body is required.');
      return;
    }

    try {
      setSaving(true);
      const submitStatus = forceStatus || formData.status;

      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        featuredImage: formData.featuredImage,
        status: submitStatus,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.summary,
      };

      if (isEdit) {
        await newsService.update(id, payload);
        showToast('success', 'News article updated successfully!');
      } else {
        await newsService.create(payload);
        showToast('success', 'News article created successfully!');
      }

      navigate('/admin/news');
    } catch (err) {
      setError(err.message || 'Failed to save news article');
      showToast('error', err.message || 'Save error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading article editor..." />;
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <PageHeader
        title={isEdit ? 'Edit News Article' : 'Create New Article'}
        description="Simple and clean CMS editor for news articles."
        icon={Newspaper}
        actions={
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/admin/news')}>
            Back to Articles
          </Button>
        }
      />

      <FormError message={error} />

      {/* Single clean form layout */}
      <form onSubmit={(e) => handleSubmit(e, formData.status)} className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-5 shadow-sm">
        <Input
          label="Title"
          required
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="Article headline..."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="article-url-slug"
            helperText="URL identifier"
          />

          <Select
            label="Category"
            required
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
          label="Summary"
          required
          rows={2}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value, seoDescription: formData.seoDescription || e.target.value })}
          placeholder="Short overview..."
        />

        <RichTextEditor
          label="Content"
          required
          value={formData.content}
          onChange={(val) => setFormData({ ...formData, content: val })}
        />

        <ImageUploader
          label="Featured Image"
          value={formData.featuredImage}
          onChange={(url) => setFormData({ ...formData, featuredImage: url })}
        />

        <div className="pt-2 border-t border-slate-700/80 space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider">SEO Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SEO Title"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="SEO Title Tag..."
            />
            <Textarea
              label="SEO Description"
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="SEO Meta Description..."
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-700">
          <Button variant="secondary" onClick={() => navigate('/admin/news')} disabled={saving}>
            Cancel
          </Button>

          <Button
            type="button"
            variant="outline"
            icon={Save}
            loading={saving}
            onClick={(e) => handleSubmit(e, 'draft')}
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Send}
            loading={saving}
            onClick={(e) => handleSubmit(e, 'published')}
          >
            {isEdit ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};
