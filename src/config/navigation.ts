export const navigationConfig = {
  mainNav: [
    {
      title: 'process',
      href: 'process',
      isRoute: false,
    },
    {
      title: 'services',
      href: 'services',
      isRoute: false,
    },
    {
      title: 'whyZiro',
      href: 'why-ziro',
      isRoute: false,
    },
    {
      title: 'philosophy',
      href: 'philosophy',
      isRoute: false,
    },
    {
      title: 'FAQs',
      href: 'faqs',
      isRoute: false,
    },
    {
      title: 'blog',
      href: '/blog',
      isRoute: true,
    }
  ],
  languages: [
    {
      title: 'English',
      locale: 'en',
    },
    {
      title: 'Polish',
      locale: 'pl',
    },

  ],
} as const 