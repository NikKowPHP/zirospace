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
  await knex('case_studies_en').whereIn('id', ['example-case-study-en-1', 'example-case-study-en-2']).del();
  await knex('case_studies_pl').whereIn('id', ['example-case-study-pl-1', 'example-case-study-pl-2']).del();
};
