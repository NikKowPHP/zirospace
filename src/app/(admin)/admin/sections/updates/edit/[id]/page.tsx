'use client'

import { Locale } from '@/i18n'
import { useAdminUpdates } from '@/hooks/admin/useAdminUpdates'
import { useRouter, useSearchParams } from 'next/navigation'
import UpdateForm from '../../components/update-form'
import { useEffect, useState } from 'react'
import { Update } from '@/domain/models/update.model'
import logger from '@/lib/logger'

interface Props {
  params: { id: string }
}

export default function EditUpdatePage({ params }: Props) {
  const { updateUpdate, loading, getUpdateById } = useAdminUpdates()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') || 'en'
  const [update, setUpdate] = useState<Update | null>(null)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const { id } = params
    if (id) {
      setId(id)
    }

    getUpdateById(id, locale as Locale).then((fetchedUpdate) =>
      setUpdate(fetchedUpdate || null)
    )
  }, [params, locale])

  const handleUpdate = async (data: Partial<Update>) => {
    if (!update) return
    try {
      await updateUpdate(id, data, locale as Locale)
      router.push('/admin/sections/updates')
    } catch (error) {
      logger.log('Failed to update update:', error)
    }
  }

  if (!update && loading) {
    return <div>Loading...</div>
  }
  if (!update) {
    return <div>Update not found</div>
  }

  return (
    <div>
      <h1>Edit Update</h1>
      <UpdateForm
        update={update}
        onSubmit={handleUpdate}
        onCancel={() => router.push('/admin/sections/updates')}
        loading={loading}
      />
    </div>
  )
}
