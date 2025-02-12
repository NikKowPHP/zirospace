import { notFound } from 'next/navigation'
import { type Locale } from '@/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { caseStudyService } from '@/lib/services/case-study.service'

interface PageProps {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Loading component
function CaseStudyLoading() {
  return (
    <div className="bg-white pt-20 animate-pulse">
      <div className="container mx-auto pt-32 pb-16">
        <div className="max-w-[90rem] mx-auto mb-[50px]">
          <div className="relative w-full aspect-[16/9] mb-16 bg-gray-200 rounded-lg" />
          <div className="grid lg:grid-cols-[2fr,1fr] gap-16">
            <div>
              <div className="h-12 bg-gray-200 rounded mb-8 w-3/4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
            <div className="space-y-8">
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Error component
function CaseStudyError() {
  return (
    <div className="bg-white pt-20">
      <div className="container mx-auto pt-32 pb-16 text-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t load the case study. Please try again later.
        </p>
        <Link
          href="/case-studies"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Back to Case Studies
        </Link>
      </div>
    </div>
  )
}

// Main component with updated type
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  return (
    <Suspense fallback={<CaseStudyLoading />}>
      <CaseStudyContent slug={slug} locale={locale} />
    </Suspense>
  )
}

// Content component
async function CaseStudyContent({ slug, locale }: { slug: string; locale: Locale }) {
  try {
    const caseStudy = await caseStudyService.getCaseStudyBySlug(slug, locale)
    if (!caseStudy) notFound()

    const [heroImage, ...otherImages] = caseStudy.images

    // Helper function to determine image layout
    const getImageLayout = (index: number) => {
      const position = index % 4 // Creates groups of 4 images
      return {
        isFullWidth: position === 0 || position === 1, // First two images in each group
        isSplitColumn: position === 2 || position === 3 // Last two images in each group
      }
    }

    return (
      <article className="bg-white pt-28 mb-[50px] xl:px-[10px] container relative mx-auto md:px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="container mx-auto pt-32 pb-[50px] ">
          <div className="max-w-[90rem] mx-auto">
            {/* Hero Image */}
            <div className="relative w-full aspect-[16/9] mb-16">
              <Image
                src={heroImage.url}
                alt={heroImage.alt}
                fill
                className="object-cover rounded-primary-lg"
                priority
              />
            </div>

          </div>
        </header>

        {/* Project Info Section */}
        <section className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-[90rem] mx-auto">
            {/* Project Title and Description */}
            <div className="  mb-[50px]">
              <div>
                <h1 className=" text-4xl md:text-5xl lg:text-[92px] font-medium mb-14">
                  {caseStudy.title}
                </h1>
              </div>
              <div>
                <p className="text-[24px] text-gray-700 leading-relaxed">
                  {caseStudy.description}
                </p>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
              <div>
                <h2 className="text-lg font-medium mb-4">Year</h2>
                <p className="text-gray-700">
                  {new Date(caseStudy.createdAt as unknown as string).getFullYear()}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">Industry</h2>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag) => (
                    <span key={tag} className="text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">Project Direction</h2>
                <div className="space-y-1">
                  {caseStudy.tags.map((tag) => (
                    <p key={tag} className="text-gray-700">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className=" mb-[50px]">
              <Button
                href={caseStudy.ctaUrl}
                variant="primary"
                target="_blank"
                size="lg"
                rel="noopener noreferrer"
              >
                {caseStudy.ctaText}
                <span className="ml-2">→</span>
              </Button>
            </div> */}


          </div>
        </section>

        {/*  Image Gallery */}
        <section className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-[90rem] mx-auto">
            <div className="space-y-[20px]">
              {otherImages.map((image, index) => {
                const { isFullWidth, isSplitColumn } = getImageLayout(index)
                
                // If it's a split column image and it's the first of the pair (even index)
                if (isSplitColumn && index % 2 === 0) {
                  return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                      {/* Current Image */}
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover rounded-primary-lg"
                        />
                      </div>
                      {/* Next Image (if exists) */}
                      {otherImages[index + 1] && (
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={otherImages[index + 1].url}
                            alt={otherImages[index + 1].alt}
                            fill
                            className="object-cover rounded-primary-lg"
                          />
                        </div>
                      )}
                    </div>
                  )
                }
                // Skip the second image of split columns as it's handled above
                else if (isSplitColumn && index % 2 !== 0) {
                  return null
                }
                // Full width images
                else if (isFullWidth) {
                  return (
                    <div key={index} className="relative aspect-[16/9]">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover rounded-primary-lg"
                      />
                    </div>
                  )
                }
                else {
                  return (
                    <div key={index} className="relative aspect-[4/3]">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover rounded-primary-lg"
                      />
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </section>
      </article>
    )
  } catch (error) {
    console.error('Error loading case study:', error)
    return <CaseStudyError />
  }
}
