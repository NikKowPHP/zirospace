import { AdminProvider } from '@/contexts/admin-context'
import { Suspense } from 'react'
import ListItemSkeleton from '@/components/ui/skeletons/list-item-skeleton'
import { ServiceList } from './service-list'

export default async function ServicesPage() {
  return (
    <AdminProvider>
      <div className="bg-white shadow sm:rounded-lg">
        <Suspense
          fallback={
            <>
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
            </>
          }
        >
          <ServiceList />
        </Suspense>
      </div>
    </AdminProvider>
  )
}
