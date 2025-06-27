import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { bannerService } from '@/lib/services/banner.service'
import { BannerList } from './banner-list'
import { Locale } from '@/i18n'

export default async function BannersAdminPage() {
  const [enBanners, plBanners] = await Promise.all([
    bannerService.getBanners('en'),
    bannerService.getBanners('pl'),
  ])

  const initialBanners: Record<Locale, any[]> = {
    en: enBanners,
    pl: plBanners,
  }

  return (
    <AdminProvider initialBanners={initialBanners}>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Banners Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <BannerList initialBanners={initialBanners} />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
