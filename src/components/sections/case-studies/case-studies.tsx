import { Suspense, memo  } from 'react';
import { type Locale } from '@/i18n'
import { CaseStudiesLoader } from '@/components/sections/case-studies/case-studies-loader'
import { getCaseStudyService } from '@/lib/services/case-study.service';
import { getTranslations } from 'next-intl/server';
import {  CaseStudySlider as CaseStudySliderType} from '@/domain/models/case-study-slider.model';
import { caseStudySliderService } from '@/lib/services/case-study-slider.service';
import dynamic from 'next/dynamic';
import { CaseStudiesTitleSubtitle, CaseStudyList } from './case-studies-list.client';

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

  const title = t('title')
  const description = t('description')

  return (
    <section id="work" className="relative bg-white min-h-[200vh]">
        <CaseStudiesTitleSubtitle title={title} description={description} />
      
      <Suspense fallback={<CaseStudiesLoader />}>
        <CaseStudyList caseStudies={caseStudies} locale={locale} />
      </Suspense>

      <Suspense fallback={<CaseStudiesLoader />}>
        <CaseStudySliders caseStudySliders={caseStudySliders} />
      </Suspense>
    </section>
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