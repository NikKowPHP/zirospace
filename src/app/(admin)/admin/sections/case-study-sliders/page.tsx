// import { TestimonialList } from './testimonial-list'
import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { caseStudySliderService } from '@/lib/services/case-study-slider.service'
import { CaseStudySliderList } from './sliders-list'

export default async function CaseStudySlidersAdminPage() {
  const [caseStudySliders] = await Promise.all([
    caseStudySliderService.getCaseStudySliders(),
  ])

  console.log('caseStudySliders in page', caseStudySliders)

  return (
    <AdminProvider initialCaseStudySliders={caseStudySliders}>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Case Study Sliders Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <CaseStudySliderList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
