'use client'

import { Locale } from '@/i18n'
import useAdminServices from '@/hooks/admin/useAdminServices'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceForm } from '../../components/service-form'
import { useEffect, useState } from 'react'
import { Service } from '@/domain/models/models'
import logger from '@/lib/logger'

interface Props {
  params: { id: string }
}

export default function EditServicePage({ params }: Props) {
  const { updateService, loading, getServiceById } = useAdminServices()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = (searchParams.get('locale') || 'en') as Locale
  const [service, setService] = useState<Service | null>(null)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const { id } = params
    if (id) {
      setId(id)
    }

    getServiceById(id, locale).then((service) => setService(service || null))
    logger.log('locale', locale)
  }, [params, getServiceById, locale])

  const isNumber = (value: string | undefined): boolean => {
    return value !== undefined && !isNaN(Number(value))
  }

  const handleUpdate = async (data: Partial<Service>, locale: Locale) => {
    if (!service) return
    if(isNumber(data.order_index))
    try {
      logger.log('Updating service in handleUpdate:', data)
      logger.log('isPublished value in handleUpdate:', data.is_published) // Add logging for isPublished
      await updateService(id, data, locale as Locale)
    } catch (error) {
      logger.log('Failed to update service:', error)
    }
  }

  if (!service && loading) {
    return <div>Loading...</div>
  }
  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <div>
      <h1>Edit Service</h1>
      <ServiceForm
        service={service}
        locale={locale as Locale}
        onSubmit={handleUpdate}
        onCancel={() => router.push('/admin/sections/services')}
        loading={loading}
      />
    </div>
  )
}
