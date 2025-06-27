// import { TestimonialList } from './testimonial-list'
import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { CaseStudySliderList } from './sliders-list'

export default async function CaseStudySlidersAdminPage() {
  return (
    <AdminProvider>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">
            Case Study Sliders Management
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <CaseStudySliderList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
