'use client'
import { memo, useMemo, useRef } from 'react';
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'
import { useScroll, useTransform, motion } from 'framer-motion';
import { CaseStudyCard } from '@/components/ui/case-study/case-study-card';


export const AnimatedCaseStudyCard = ({ caseStudy, locale, index }: {
    caseStudy: CaseStudy;
    locale: Locale;
    index: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: cardRef,
        offset: ['start end', 'end start']
    });

    const effectiveIndex = Math.min(index, 2);

    const stickyTopOffset = useMemo(() => {
        if (typeof window !== 'undefined') {
            const baseOffset = window.innerHeight / 2.5 - 100;
            const spacing = 20;
            return baseOffset + effectiveIndex * spacing;
        }
        return 0;
    }, [effectiveIndex]);


    const scale = useTransform(scrollY, [2800, 4000], [1, 0.89]);

    console.log('scrollY', scrollY.get())

    return (
        <motion.div
            ref={cardRef}
            className="sticky flex items-center justify-center"
            key={caseStudy.id ?? index}
            style={{
                zIndex: index + 1,
                top: `${stickyTopOffset}px`,
                transformOrigin: 'center center',
                scale
            }}
        >
            <CaseStudyCard caseStudy={caseStudy} locale={locale} />
        </motion.div>
    );
};



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




    return (
        <div className="mx-auto flex flex-col gap-[200px] max-w-5xl pb-[10vh]"> {/* Added padding-bottom */}
            {sortedStudies.map((caseStudy, index) => (
                <AnimatedCaseStudyCard
                    // Key is important here for React reconciliation
                    key={caseStudy.id ?? index}
                    caseStudy={caseStudy}
                    locale={locale}
                    index={index}
                />
            ))}
        </div>
    );
});


export const CaseStudiesTitleSubtitle = ({ title, description }: { title: string, description: string }) => {
    const targetRef = useRef(null)
    const { scrollY } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end']
    });


    const scale = useTransform(scrollY, [2800, 3200], [1, 0.8])
    const opacity = useTransform(scrollY, [2800, 3200], [1, 0])
    return (
        <motion.div ref={targetRef}
            style={{ scale, opacity }}
            className='sticky top-[300px] mb-[36px] flex flex-col items-center justify-center gap-[12px] '>
            <h1
                className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary"
                itemProp="headline"
            >
                {title}

            </h1>
            <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0">
                {description}
            </h3>
        </motion.div>
    )
}
