import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { bannerService } from '@/lib/services/banner.service'
import { BannerList } from './banner-list'

export default async function BannersAdminPage() {
  const [enBanners, plBanners] = await Promise.all([
    bannerService.getBanners('en'),
    bannerService.getBanners('pl')
  ])

  return (
    <AdminProvider initialBanners={{ en: enBanners, pl: plBanners }}>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Banners Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <BannerList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}