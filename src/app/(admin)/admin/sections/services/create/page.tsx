'use client'

import { Locale } from '@/i18n'
import useAdminServices from '@/hooks/admin/useAdminServices'
import { useRouter } from 'next/navigation'
import { ServiceForm } from '../components/service-form'
import { useState } from 'react'
import { Service } from '@/domain/models/models'
import logger from '@/lib/logger'

export default function NewServicePage() {
  const { createService, loading } = useAdminServices()
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')

  const handleCreate = async (data: Partial<Service>) => {
    try {
      logger.log('handleCreate', data)
      await createService(data, activeLocale)
      router.push('/admin/sections/services')
    } catch (error) {
      logger.log('Failed to create service:', error)
    }
  }

  return (
    <div>
      <h1>New Service</h1>

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

      <ServiceForm
        locale={activeLocale}
        onSubmit={handleCreate}
        onCancel={() => router.push('/admin/sections/services')}
        loading={loading}
      />
    </div>
  )
}
