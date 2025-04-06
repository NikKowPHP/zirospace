'use client'
import { memo, useMemo, useRef } from 'react';
import { type Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'
import { useScroll, useMotionValueEvent, useTransform, motion } from 'framer-motion';
import { CaseStudyCard } from '@/components/ui/case-study/case-study-card';



export const AnimatedCaseStudyCard = ({ caseStudy, locale, index, randomRotation }: {
    caseStudy: CaseStudy;
    locale: Locale;
    index: number;
    randomRotation: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    // Calculate the final sticky top position for this card
    const stickyTopOffset = 300 + index * 40;

    // Define the scroll distance over which the animation occurs before sticking
    const animationWindow = 600; // e.g., animate over 400px of scroll

    // Offset array for useScroll:
    // - Start animation when the top of the card ('start') is 'stickyTopOffset + animationWindow' pixels from the viewport top.
    // - End animation when the top of the card ('start') is 'stickyTopOffset' pixels from the viewport top (i.e., exactly when it sticks).
    const startOffset = `start ${stickyTopOffset + animationWindow}px`;
    const endOffset = `start ${stickyTopOffset}px`;
    type ScrollOffsetString = `start ${number}px`;

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: [startOffset as ScrollOffsetString, endOffset as ScrollOffsetString],
    });

    // Map the scroll progress (0 to 1) during the defined offset range to the rotation angle (0 to randomRotation)
    const rotate = useTransform(scrollYProgress, [0, 1], [0, randomRotation], { clamp: true });

    return (
        <motion.div
            ref={cardRef}
            // Apply sticky positioning and dynamic top offset directly
            className="sticky flex items-center justify-center"
            key={caseStudy.id ?? index} // Key ideally remains on the element created by map
            style={{
                zIndex: index + 1,
                top: `${stickyTopOffset}px`, // Set the specific sticky top position
                rotate: rotate, // Apply the calculated rotation
                transformOrigin: 'center center'
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

    const randomRotations = useMemo(() =>
        sortedStudies.map(() => (Math.random() * 6 - 3)), // Range -3 to +3 degrees
        [sortedStudies] // Correct dependency
    );


    return (
        <div className="mx-auto flex flex-col gap-[200px] max-w-5xl pb-[10vh]"> {/* Added padding-bottom */}
            {sortedStudies.map((caseStudy, index) => (
                <AnimatedCaseStudyCard
                    // Key is important here for React reconciliation
                    key={caseStudy.id ?? index}
                    caseStudy={caseStudy}
                    locale={locale}
                    index={index}
                    randomRotation={randomRotations[index]}
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
