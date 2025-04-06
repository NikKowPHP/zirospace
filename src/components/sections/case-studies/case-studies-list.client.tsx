'use client'
import {  memo, useMemo, useRef } from 'react';
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { CaseStudyCard } from '@/components/ui/case-study/case-study-card';






export const CaseStudyList = memo(function CaseStudyList({
  caseStudies,
  locale
}: {
  caseStudies: CaseStudy[]
  locale: Locale
}) {
  const sortedStudies = useMemo(() => {
    return [...caseStudies].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
  }, [caseStudies])

  const targetRef = useRef(null)
  const { scrollY } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  useMotionValueEvent(scrollY, 'change', () => {
    console.log('scrollY', scrollY.get())
  })

  console.log('scrollY', scrollY)
  return (
    <div ref={targetRef} className="mx-auto flex flex-col gap-[200px] max-w-5xl">
      {sortedStudies.map((caseStudy, index) => (
        <div className="sticky top-[300px] flex items-center justify-center"   key={caseStudy.id ?? index} 
          style={{
            zIndex: index + 1,
        
          }}>
            <CaseStudyCard caseStudy={caseStudy} locale={locale} />
          </div>
      ))}
    </div>
  );
});

