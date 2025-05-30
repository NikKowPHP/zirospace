"use client";

'use client'

import { useEffect, useState } from 'react'
import { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'
import ListItemSkeleton from '@/components/ui/skeletons/list-item-skeleton'
import logger from '@/lib/logger'
import useAdminServices from '@/hooks/admin/useAdminServices';

export function ServiceList() {
  const { services, deleteService, error, loading, getServices } = useAdminServices()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()

  // Fetch services when locale changes
  useEffect(() => {
    getServices(activeLocale)
  }, [activeLocale, getServices]) // Added getServices to dependency array

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        logger.log(`Deleting service with id: ${id} and locale  and locale : ${activeLocale}`)
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
            className={`px-6 py-3 rounded-full transition-colors ${activeLocale === 'en'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
              }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveLocale('pl')}
            className={`px-6 py-3 rounded-full transition-colors ${activeLocale === 'pl'
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

      <div className="overflow-hidden bg-white   shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Excerpt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={7}>
                      <ListItemSkeleton />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              services[activeLocale]?.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">/services/{service.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {service.excerpt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {service.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/sections/services/edit/${service.id}?locale=${activeLocale}`
                        )
                      }
                      className="text-primary hover:text-primary/90 disabled:opacity-50"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
