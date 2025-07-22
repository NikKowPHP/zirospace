
import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { AdvisorList } from './advisors-list'

export default async function AdvisorsAdminPage() {
  return (
    <AdminProvider>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Advisors Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <AdvisorList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}