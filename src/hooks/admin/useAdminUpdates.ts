import { useState, useCallback } from 'react'
import { Locale } from '@/i18n'
import { Update } from '@/domain/models/update.model'
import useAdminApi from './useAdminApi'
import { toast } from 'react-hot-toast'

type Record<K extends keyof any, T> = {
  [P in K]: T
}

interface UseAdminUpdates {
  updates: Record<Locale, Update[]>
  loading: boolean
  error: string | null
  fetchUpdates: (locale: Locale) => Promise<void>
  createUpdate: (data: any, locale: Locale) => Promise<Update>
  updateUpdate: (id: string, data: any, locale: Locale) => Promise<Update>
  deleteUpdate: (id: string, locale: Locale) => Promise<void>
  getUpdateById: (id: string, locale: Locale) => Promise<Update | undefined>
}

export const useAdminUpdates = (
  initialUpdates?: Record<Locale, Update[]>
): UseAdminUpdates => {
  const [updates, setUpdates] = useState<Record<Locale, Update[]>>(
    initialUpdates || ({} as Record<Locale, Update[]>)
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const adminApi = useAdminApi()

  const fetchUpdates = useCallback(
    async (locale: Locale) => {
      setLoading(true)
      setError(null)
      try {
        const response = await adminApi.callApi<Update[]>(
          `/api/admin/updates?locale=${locale}`,
          {}
        )
        setUpdates((prevUpdates) => {
          // Only update if the data has actually changed to prevent infinite re-renders
          if (
            JSON.stringify(prevUpdates[locale]) === JSON.stringify(response)
          ) {
            return prevUpdates
          }
          return { ...prevUpdates, [locale]: response }
        })
      } catch (e: any) {
        setError(e.message || 'Failed to fetch updates')
      } finally {
        setLoading(false)
      }
    },
    [adminApi, setUpdates, setError, setLoading]
  )

  const createUpdate = useCallback(
    async (data: any, locale: Locale) => {
      return toast.promise(
        adminApi.callApi<Update>('/api/admin/updates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
        {
          loading: 'Creating update...',
          success: (newUpdate) => {
            setUpdates((prevUpdates) => {
              const currentUpdates = prevUpdates[locale] || []
              return {
                ...prevUpdates,
                [locale]: [...currentUpdates, newUpdate],
              }
            })
            return 'Update created!'
          },
          error: (error) => `Failed to create update: ${error.message}`,
        }
      )
    },
    [adminApi, setUpdates]
  )

  const updateUpdate = useCallback(
    async (id: string, data: any, locale: Locale) => {
      return toast.promise(
        adminApi.callApi<Update>(`/api/admin/updates/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
        {
          loading: 'Updating update...',
          success: (updatedUpdate) => {
            setUpdates((prevUpdates) => {
              const currentUpdates = prevUpdates[locale] || []
              const updatedUpdates = currentUpdates.map((update) =>
                update.id === id ? updatedUpdate : update
              )
              return { ...prevUpdates, [locale]: updatedUpdates }
            })
            return 'Update updated!'
          },
          error: (error) => `Failed to update update: ${error.message}`,
        }
      )
    },
    [adminApi, setUpdates]
  )

  const deleteUpdate = useCallback(
    async (id: string, locale: Locale) => {
      return toast.promise(
        adminApi.callApi<void>(`/api/admin/updates/${id}?locale=${locale}`, {
          method: 'DELETE',
          // body: JSON.stringify({locale}),
        }),
        {
          loading: 'Deleting update...',
          success: () => {
            setUpdates((prevUpdates) => {
              const currentUpdates = prevUpdates[locale] || []
              const updatedUpdates = currentUpdates.filter(
                (update) => update.id !== id
              )
              return { ...prevUpdates, [locale]: updatedUpdates }
            })
            return 'Update deleted!'
          },
          error: (error) => `Failed to delete update: ${error.message}`,
        }
      )
    },
    [adminApi, setUpdates]
  )

  const getUpdateById = useCallback(
    async (id: string, locale: Locale): Promise<Update | undefined> => {
      const currentUpdates = updates[locale] || []

      return currentUpdates.find((update) => update.id === id)
    },
    [updates]
  )

  return {
    updates,
    loading,
    error,
    fetchUpdates,
    createUpdate,
    updateUpdate,
    deleteUpdate,
    getUpdateById,
  }
}
