// import { TestimonialList } from './testimonial-list'
import { Suspense } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import { getTestimonialService } from '@/lib/services/testimonials.service'
import { TestimonialList } from './testimonials-list'

export default async function TestimonialsAdminPage() {
  const testimonialService = await getTestimonialService()
  const [enTestimonials, plTestimonials] = await Promise.all([
    testimonialService.getTestimonials('en'),
    testimonialService.getTestimonials('pl')
  ])

  return (
    <AdminProvider initialTestimonials={{ en: enTestimonials, pl: plTestimonials }}>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Testimonials Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <TestimonialList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
