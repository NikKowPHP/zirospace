'use client'

import { CaseStudy, CaseStudyImage } from '@/domain/models/models'
import { Locale } from '@/i18n'
import { useState, useEffect } from 'react'

interface CaseStudyFormProps {
  study?: CaseStudy
  locale: Locale
  // Update onSubmit prop to expect data matching CaseStudyCreateInput or CaseStudyUpdateInput structure
  onCancel: () => void
  loading: boolean

  onSubmit: (data: Partial<CaseStudy>) => Promise<void>
}

// Match the structure expected by CaseStudyImageCreateInput



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
  // Initialize images state correctly using 'image' field
  const [images, setImages] = useState<CaseStudyImage[]>(
    study?.images.map((img) => ({ image: img.image, alt: img.alt })) || [
      { image: '', alt: '' }, // Default empty image input
    ]
  )
  // Initialize tags state using tag names from the study object
  const [tags, setTags] = useState<readonly string[]>(study?.tags.map(t => t.name).filter(Boolean) as string[] || [])
  const [tagInput, setTagInput] = useState('')
  const [title, setTitle] = useState(study?.title || '')
  const [slug, setSlug] = useState(study?.slug || '')
  const [imageErrors, setImageErrors] = useState<Record<number, string | null>>({})

  const [theme, setTheme] = useState<CaseStudy['theme']>(study?.theme || 'dark')
  const [backgroundColor, setBackgroundColor] = useState(study?.background_color || '#FFFFFF')
  const [color, setColor] = useState(study?.color || '#000000')
  const [subtitle, setSubtitle] = useState(study?.subtitle || '')
  const [ctaUrl, setCtaUrl] = useState(study?.cta_url || '')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
  }

  const handleAddImage = () => {
    setImages([...images, { image: '', alt: '' }])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImageErrors(prev => ({ ...prev, [index]: null }))
  }

  const handleImageChange = (
    index: number,
    field: keyof ImageInput, // Use keyof for type safety
    value: string
  ) => {
    // Update the correct image object in the array
    setImages(images.map((img, i) =>
      i === index ? { ...img, [field]: value } : img
    ));
    // Clear error for this index if user modifies the input
    if (imageErrors[index]) {
      setImageErrors(prev => ({ ...prev, [index]: null }));
    }
  };

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


    // Construct the data object as Partial<CaseStudy>
    const submitData: Partial<CaseStudy> = {
      // Include id only if 'study' exists (i.e., we are updating)
      ...(study?.id && { id: study.id }),
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      subtitle: subtitle,
      description: formData.get('description') as string,
      // Ensure 'images' structure matches CaseStudyImage[] for Partial<CaseStudy>
      // Note: The repository/service layer handles converting this if needed
      images: images
        .filter((img) => img.image && img.alt)
        .map(img => ({
          // Map back to the structure expected by CaseStudy model if necessary,
          // assuming ImageInput is compatible or needs mapping.
          // If CaseStudyImage requires more fields (like id, caseStudyId),
          // they should be handled during the actual DB operation, not here.
          id: '', // Placeholder or fetch existing image ID if updating images
          image: img.image,
          alt: img.alt,
          created_at: new Date(), // Placeholder
          updated_at: new Date(), // Placeholder
          caseStudyId: study?.id || '' // Placeholder
        })),
      // Map tags back to CaseStudyTag[] structure if needed
      tags: tags.map(tagName => ({
        id: '', // Placeholder or fetch existing tag ID
        name: tagName,
        image_url: null, // Placeholder
        created_at: new Date(), // Placeholder
        updated_at: new Date() // Placeholder
      })),
      cta_text_name: formData.get('cta_text_name') as string || study?.cta_text_name || 'View Case Study', // Get from form if added, else default
      cta_url: ctaUrl,
      theme: theme,
      background_color: backgroundColor,
      color: color,
      order_index: study?.order_index ?? 0,
      // locale is typically handled by the service/action, not passed in data
    };

    await onSubmit(submitData);

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
                  value={image.image}
                  onChange={(e) => handleImageChange(index, 'image', e.target.value)}
                  placeholder="Image URL (direct link recommended)"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {image.image && !imageErrors[index] && (
                  <ImagePreview
                    url={image.image}
                    alt={image.alt}
                    onError={() => handleImageError(index)}
                  />
                )}
                {imageErrors[index] && (
                  <div className="mt-2 text-sm text-red-600">
                    <p>{imageErrors[index]}</p>
                    {isGoogleDriveLink(image.image) && (
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
                  required={!!image.image}
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
              onKeyDown={(e) =>
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
            onChange={(e) => setTheme(e.target.value)}
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
