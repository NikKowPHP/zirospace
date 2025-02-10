'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button/button'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/label/label'
import { Textarea } from '@/components/ui/textarea/textarea'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Locale } from '@/i18n'
import React from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

interface BlogPostFormProps {
  post?: BlogPost
  locale: Locale
  onSubmit: (data: Partial<BlogPost>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function BlogPostForm({
  post,
  locale,
  onSubmit,
  onCancel,
  loading,
}: BlogPostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<BlogPost>>({
    defaultValues: post,
  })
  const [content, setContent] = useState(post?.contentHtml || '')
  const { quill, quillRef } = useQuill({ theme: 'snow' })

  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setContent(quill.root.innerHTML)
      })
      if (post?.contentHtml) {
        quill.clipboard.dangerouslyPasteHTML(post.contentHtml)
      }
    }
  }, [quill, post?.contentHtml])

  const submitHandler = async (data: Partial<BlogPost>) => {
    await onSubmit({ ...data, contentHtml: content })
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
        <Label htmlFor="slug">Slug</Label>
        <Input
          type="text"
          id="slug"
          {...register('slug', { required: 'Slug is required' })}
          className="w-full"
        />
        {errors.slug && (
          <p className="text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="imageurl">Image URL</Label>
        <Input
          type="text"
          id="imageurl"
          {...register('imageurl', { required: 'Image URL is required' })}
          className="w-full"
        />
        {errors.imageurl && (
          <p className="text-red-600">{errors.imageurl.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="imageAlt">Image Alt Text</Label>
        <Input
          type="text"
          id="imageAlt"
          {...register('imageAlt')}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          {...register('excerpt', { required: 'Excerpt is required' })}
          className="w-full"
        />
        {errors.excerpt && (
          <p className="text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contentHtml">Content</Label>
        <div style={{ width: '100%', height: 300 }}>
          <div ref={quillRef} />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
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