'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Update } from '@/domain/models/update.model'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/label/label'
import { Switch } from '@/components/ui/switch/switch'
// Assuming Textarea is not needed anymore for content/excerpt
// import { Textarea } from '@/components/ui/textarea/textarea';
import { Button } from '@/components/ui/button/button'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css' // Import Quill styles

interface UpdateFormProps {
  update?: Update
  onSubmit: (data: Partial<Update>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

// Helper to format date for input type="date"
const formatDateForInput = (date?: Date | string): string => {
  if (!date) return new Date().toISOString().split('T')[0]
  return new Date(date).toISOString().split('T')[0]
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  update,
  onSubmit,
  onCancel,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Partial<
      Omit<Update, 'content_html' | 'excerpt' | 'publish_date' | 'is_published'>
    >
  >({
    defaultValues: {
      title: update?.title || '',
      slug: update?.slug || '',
      image_url: update?.image_url || '',
      image_alt: update?.image_alt || '',
      order_index: update?.order_index || 0,
      // publish_date is handled separately due to Date object vs string
      // is_published is handled by its own useState
    },
  })

  // State for Quill-controlled fields
  const [contentHtml, setContentHtml] = useState(update?.content_html || '')
  const [excerpt, setExcerpt] = useState(update?.excerpt || '')

  // State for fields not easily managed by react-hook-form's register (like custom Switch or Date)
  const [publishDate, setPublishDate] = useState(
    update?.publish_date ? new Date(update.publish_date) : new Date()
  )
  const [isPublished, setIsPublished] = useState(
    Boolean(update?.is_published) || false
  )

  // Quill instances
  const { quill: quillContent, quillRef: quillRefContent } = useQuill({
    theme: 'snow',
  })
  const { quill: quillExcerpt, quillRef: quillRefExcerpt } = useQuill({
    theme: 'snow',
  })

  // Effect for Content Quill editor
  useEffect(() => {
    if (quillContent) {
      // Load initial content
      if (
        update?.content_html &&
        quillContent.root.innerHTML !== update.content_html
      ) {
        quillContent.clipboard.dangerouslyPasteHTML(update.content_html)
      } else if (
        !update?.content_html &&
        quillContent.root.innerHTML !== '<p><br></p>'
      ) {
        quillContent.setText('') // Clear if no initial content
      }
      // Listen for changes
      quillContent.on('text-change', (_delta, _oldDelta, source) => {
        if (source === 'user') {
          setContentHtml(quillContent.root.innerHTML)
        }
      })
    }
  }, [quillContent, update?.content_html])

  // Effect for Excerpt Quill editor
  useEffect(() => {
    if (quillExcerpt) {
      // Load initial content
      if (update?.excerpt && quillExcerpt.root.innerHTML !== update.excerpt) {
        quillExcerpt.clipboard.dangerouslyPasteHTML(update.excerpt)
      } else if (
        !update?.excerpt &&
        quillExcerpt.root.innerHTML !== '<p><br></p>'
      ) {
        quillExcerpt.setText('') // Clear if no initial content
      }
      // Listen for changes
      quillExcerpt.on('text-change', (_delta, _oldDelta, source) => {
        if (source === 'user') {
          setExcerpt(quillExcerpt.root.innerHTML)
        }
      })
    }
  }, [quillExcerpt, update?.excerpt])

  const handleFormSubmit = async (
    data: Partial<
      Omit<Update, 'content_html' | 'excerpt' | 'publish_date' | 'is_published'>
    >
  ) => {
    await onSubmit({
      ...data,
      publish_date: publishDate, // ensure this is a Date object if your model expects it
      excerpt: excerpt,
      content_html: contentHtml,
      is_published: isPublished,
      order_index: Number(data.order_index), // Ensure order_index is a number
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          type="text"
          id="slug"
          {...register('slug', { required: 'Slug is required' })}
          className="w-full"
        />
        {errors.slug && (
          <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="publishDate">Publish Date</Label>
        <Input
          type="date"
          id="publishDate"
          value={formatDateForInput(publishDate)}
          onChange={(e) => setPublishDate(new Date(e.target.value))}
          className="w-full"
        />
        {/* Add error handling for publishDate if needed */}
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <div
          style={{
            width: '100%',
            height: 150,
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <div ref={quillRefExcerpt} style={{ height: '100%' }} />
        </div>
        {/* You can add validation for excerpt if needed, though it's not directly part of RHF here */}
      </div>

      <div className="pt-10">
        {' '}
        {/* Added some padding top to separate from excerpt */}
        <Label htmlFor="content_html">Content HTML</Label>
        <div
          style={{
            width: '100%',
            height: 400,
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <div ref={quillRefContent} style={{ height: '100%' }} />
        </div>
        {/* You can add validation for contentHtml if needed */}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          {...register('image_url')} // Optional, so no required rule
          className="w-full"
        />
        {errors.image_url && (
          <p className="text-red-500 text-sm mt-1">
            {errors.image_url.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="imageAlt">Image Alt Text</Label>
        <Input
          type="text"
          id="imageAlt"
          {...register('image_alt')} // Optional
          className="w-full"
        />
        {errors.image_alt && (
          <p className="text-red-500 text-sm mt-1">
            {errors.image_alt.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          Is Published
        </Label>
      </div>

      <div>
        <Label htmlFor="orderIndex">Order Index</Label>
        <Input
          type="number"
          id="orderIndex"
          {...register('order_index', {
            valueAsNumber: true,
            min: { value: 0, message: 'Order index cannot be negative' },
          })}
          className="w-full"
        />
        {errors.order_index && (
          <p className="text-red-500 text-sm mt-1">
            {errors.order_index.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-8 space-x-3">
        {' '}
        {/* Reduced pt from 20, added space-x */}
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Update'}
        </Button>
      </div>
    </form>
  )
}

export default UpdateForm
