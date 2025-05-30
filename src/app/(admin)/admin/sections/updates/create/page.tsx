'use client'

import { useState } from 'react'
import { Locale } from '@/i18n'
import { useAdminUpdates } from '@/hooks/admin/useAdminUpdates'
import UpdateForm from '../components/update-form'
import { useRouter } from 'next/navigation'

const CreateUpdatePage = () => {
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const { createUpdate, loading } = useAdminUpdates()
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    await createUpdate(data, activeLocale)
    router.push('/admin/sections/updates')
  }

  const handleCancel = () => {
    router.push('/admin/sections/updates')
  }

  return (
    <div>
      <h1>Create New Update</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveLocale('en')}
          className={`px-6 py-3 rounded-full transition-colors ${
            activeLocale === 'en'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setActiveLocale('pl')}
          className={`px-6 py-3 rounded-full transition-colors ${
            activeLocale === 'pl'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
          }`}
        >
          Polish
        </button>
      </div>
      <UpdateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default CreateUpdatePage

