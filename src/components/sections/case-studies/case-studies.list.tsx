'use client'
import { memo, useMemo } from 'react'
import { CaseStudyCard } from '@/components/ui/case-study/case-study-card'
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'

export const CaseStudyList = memo(function CaseStudyList({
  caseStudies,
  locale,
}: {
  caseStudies: CaseStudy[]
  locale: Locale
}) {
  const sortedStudies = useMemo(() => {
    return [...caseStudies].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    )
  }, [caseStudies])

  return (
    <div className="stacking-scroll">
      {/* The stacking-container adds extra scrollable height */}
      <div className="stacking-container">
        {/* Inner container for centering and spacing */}
        <div className="relative mx-auto flex flex-col gap-16 max-w-5xl">
          {sortedStudies.map((caseStudy, index) => (
            <div
              key={caseStudy.id}
              className="stacking-card sticky top-0"
              style={{
                zIndex: caseStudies.length - index,
                opacity: 1 - index * 0.1,
              }}
            >
              <CaseStudyCard caseStudy={caseStudy} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default CaseStudyList
