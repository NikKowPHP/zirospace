import { NextRequest, NextResponse } from 'next/server';
import { serviceService } from '@/lib/services/service.service';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';

export async function POST(req: NextRequest) {
  try {
    const service = await req.json();
    const locale = req.headers.get('x-locale') || 'en';
    const createdService = await serviceService.createService(service, locale);
    revalidateTag(CACHE_TAGS.SERVICES);
    return NextResponse.json(createdService, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const locale = req.nextUrl.searchParams.get('locale') || 'en';

    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    }

    const service = await serviceService.getServiceById(id, locale);

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const service = await req.json();
    const locale = req.headers.get('x-locale') || 'en';

    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    }

    const updatedService = await serviceService.updateService(id, service, locale);

    if (!updatedService) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.SERVICES);
    return NextResponse.json(updatedService);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const locale = req.headers.get('x-locale') || 'en';

    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    }

    const deleted = await serviceService.deleteService(id, locale);

    if (!deleted) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.SERVICES);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}