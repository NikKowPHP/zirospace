import { Locale } from '@/i18n';
import { Testimonials } from './testimonials';
import { testimonialService } from '@/lib/services/testimonials.service';

async function TestimonialsSection( {locale}: {locale: Locale}) {
  const testimonials = await testimonialService.getTestimonials(locale);

  return <Testimonials testimonials={testimonials} />;
}

export default TestimonialsSection;