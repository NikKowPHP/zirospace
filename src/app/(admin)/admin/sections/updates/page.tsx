import UpdateList from './update-list'
import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'

export default async function UpdatesAdminPage() {
  return (
    <AdminProvider>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Updates Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <UpdateList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
