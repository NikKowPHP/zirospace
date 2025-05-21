import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { serviceService } from '@/lib/services/service.service' // Import serviceService
import { ServiceMapper } from '@/infrastructure/mappers/service.mapper' // Import ServiceMapper
import logger from '@/lib/logger' // Keep logger for now, might be used later

export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  console.log('Processing service creation', data)
  try {
    console.log('Processing service creation:', {
      locale,
      mappedData: ServiceMapper.toPersistence(data)
    })
    const id = crypto.randomUUID()
    data.id = id;

    const newService = await serviceService.createService(data, locale) // Call createService

    // Revalidate cache
    revalidateTag(CACHE_TAGS.SERVICES) // Use CACHE_TAGS.SERVICES

    return NextResponse.json(newService)
  } catch (error) {
    logger.log('Error creating service:', error) // Update log message
    return NextResponse.json(
      { error: 'Failed to create service', details: error instanceof Error ? error.message : 'Unknown error' }, // Update error message
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const locale = searchParams.get('locale')

    console.log('processing service get request', {id, locale}) // Update log message
    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    logger.log(`Fetching service: ${id} ${locale}`) // Update log message
    const service = await serviceService.getServiceById(id, locale) // Call getServiceById
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 }) // Update error message
    }
    return NextResponse.json(service)
  } catch (error) {
    logger.error(`Error fetching service: ${error}`) // Update log message
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 }) // Update error message
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const locale = searchParams.get('locale')
    const { data } = await request.json()

    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    logger.log(`Updating service: ${id} ${locale} with data: ${JSON.stringify(data)}`) // Update log message
    const updatedService = await serviceService.updateService(id, data, locale) // Call updateService

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 }) // Update error message
    }

    revalidateTag(CACHE_TAGS.SERVICES) // Use CACHE_TAGS.SERVICES
    return NextResponse.json(updatedService)
  } catch (error) {
    logger.error(`Error updating service: ${error}`) // Update log message
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 }) // Update error message
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const locale = searchParams.get('locale')

    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    logger.log(`Deleting service: ${id} for locale: ${locale}`) // Update log message
    const deletedService = await serviceService.deleteService(id, locale) // Call deleteService
    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 }) // Update error message
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.SERVICES) // Use CACHE_TAGS.SERVICES

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`Error deleting service: ${error}`) // Update log message
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 }) // Update error message
  }
}
