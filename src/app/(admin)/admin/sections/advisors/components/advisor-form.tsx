'use client'

import { useState } from 'react'
import { Advisor } from '@/domain/models/models'
import { Button } from '@/components/ui/button/button'

interface AdvisorFormProps {
  advisor?: Advisor
  onSubmit: (data: Partial<Advisor>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function AdvisorForm({
  advisor,
  onSubmit,
  onCancel,
  loading,
}: AdvisorFormProps) {
  const [name, setName] = useState(advisor?.name || '')
  const [role, setRole] = useState(advisor?.role || '')
  const [expertise, setExpertise] = useState(advisor?.expertise || '')
  const [imageUrl, setImageUrl] = useState(advisor?.image_url || '')
  const [imageAlt, setImageAlt] = useState(advisor?.image_alt || '')
  const [linkedinUrl, setLinkedinUrl] = useState(advisor?.linkedin_url || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name,
      role,
      expertise,
      image_url: imageUrl,
      image_alt: imageAlt,
      linkedin_url: linkedinUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <input
          type="text"
          id="role"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="expertise"
          className="block text-sm font-medium text-gray-700"
        >
          Expertise
        </label>
        <input
          type="text"
          id="expertise"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="text"
          id="image_url"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="image_alt"
          className="block text-sm font-medium text-gray-700"
        >
          Image Alt Text
        </label>
        <input
          type="text"
          id="image_alt"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="linkedin_url"
          className="block text-sm font-medium text-gray-700"
        >
          LinkedIn URL
        </label>
        <input
          type="text"
          id="linkedin_url"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {advisor ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}