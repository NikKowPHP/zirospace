import { Suspense, memo } from 'react';
// import { getCaseStudies } from '@/lib/data/case-studies'
import { CaseStudyCard } from '@/components/ui/case-study/case-study-card'
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudiesLoader } from '@/components/sections/case-studies/case-studies-loader'
import { caseStudyService } from '@/lib/services/caseStudy.service';

interface CaseStudiesProps {
  locale: Locale
}

const CaseStudyList = memo(function CaseStudyList({ 
  caseStudies,
  locale
}: { 
  caseStudies: CaseStudy[] 
  locale: Locale
}) {
  return (
    <div className="md:container relative mx-auto  flex flex-col gap-16">
      {caseStudies.map((caseStudy) => (
        <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} locale={locale} />
      ))}
    </div>
  );
});

export async function CaseStudies({ locale }: CaseStudiesProps) {
  const caseStudies = await caseStudyService.getCaseStudies(locale)
 

  return (
    <section id="work" className="relative overflow-hidden bg-white">
      <Suspense fallback={<CaseStudiesLoader />}>
        <CaseStudyList caseStudies={caseStudies} locale={locale} />
      </Suspense>
    </section>
  )
}
