'use client'
import { memo, useMemo, useRef } from 'react';
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'
import { useScroll, useMotionValueEvent, useTransform, motion } from 'framer-motion';
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
    // Correction: Remove target and offset to track window scrollY in pixels
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', () => {
        console.log('scrollY', scrollY.get())
    })
    

    const randomRotations = useMemo(() => 
        sortedStudies.map(() => (Math.random() * 6 - 3)),
        [sortedStudies]
    );
    console.log('randomRotations', randomRotations)
   // This function now correctly uses window scrollY (pixels)
   const Rotation = (index: number) => {
    // Ensure useTransform is called consistently
    const transformHook = useTransform(
        scrollY, // Now represents window scroll pixels
        [
            3500 - index * 500 - 400,  // Animation start (scroll pixels)
            3500 - index * 500         // Animation end (scroll pixels)
        ],
        [0, randomRotations[index]], // Output range: 0 to random angle
        { clamp: true } // Allow extrapolation if needed, though maybe clamp: true is safer
    );
    return transformHook;
}

console.log('scrollY MotionValue object:', scrollY)

    console.log('scrollY', scrollY)
    return (
        <div ref={targetRef} className="mx-auto flex flex-col gap-[200px] max-w-5xl">
            {sortedStudies.map((caseStudy, index) => {

                const offset = index * 40;
                const rotate = Rotation(index);


                return (
                    <motion.div className="sticky top-[300px] flex items-center justify-center" key={caseStudy.id ?? index}
                        style={{
                            zIndex: index + 1,
                            top: `calc(300px + ${offset}px)`,
                            rotate: rotate,
                            transformOrigin: 'center center'

                        }}>
                        <CaseStudyCard caseStudy={caseStudy} locale={locale} />
                    </motion.div>
                )
            })}
        </div>
    );
});

export const CaseStudiesTitleSubtitle = ({ title, description }: { title: string, description: string }) => {
    const targetRef = useRef(null)
    const { scrollY } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end']
    });


    useMotionValueEvent(scrollY, 'change', () => {
        console.log('scrolly for title subtitle', scrollY.get())
    })
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
