'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button/button'
import {
  CaseStudySlider,
  CaseStudyImage,
} from '@/domain/models/case-study-slider.model'

interface CaseStudySliderFormProps {
  caseStudySlider?: CaseStudySlider
  onSubmit: (data: Partial<CaseStudySlider>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function CaseStudySliderForm({
  caseStudySlider,
  onSubmit,
  onCancel,
  loading,
}: CaseStudySliderFormProps) {
  const [images, setImages] = useState<CaseStudyImage[]>(
    (caseStudySlider?.images || []) as CaseStudyImage[]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ images })
  }

  const handleImageChange = (
    index: number,
    field: keyof CaseStudyImage,
    value: string
  ) => {
    const newImages = [...images]
    newImages[index][field] = value as string & Date
    setImages(newImages)
  }

  const handleAddImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setImages([...images, { id: Date.now().toString(), image: '', alt: '' }])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Images
        </label>
        {images.map((image, index) => (
          <div key={image.id} className="space-y-2 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Image {index + 1}</h4>
              <Button
                variant="secondary"
                onClick={() => handleRemoveImage(index)}
              >
                Remove
              </Button>
            </div>
            <div>
              <label
                htmlFor={`image-${index}-image`}
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="string"
                id={`image-${index}-image`}
                className="mt-1 block w-full   border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={image.image}
                onChange={(e) =>
                  handleImageChange(index, 'image', e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor={`image-${index}-alt`}
                className="block text-sm font-medium text-gray-700"
              >
                Image Alt Text
              </label>
              <input
                type="text"
                id={`image-${index}-alt`}
                className="mt-1 block w-full   border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={image.alt}
                onChange={(e) =>
                  handleImageChange(index, 'alt', e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={handleAddImage}>
          Add Image
        </Button>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {caseStudySlider ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
