'use client'

import { useEffect, useState } from 'react'
import { Locale } from '@/i18n'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'
import { useAdminUpdates } from '@/hooks/admin/useAdminUpdates'

interface UpdateListProps {}

const UpdateList: React.FC<UpdateListProps> = () => {
  const { updates, deleteUpdate, error, loading, fetchUpdates } =
    useAdminUpdates()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()

  // Fetch updates when locale changes
  useEffect(() => {
    fetchUpdates(activeLocale)
  }, [activeLocale, fetchUpdates])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      try {
        await deleteUpdate(id, activeLocale)
      } catch (err) {
        logger.error('Failed to delete update:', err)
      }
    }
  }

  const handleLocaleButtonClick = (newLocale: Locale) => {
    setActiveLocale(newLocale)
  }

  const displayedUpdates = updates[activeLocale] || []

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Assuming you have a defined set of locales, e.g., ['en', 'pl'] */}
          {(['en', 'pl'] as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleButtonClick(loc)}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeLocale === loc
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-gray-700 hover:bg-secondary/80'
              }`}
            >
              {loc === 'en' ? 'English' : loc === 'pl' ? 'Polish' : loc}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            router.push(`/admin/sections/updates/create?locale=${activeLocale}`)
          }
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Update
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {' '}
        {/* Added sm:rounded-lg for consistency */}
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
                Publish Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Excerpt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && displayedUpdates.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading updates...
                </td>
              </tr>
            ) : displayedUpdates.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No updates found for {activeLocale.toUpperCase()}.
                </td>
              </tr>
            ) : (
              displayedUpdates.map((update) => (
                <tr key={update.id} className={loading ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {update.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{update.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {update.publish_date
                        ? new Date(update.publish_date).toLocaleDateString(
                            activeLocale,
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )
                        : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {/* Assuming excerpt might be HTML, render it safely or strip tags */}
                    {/* For simplicity, displaying as text with line-clamp */}
                    <div
                      className="text-sm text-gray-500 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: update.excerpt || 'No excerpt',
                      }}
                      // If excerpt is plain text:
                      // title={update.excerpt}
                    >
                      {/* {update.excerpt || 'No excerpt'}  -- if plain text use this instead of dangerouslySetInnerHTML */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        update.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {update.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      href={`/admin/sections/updates/edit/${update.id}?locale=${activeLocale}`}
                      className="text-primary hover:text-primary/90 disabled:opacity-50"
                      aria-disabled={loading}
                      onClick={(e) => loading && e.preventDefault()} // Prevent navigation if loading
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(update.id.toString())}
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

export default UpdateList

