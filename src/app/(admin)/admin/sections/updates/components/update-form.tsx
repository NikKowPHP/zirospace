'use client';

import { Locale } from '@/i18n';
import { Update } from '@/domain/models/update.model';
import { useState } from 'react';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Switch } from '@/components/ui/switch/switch';
import { Textarea } from '@/components/ui/textarea/textarea';

interface UpdateFormProps {
  update?: Update;
  locale: Locale;
  onSubmit: (data: Partial<Update>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ update, locale, onSubmit, onCancel, loading }) => {
  const [title, setTitle] = useState(update?.title || '');
  const [slug, setSlug] = useState(update?.slug || '');
  const [publishDate, setPublishDate] = useState(update?.publish_date || new Date());
  const [excerpt, setExcerpt] = useState(update?.excerpt || '');
  const [content, setContent] = useState(update?.content_html || '');
  const [imageUrl, setImageUrl] = useState(update?.image_url || '');
  const [imageAlt, setImageAlt] = useState(update?.image_alt || '');
  const [isPublished, setIsPublished] = useState(update?.is_published || false);
  const [orderIndex, setOrderIndex] = useState(update?.order_index || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug,
      publish_date: publishDate,
      excerpt,
      content_html: content,
      image_url: imageUrl,
      image_alt: imageAlt,
      is_published: isPublished,
      order_index: orderIndex,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="publishDate">Publish Date</Label>
        <Input type="date" id="publishDate" value={publishDate.toISOString().split('T')[0]} onChange={(e) => setPublishDate(new Date(e.target.value))} />
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="content">Content HTML</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="imageAlt">Image Alt</Label>
        <Input type="text" id="imageAlt" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="isPublished">Is Published</Label>
        <Switch id="isPublished" checked={isPublished} onCheckedChange={(checked) => setIsPublished(checked)} />
      </div>
      <div>
        <Label htmlFor="orderIndex">Order Index</Label>
        <Input type="number" id="orderIndex" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      <button type="button" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateForm;