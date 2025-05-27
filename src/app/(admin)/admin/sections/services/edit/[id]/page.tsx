'use client'

import { Locale } from '@/i18n'
import useAdminServices from '@/hooks/admin/useAdminServices'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceForm } from '../../components/service-form'
import { useEffect, useState } from 'react'
import { Service } from '@/domain/models/service.model'
import logger from '@/lib/logger'

interface Props {
  params: { id: string }
}

export default function EditServicePage({ params }: Props) {
  const { updateService, loading, getServiceById } = useAdminServices()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') || 'en';
  const [service, setService] = useState<Service | null>(null);
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const { id } = params
    if (id) {
      setId(id)
    }

    getServiceById(id, locale as Locale).then(service => setService(service || null))
  }, [params, getServiceById, locale])

  const handleUpdate = async (data: Partial<Service>) => {
    if (!service) return;
    try {
      logger.log('Updating service in handleUpdate:', data);
      logger.log('isPublished value in handleUpdate:', data.isPublished); // Add logging for isPublished
      await updateService(id, data, locale as Locale)
      router.push('/admin/sections/services')
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
