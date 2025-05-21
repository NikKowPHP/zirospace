'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button/button'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/label/label'
import { Service } from '@/domain/models/service.model'
import { Locale } from '@/i18n'
import React from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import { Textarea } from '@/components/ui/textarea/textarea'
import { Switch } from '@/components/ui/switch/switch'

interface ServiceFormProps {
  service?: Service
  locale: Locale
  onSubmit: (data: Partial<Service>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function ServiceForm({
  service,
  onSubmit,
  onCancel,
  loading,
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm<Partial<Service>>({
    defaultValues: {
      ...service,
      orderIndex: service?.orderIndex ?? 0,
      isPublished: service?.isPublished ?? true,
    },
  });
  const [content, setContent] = useState(service?.contentHtml || '');
  const [excerpt, setExcerpt] = useState(service?.excerpt || '');
  const [keywords, setKeywords] = useState(service?.keywords?.join(', ') || '')
  const { quill: quillContent, quillRef: quillRefContent } = useQuill({ theme: 'snow' })
  const { quill: quillExcerpt, quillRef: quillRefExcerpt } = useQuill({ theme: 'snow' })

  React.useEffect(() => {
    if (quillContent) {
      quillContent.on('text-change', () => {
        setContent(quillContent.root.innerHTML)
      })
      if (service?.contentHtml) {
        quillContent.clipboard.dangerouslyPasteHTML(service.contentHtml)
      }
    }
  }, [quillContent, service?.contentHtml])

  React.useEffect(() => {
    if (quillExcerpt) {
      quillExcerpt.on('text-change', () => {
        setExcerpt(quillExcerpt.root.innerHTML)
      })
      if (service?.excerpt) {
        quillExcerpt.clipboard.dangerouslyPasteHTML(service.excerpt)
      }
    }
  }, [quillExcerpt, service?.excerpt])

  const submitHandler = async (data: Partial<Service>) => {
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k !== '');
    await onSubmit({ ...data, contentHtml: content, excerpt: excerpt, keywords: keywordsArray });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          type="text"
          id="subtitle"
          {...register('subtitle')}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          type="text"
          id="slug"
          {...register('slug', {
            required: 'Slug is required',
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: 'Slug must contain only lowercase letters, numbers, and hyphens'
            }
          })}
          className="w-full"
        />
        {errors.slug && (
          <p className="text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          {...register('imageUrl', {
            onChange: (e) => {
              if (e.target.value && !getValues('imageAlt')) {
                setValue('imageAlt', '');
                trigger('imageAlt');
              }
            },
          })}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="imageAlt">Image Alt Text</Label>
        <Input
          type="text"
          id="imageAlt"
          {...register('imageAlt', {
            required: getValues('imageUrl') ? 'Image Alt Text is required when Image URL is present' : false,
          })}
          className="w-full"
        />
        {errors.imageAlt && (
          <p className="text-red-600">{errors.imageAlt.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input
          type="text"
          id="metaTitle"
          {...register('metaTitle')}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          {...register('metaDescription')}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
        <Input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="orderIndex">Order Index</Label>
        <Input
          type="number"
          id="orderIndex"
          {...register('orderIndex')}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="isPublished">Published</Label>
        <Switch
          id="isPublished"
          {...register('isPublished')}
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <div style={{ width: '100%', height: 100 }}>
          <div ref={quillRefExcerpt} />
        </div>
        {errors.excerpt && (
          <p className="text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="pt-20">
        <Label htmlFor="contentHtml">Content</Label>
        <div style={{ width: '100%', height: 500 }}>
          <div ref={quillRefContent} />
        </div>
      </div>

      <div className="flex justify-end pt-20">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
