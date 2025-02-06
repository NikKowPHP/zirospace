import { Suspense, memo } from 'react';
// import { getCaseStudies } from '@/lib/data/case-studies'
import { CaseStudyCard } from '@/components/ui/case-study/case-study-card'
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudiesLoader } from '@/components/sections/case-studies/case-studies-loader'
import { caseStudyService } from '@/lib/services/caseStudy.service';
import { getTranslations } from 'next-intl/server';

interface CaseStudiesProps {
  locale: Locale
}



export async function CaseStudies({ locale }: CaseStudiesProps) {
  const caseStudies = await caseStudyService.getCaseStudies(locale)
  const t = await getTranslations('caseStudiesSection')


  return (
    <section id="work" className="relative overflow-hidden bg-white border border-gray-700 py-[100px]">
      <CaseStudiesTitleSubtitle t={t} />
      <Suspense fallback={<CaseStudiesLoader />}>
        <CaseStudyList caseStudies={caseStudies} locale={locale} />
      </Suspense>
    </section>
  )
}


const CaseStudiesTitleSubtitle = ({ t }: { t: any }) => {
  return (
    <div className='mb-[36px] flex flex-col items-center justify-center gap-[12px] '>
      <h1
        className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary"
        itemProp="headline"
      >
        {t('title')}
       
      </h1>
      <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0">
          {t('description')}
        </h3>
    </div>
  )
}

const CaseStudyList = memo(function CaseStudyList({ 
  caseStudies,
  locale
}: { 
  caseStudies: CaseStudy[] 
  locale: Locale
}) {
  return (
    <div className="relative mx-auto border border-red-500 flex flex-col gap-16 max-w-5xl">
      {caseStudies.map((caseStudy) => (
        <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} locale={locale} />
      ))}
    </div>
  );
});