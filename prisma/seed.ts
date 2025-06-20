import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const LOREM_IPSUM_SHORT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
const LOREM_IPSUM_LONG =
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><h2>A Subheading</h2><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
async function main() {
  console.log('Start seeding...')
  // Clean up existing data
  console.log('Deleting previous data...')
  await prisma.caseStudySliderImage.deleteMany({})
  await prisma.caseStudySlider.deleteMany({})
  const models = [
    prisma.bannerEN,
    prisma.bannerPL,
    prisma.blogPostEN,
    prisma.blogPostPL,
    prisma.caseStudyEN,
    prisma.caseStudyPL,
    prisma.heroEN,
    prisma.heroPL,
    prisma.serviceEN,
    prisma.servicePL,
    prisma.testimonialEN,
    prisma.testimonialPL,
    prisma.updateEN,
    prisma.updatePL,
    prisma.youtube,
  ]
  for (const model of models) {
    // @ts-ignore
    await model.deleteMany({})
  }
  // --- Seed Banners ---
  console.log('Seeding Banners...')
  await prisma.bannerEN.create({
    data: {
      id: 'banner-en-1',
      title: 'Special Offer!',
      content:
        'Book a free consultation this month and get a 20% discount on your first project.',
      subtitle: 'Limited time only',
      youtube_url: 'dQw4w9WgXcQ',
      is_active: true,
      cta_button_text: 'Book Now',
      cta_button_link: 'https://calendly.com/ziro-nikhil/30min',
    },
  })
  await prisma.bannerPL.create({
    data: {
      id: 'banner-pl-1',
      title: 'Specjalna Oferta!',
      content:
        'Zarezerwuj darmową konsultację w tym miesiącu i otrzymaj 20% zniżki na pierwszy projekt.',
      subtitle: 'Oferta ograniczona czasowo',
      youtube_url: 'dQw4w9WgXcQ',
      is_active: true,
      cta_button_text: 'Zarezerwuj teraz',
      cta_button_link: 'https://calendly.com/ziro-nikhil/30min',
    },
  })
  // --- Seed Blog Posts ---
  console.log('Seeding Blog Posts...')
  await prisma.blogPostEN.create({
    data: {
      slug: 'the-future-of-digital-health',
      title: 'The Future of Digital Health',
      image_url: 'https://picsum.photos/seed/blog1/800/600',
      image_alt: 'A futuristic medical interface',
      excerpt: LOREM_IPSUM_SHORT,
      content_html: LOREM_IPSUM_LONG,
      is_pinned: true,
    },
  })
  await prisma.blogPostEN.create({
    data: {
      slug: 'ux-in-healthcare-apps',
      title: 'Why UX is Crucial for Healthcare Apps',
      image_url: 'https://picsum.photos/seed/blog2/800/600',
      image_alt: 'A person using a health app on a smartphone',
      excerpt: LOREM_IPSUM_SHORT,
      content_html: LOREM_IPSUM_LONG,
      is_pinned: false,
    },
  })
  await prisma.blogPostPL.create({
    data: {
      slug: 'przyszlosc-cyfrowego-zdrowia',
      title: 'Przyszłość Cyfrowego Zdrowia',
      image_url: 'https://picsum.photos/seed/blog1/800/600',
      image_alt: 'Futurystyczny interfejs medyczny',
      excerpt: LOREM_IPSUM_SHORT.replace('Lorem ipsum', 'Po polsku'),
      content_html: LOREM_IPSUM_LONG.replace('Lorem ipsum', 'Po polsku'),
      is_pinned: true,
    },
  })
  // --- Seed Case Studies ---
  console.log('Seeding Case Studies...')
  await prisma.caseStudyEN.create({
    data: {
      id: 'cs-en-1',
      slug: 'revolutionizing-patient-monitoring',
      title: 'G-Sense',
      subtitle: 'Revolutionizing Patient Monitoring',
      description:
        'A case study on developing a real-time patient monitoring system.',
      images: JSON.stringify([
        {
          url: 'https://picsum.photos/seed/cs1img1/1200/800',
          alt: 'Dashboard view',
        },
        {
          url: 'https://picsum.photos/seed/cs1img2/1200/800',
          alt: 'Mobile app view',
        },
      ]),
      tags: ['SaaS', 'Healthcare', 'IoT'],
      cta_url: '/case-studies/revolutionizing-patient-monitoring',
      color: '#FFFFFF',
      background_color: '#0066FF',
      theme: 'dark',
      order_index: 0,
    },
  })
  await prisma.caseStudyPL.create({
    data: {
      id: 'cs-pl-1',
      slug: 'rewolucja-w-monitorowaniu-pacjentow',
      title: 'G-Sense',
      subtitle: 'Rewolucja w Monitorowaniu Pacjentów',
      description:
        'Studium przypadku rozwoju systemu monitorowania pacjentów w czasie rzeczywistym.',
      images: JSON.stringify([
        {
          url: 'https://picsum.photos/seed/cs1img1/1200/800',
          alt: 'Widok panelu',
        },
        {
          url: 'https://picsum.photos/seed/cs1img2/1200/800',
          alt: 'Widok aplikacji mobilnej',
        },
      ]),
      tags: ['SaaS', 'Opieka zdrowotna', 'IoT'],
      cta_url: '/pl/case-studies/rewolucja-w-monitorowaniu-pacjentow',
      color: '#FFFFFF',
      background_color: '#0066FF',
      theme: 'dark',
      order_index: 0,
    },
  })
  // --- Seed Case Study Sliders ---
  console.log('Seeding Case Study Sliders...')
  await prisma.caseStudySlider.create({
    data: {
      id: 'slider-1',
      theme: 'light',
      images: {
        create: [
          {
            id: 'img-1',
            image: 'https://picsum.photos/seed/slider1/650/415',
            alt: 'Slider Image 1',
          },
          {
            id: 'img-2',
            image: 'https://picsum.photos/seed/slider2/650/415',
            alt: 'Slider Image 2',
          },
          {
            id: 'img-3',
            image: 'https://picsum.photos/seed/slider3/650/415',
            alt: 'Slider Image 3',
          },
        ],
      },
    },
    include: {
      images: true,
    },
  })
  // --- Seed Hero Section ---
  console.log('Seeding Hero Section...')
  await prisma.heroEN.create({
    data: {
      id: 'hero-en-1',
      title: 'Pioneering Integrated Digital Health Solutions',
      subtitle:
        'Designing User-Friendly Technology for Better Patient Experiences, from Apps to Devices',
      background_image: 'https://picsum.photos/seed/hero/1920/1080',
    },
  })
  await prisma.heroPL.create({
    data: {
      id: 'hero-pl-1',
      title: 'Pionierskie Zintegrowane Rozwiązania Cyfrowego Zdrowia',
      subtitle:
        'Projektowanie Przyjaznej Technologii dla Lepszych Doświadczeń Pacjentów, od Aplikacji po Urządzenia',
      background_image: 'https://picsum.photos/seed/hero/1920/1080',
    },
  })
  // --- Seed Services ---
  console.log('Seeding Services...')
  await prisma.serviceEN.create({
    data: {
      id: 'service-en-1',
      slug: 'ui-ux-design',
      title: 'UI/UX Design',
      subtitle: 'Crafting Intuitive Experiences',
      content_html: LOREM_IPSUM_LONG,
      excerpt: LOREM_IPSUM_SHORT,
      image_url: 'https://picsum.photos/seed/service1/800/600',
      image_alt: 'UI/UX design process',
      is_published: true,
      order_index: 1,
      keywords: ['UI', 'UX', 'Healthcare Design'],
    },
  })
  await prisma.servicePL.create({
    data: {
      id: 'service-pl-1',
      slug: 'projektowanie-ui-ux',
      title: 'Projektowanie UI/UX',
      subtitle: 'Tworzenie Intuicyjnych Doświadczeń',
      content_html: LOREM_IPSUM_LONG.replace('Lorem ipsum', 'Po polsku'),
      excerpt: LOREM_IPSUM_SHORT.replace('Lorem ipsum', 'Po polsku'),
      image_url: 'https://picsum.photos/seed/service1/800/600',
      image_alt: 'Proces projektowania UI/UX',
      is_published: true,
      order_index: 1,
      keywords: ['UI', 'UX', 'Projektowanie w opiece zdrowotnej'],
    },
  })
  // --- Seed Testimonials ---
  console.log('Seeding Testimonials...')
  await prisma.testimonialEN.create({
    data: {
      id: 'test-en-1',
      author: 'Dr. Jane Doe',
      role: 'Head of Clinic',
      company: 'HealthCare Plus',
      quote:
        'Ziro transformed our workflow. Their solution is both powerful and incredibly easy to use.',
      image: 'https://picsum.photos/seed/person1/100/100',
      image_alt: 'Portrait of Dr. Jane Doe',
    },
  })
  await prisma.testimonialPL.create({
    data: {
      id: 'test-pl-1',
      author: 'Dr Janina Kowalska',
      role: 'Kierownik Kliniki',
      company: 'HealthCare Plus',
      quote:
        'Ziro zrewolucjonizowało nasz przepływ pracy. Ich rozwiązanie jest zarówno potężne, jak i niezwykle łatwe w użyciu.',
      image: 'https://picsum.photos/seed/person1/100/100',
      image_alt: 'Portret Dr Janiny Kowalskiej',
    },
  })
  // --- Seed Updates ---
  console.log('Seeding Updates...')
  await prisma.updateEN.create({
    data: {
      id: 'update-en-1',
      slug: 'new-partnership-announcement',
      title: 'New Partnership Announcement',
      publish_date: new Date(),
      content_html: LOREM_IPSUM_LONG,
      excerpt: LOREM_IPSUM_SHORT,
      image_url: 'https://picsum.photos/seed/update1/800/600',
      image_alt: 'Handshake between partners',
      is_published: true,
      order_index: 1,
    },
  })
  await prisma.updatePL.create({
    data: {
      id: 'update-pl-1',
      slug: 'ogloszenie-o-nowym-partnerstwie',
      title: 'Ogłoszenie o Nowym Partnerstwie',
      publish_date: new Date(),
      content_html: LOREM_IPSUM_LONG.replace('Lorem ipsum', 'Po polsku'),
      excerpt: LOREM_IPSUM_SHORT.replace('Lorem ipsum', 'Po polsku'),
      image_url: 'https://picsum.photos/seed/update1/800/600',
      image_alt: 'Uścisk dłoni partnerów',
      is_published: true,
      order_index: 1,
    },
  })
  // --- Seed YouTube ---
  console.log('Seeding YouTube...')
  await prisma.youtube.create({
    data: {
      id: 'youtube-main',
      youtube_url: 'o-42gWz_ajs',
    },
  })
  console.log('Seeding finished.')
}
main().then(async () => {
  await prisma.$disconnect()
  process.exit(1)
})
