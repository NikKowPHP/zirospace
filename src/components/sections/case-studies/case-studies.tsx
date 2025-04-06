import { Suspense, memo  } from 'react';
import { type Locale } from '@/i18n'
import { CaseStudiesLoader } from '@/components/sections/case-studies/case-studies-loader'
import { getCaseStudyService } from '@/lib/services/case-study.service';
import { getTranslations } from 'next-intl/server';
import {  CaseStudySlider as CaseStudySliderType} from '@/domain/models/case-study-slider.model';
import { caseStudySliderService } from '@/lib/services/case-study-slider.service';
import dynamic from 'next/dynamic';
import { CaseStudyList } from './case-studies-list.client';

// Dynamically import the client slider (disable SSR)
const CaseStudySliderClient = dynamic(
  () =>
    import('./case-study-slider.client').then(
      (mod) => mod.CaseStudySliderClient
    ),
  { ssr: true }
);

interface CaseStudiesProps {
  locale: Locale
}


export async function CaseStudies({ locale }: CaseStudiesProps) {
  const caseStudyService = await getCaseStudyService()
  const caseStudies = await caseStudyService.getCaseStudies(locale)
  const caseStudySliders = await caseStudySliderService.getCaseStudySliders()
  const t = await getTranslations('caseStudiesSection')

  return (
    <section id="work" className="relative bg-white min-h-[200vh]">
        <CaseStudiesTitleSubtitle t={t} />
      
      <Suspense fallback={<CaseStudiesLoader />}>
        <CaseStudyList caseStudies={caseStudies} locale={locale} />
      </Suspense>

      <Suspense fallback={<CaseStudiesLoader />}>
        <CaseStudySliders caseStudySliders={caseStudySliders} />
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



export const CaseStudySliders = memo(function CaseStudySliders({
  caseStudySliders,
}: {
  caseStudySliders: CaseStudySliderType[]
}) {
  return (
    <div className="relative mx-auto max-w-5xl my-8">
      {caseStudySliders.map((caseStudySlider) => (
        <CaseStudySliderClient key={caseStudySlider.id} caseStudySlider={caseStudySlider} />
      ))}
    </div>
  )
})