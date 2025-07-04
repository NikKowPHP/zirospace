import { useState, useCallback } from 'react'
import { Locale } from '@/i18n'
import { Update } from '@/domain/models/models'
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
  const {callApi} = useAdminApi()

  const fetchUpdates = useCallback(
    async (locale: Locale) => {
      setLoading(true)
      setError(null)
      try {
        const response = await callApi<Update[]>(
          `/api/admin/updates?locale=${locale}`,
            { method: 'GET', cache: 'no-store' },
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
    [callApi]
  )

  const createUpdate = useCallback(
    async (data: any, locale: Locale) => {
      return toast.promise(
        callApi<Update>(`/api/admin/updates?locale=${locale}`, {
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
    [callApi]
  )

  const updateUpdate = useCallback(
    async (id: string, data: any, locale: Locale) => {
      return toast.promise(
        callApi<Update>(`/api/admin/updates/${id}?locale=${locale}`, {
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
    [callApi]
  )

  const deleteUpdate = useCallback(
    async (id: string, locale: Locale) => {
      return toast.promise(
        callApi<void>(`/api/admin/updates/${id}?locale=${locale}`, {
          method: 'DELETE',
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
    [callApi]
  )

  const getUpdateById = useCallback(
    async (id: string, locale: Locale): Promise<Update | undefined> => {
      return toast.promise(
        callApi<Update>(
          `/api/admin/updates/${id}?locale=${locale}`,
           { method: 'GET', cache: 'no-store' },
        ),
        {
          loading: 'Fetching update...',
          success: () => {
            // No need to update 'updates' state here as it's a single fetch
            return 'Update fetched successfully!'
          },
          error: (error) => `Failed to fetch update: ${error.message}`,
        }
      )
    },
    [callApi]
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
