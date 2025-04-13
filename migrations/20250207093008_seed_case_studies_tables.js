exports.up = async function(knex) {
    await knex('case_studies_en').insert([
        {
            id: 'example-case-study-en-1',
            slug: 'example-case-study-en-1',
            title: 'Example Case Study EN 1',
            subtitle: 'Example Subtitle EN 1',
            description: 'Example Description EN 1',
            tags: 'tag1,tag2',
            images: JSON.stringify([{url: "/images/case-studies/gsense/gsense.avif", alt: "Example Image 1 Alt Text"}, {url: "/images/case-studies/gsense/gsense.avif", alt: "Example Image 2 Alt Text"}]),
            cta_text: 'Learn More',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-1',
            color: '#FFFFFF',
            background_color: '#F0F0F0',
            theme: 'dark',
            order_index: 0
        },
        {
            id: 'example-case-study-en-2',
            slug: 'example-case-study-en-2',
            title: 'Example Case Study EN 2',
            subtitle: 'Example Subtitle EN 2',
            description: 'Example Description EN 2',
            tags: 'tag3,tag4',
            images: JSON.stringify([{url: "/images/case-studies/gsense/gsense.avif", alt: "Example Image 3 Alt Text"}, {url: "/images/case-studies/gsense/gsense.avif", alt: "Example Image 4 Alt Text"}]),
            cta_text: 'Explore Now',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-2',
            color: '#000000',
            background_color: '#E0E0E0',
            theme: 'light',
            order_index: 1
        },
        {
            id: 'example-case-study-en-3',
            slug: 'example-case-study-en-3',
            title: 'Example Case Study EN 3',
            subtitle: 'Example Subtitle EN 3',
            description: 'Example Description EN 3',
            tags: 'tag5,tag6',
            images: JSON.stringify([{url: "/images/service-image-3.png", alt: "Service Image 3 Alt Text"}]),
            cta_text: 'View Details',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-3',
            color: '#FF5733',
            background_color: '#FFF5F3',
            theme: 'light',
            order_index: 2
        },
        {
            id: 'example-case-study-en-4',
            slug: 'example-case-study-en-4',
            title: 'Example Case Study EN 4',
            subtitle: 'Example Subtitle EN 4',
            description: 'Example Description EN 4',
            tags: 'tag7,tag8',
            images: JSON.stringify([{url: "/images/service-image-3.png", alt: "Service Image 3 Alt Text"}]),
            cta_text: 'Discover More',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-4',
            color: '#33A8FF',
            background_color: '#F3F9FF',
            theme: 'dark',
            order_index: 3
        },
        {
            id: 'example-case-study-en-5',
            slug: 'example-case-study-en-5',
            title: 'Example Case Study EN 5',
            subtitle: 'Example Subtitle EN 5',
            description: 'Example Description EN 5',
            tags: 'tag9,tag10',
            images: JSON.stringify([{url: "/images/service-image-3.png", alt: "Service Image 3 Alt Text"}]),
            cta_text: 'See Project',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-5',
            color: '#33FF57',
            background_color: '#F3FFF5',
            theme: 'light',
            order_index: 4
        },
        {
            id: 'example-case-study-en-6',
            slug: 'example-case-study-en-6',
            title: 'Example Case Study EN 6',
            subtitle: 'Example Subtitle EN 6',
            description: 'Example Description EN 6',
            tags: 'tag11,tag12',
            images: JSON.stringify([{url: "/images/service-image-3.png", alt: "Service Image 3 Alt Text"}]),
            cta_text: 'Explore Case',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-6',
            color: '#FF33A8',
            background_color: '#FFF3F9',
            theme: 'dark',
            order_index: 5
        },
        {
            id: 'example-case-study-en-7',
            slug: 'example-case-study-en-7',
            title: 'Example Case Study EN 7',
            subtitle: 'Example Subtitle EN 7',
            description: 'Example Description EN 7',
            tags: 'tag13,tag14',
            images: JSON.stringify([{url: "/images/service-image-3.png", alt: "Service Image 3 Alt Text"}]),
            cta_text: 'Learn How',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-7',
            color: '#A833FF',
            background_color: '#F9F3FF',
            theme: 'light',
            order_index: 6
        }
    ]);

  await knex('case_studies_pl').insert([
    {
        id: 'example-case-study-pl-1',
        slug: 'example-case-study-pl-1',
        title: 'Example Case Study PL 1',
        subtitle: 'Example Subtitle PL 1',
        description: 'Example Description PL 1',
        tags: 'tag1,tag2',
        images: JSON.stringify([{url: "/images/case-studies/gsense/gsense.avif", alt: "Przykład Obraz 1 Alt Tekst"}, {url: "/images/case-studies/gsense/gsense.avif", alt: "Przykład Obraz 2 Alt Tekst"}]),
        cta_text: 'Dowiedz się więcej',
        cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
        cta_url: '/pl/case-studies/example-case-study-pl-1',
        color: '#FFFFFF',
        background_color: '#F0F0F0',
        theme: 'light',
        order_index: 0
    },
    {
        id: 'example-case-study-pl-2',
        slug: 'example-case-study-pl-2',
        title: 'Example Case Study PL 2',
        subtitle: 'Example Subtitle PL 2',
        description: 'Example Description PL 2',
        tags: 'tag3,tag4',
        images: JSON.stringify([{url: "/images/case-studies/gsense/gsense.avif", alt: "Przykład Obraz 3 Alt Tekst"}, {url: "/images/case-studies/gsense/gsense.avif", alt: "Przykład Obraz 4 Alt Tekst"}]),
        cta_text: 'Eksploruj Teraz',
        cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
        cta_url: '/pl/case-studies/example-case-study-pl-2',
        color: '#000000',
        background_color: '#E0E0E0',
        theme: 'dark',
        order_index: 1
    }
  ]);
};

exports.down = async function(knex) {
    await knex('case_studies_en').whereIn('id', [
        'example-case-study-en-1', 
        'example-case-study-en-2',
        'example-case-study-en-3',
        'example-case-study-en-4',
        'example-case-study-en-5',
        'example-case-study-en-6',
        'example-case-study-en-7'
    ]).del();
  await knex('case_studies_pl').whereIn('id', ['example-case-study-pl-1', 'example-case-study-pl-2']).del();
};
