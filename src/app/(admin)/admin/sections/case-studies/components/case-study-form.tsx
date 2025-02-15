'use client'

import { CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'
import { useState, useEffect } from 'react'

interface CaseStudyFormProps {
  study?: CaseStudy
  locale: Locale
  onSubmit: (data: Partial<CaseStudy>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

interface ImageInput {
  url: string
  alt: string
}

const isGoogleDriveLink = (url: string): boolean => {
  return url.includes('drive.google.com') || url.includes('googleusercontent.com')
}

const getGoogleDriveDirectLink = (url: string): string | null => {
  try {
    const fileId = url.match(/\/d\/(.+?)\/|id=(.+?)&/)?.[1] || url.match(/id=(.+?)&/)?.[1]
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    return null
  } catch {
    return null
  }
}

interface ImagePreviewProps {
  url: string
  alt: string
  onError: () => void
}

const ImagePreview = ({ url, alt, onError }: ImagePreviewProps) => {
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    const img = document.createElement('img')
    img.onload = () => setShowImage(true)
    img.onerror = onError
    img.src = url
    
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [url, onError])

  if (!showImage) {
    return (
      <div className="relative mt-2 h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    )
  }

  return (
    <div className="relative mt-2 h-20 w-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt || 'Preview'}
        className="object-cover rounded-md h-full w-full"
        onError={onError}
      />
    </div>
  )
}

export function CaseStudyForm({
  study,
  locale,
  onSubmit,
  onCancel,
  loading,
}: CaseStudyFormProps) {
  const [images, setImages] = useState<ImageInput[]>(
    study?.images.map((img) => ({ url: img.url, alt: img.alt })) || [
      { url: '', alt: '' },
    ]
  )
  const [tags, setTags] = useState<readonly string[]>(study?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [title, setTitle] = useState(study?.title || '')
  const [slug, setSlug] = useState(study?.slug || '')
  const [imageErrors, setImageErrors] = useState<Record<number, string | null>>({})

  const [theme, setTheme] = useState<CaseStudy['theme']>(study?.theme || 'dark')
  const [backgroundColor, setBackgroundColor] = useState(study?.backgroundColor || '#FFFFFF')
  const [color, setColor] = useState(study?.color || '#000000')
  const [subtitle, setSubtitle] = useState(study?.subtitle || '')
  const [ctaUrl, setCtaUrl] = useState(study?.ctaUrl || '')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
  }

  const handleAddImage = () => {
    setImages([...images, { url: '', alt: '' }])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImageErrors(prev => ({ ...prev, [index]: null }))
  }

  const handleImageChange = (
    index: number,
    field: keyof ImageInput,
    value: string
  ) => {
    if (field === 'url') {
      setImageErrors(prev => ({ ...prev, [index]: null }))
      
      if (isGoogleDriveLink(value)) {
        const directLink = getGoogleDriveDirectLink(value)
        if (!directLink) {
          setImageErrors(prev => ({
            ...prev,
            [index]: 'Invalid Google Drive link format. Please use a direct image link.'
          }))
        }
        // Always update the URL, even if invalid
        setImages(images.map((img, i) => 
          i === index ? { ...img, url: value } : img
        ))
      } else {
        setImages(images.map((img, i) => 
          i === index ? { ...img, url: value } : img
        ))
      }
    } else {
      setImages(images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      ))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await onSubmit({
      id: study?.id || '',
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      tags: tags,
      images: images.filter((img) => img.url && img.alt),
      ctaUrl: ctaUrl,
      theme: theme,
      backgroundColor: backgroundColor,
      color: color,
      subtitle: subtitle,
    })
  }

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: 'Failed to load image. Please check the URL or try a different link format.'
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title ({locale}) *
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="subtitle"
          className="block text-sm font-medium text-gray-700"
        >
          Subtitle ({locale})
        </label>
        <input
          type="text"
          name="subtitle"
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          URL Slug *
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            {`/${locale}/case-studies/`}
          </span>
          <input
            type="text"
            name="slug"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            title="Only lowercase letters, numbers, and hyphens are allowed"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          This will be the URL of your case study. Use only lowercase letters, numbers, and hyphens.
        </p>
      </div>

      <div className={`space-y-8 ${!title.trim() ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            defaultValue={study?.description}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          {images.map((image, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={image.url}
                  onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  placeholder="Image URL (direct link recommended)"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {image.url && !imageErrors[index] && (
                  <ImagePreview
                    url={image.url}
                    alt={image.alt}
                    onError={() => handleImageError(index)}
                  />
                )}
                {imageErrors[index] && (
                  <div className="mt-2 text-sm text-red-600">
                    <p>{imageErrors[index]}</p>
                    {isGoogleDriveLink(image.url) && (
                      <p className="mt-1">
                        For Google Drive images: 
                        <ol className="list-decimal ml-4 mt-1">
                          <li>Open the image in Google Drive</li>
                          <li>Click &ldquo;Share&rdquo; and make it accessible to anyone with the link</li>
                          <li>Try using a direct image hosting service instead</li>
                        </ol>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  placeholder="Alt text"
                  required={!!image.url}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-600 hover:text-red-900"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddImage}
            className="text-sm text-primary hover:text-primary/90"
          >
            + Add Image
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-primary hover:text-primary/90"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), handleAddTag())
              }
              placeholder="Add a tag"
              className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-full hover:bg-primary/10 transition-colors"
            >
              Add Tag
            </button>
          </div>
        </div>


        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-gray-700"
          >
            Theme
          </label>
          <select
            name="theme"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value )}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="backgroundColor"
            className="block text-sm font-medium text-gray-700"
          >
            Background Color
          </label>
          <input
            type="color"
            name="backgroundColor"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <input
            type="color"
            name="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="ctaUrl"
            className="block text-sm font-medium text-gray-700"
          >
            CTA URL
          </label>
          <input
            type="text"
            name="ctaUrl"
            id="ctaUrl"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
          disabled={loading || !title.trim()}
        >
          {loading ? 'Saving...' : study ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
