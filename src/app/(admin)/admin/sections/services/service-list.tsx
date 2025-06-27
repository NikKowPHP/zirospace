'use client'

'use client'

import { useEffect, useState } from 'react'
import { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'
import ListItemSkeleton from '@/components/ui/skeletons/list-item-skeleton'
import logger from '@/lib/logger'
import useAdminServices from '@/hooks/admin/useAdminServices'

export function ServiceList() {
  const { services, deleteService, error, loading, getServices } =
    useAdminServices()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()

  // Fetch services when locale changes
  useEffect(() => {
    getServices(activeLocale)
  }, [activeLocale, getServices]) // Added getServices to dependency array

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        logger.log(
          `Deleting service with id: ${id} and locale  and locale : ${activeLocale}`
        )
        await deleteService(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete service:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-600  ">{error}</div>}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
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
        <button
          onClick={() => router.push(`/admin/sections/services/create`)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </>
        ) : (
          services[activeLocale]?.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Slug:</span> {service.slug}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">URL Preview:</span> /services/
                {service.slug}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3">
                <span className="font-medium">Excerpt:</span> {service.excerpt}
              </p>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {service.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    router.push(
                      `/admin/sections/services/edit/${service.id}?locale=${activeLocale}`
                    )
                  }
                  className="text-primary hover:text-primary/90 disabled:opacity-50 font-medium"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50 font-medium"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
