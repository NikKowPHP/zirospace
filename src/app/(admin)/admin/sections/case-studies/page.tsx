import { CaseStudyList } from './case-study-list'
import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { caseStudyService } from '@/lib/services/case-study.service'

export default async function CaseStudiesAdminPage() {
  const [enCaseStudies, plCaseStudies] = await Promise.all([
    caseStudyService.getCaseStudies('en'),
    caseStudyService.getCaseStudies('pl')
  ])

  return (
    <AdminProvider initialCaseStudies={{ en: enCaseStudies, pl: plCaseStudies }}>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Case Studies Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <CaseStudyList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
