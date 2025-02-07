exports.up = async function(knex) {
    await knex('case_studies_en').insert([
        {
            id: 'example-case-study-en-1',
            slug: 'example-case-study-en-1',
            title: 'Example Case Study EN 1',
            subtitle: 'Example Subtitle EN 1',
            description: 'Example Description EN 1',
            tags: 'tag1,tag2',
            images: JSON.stringify([{url: "https://example.com/image1.png", alt: "Example Image 1 Alt Text"}, {url: "https://example.com/image2.png", alt: "Example Image 2 Alt Text"}]),
            cta_text: 'Learn More',
            cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
            cta_url: '/case-studies/example-case-study-en-1',
            color: '#FFFFFF',
            background_color: '#F0F0F0',
            theme: 'default',
            order_index: 0
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
        images: JSON.stringify([{url: "https://example.com/pl/image1.png", alt: "Przykład Obraz 1 Alt Tekst"}, {url: "https://example.com/pl/image2.png", alt: "Przykład Obraz 2 Alt Tekst"}]),
        cta_text: 'Dowiedz się więcej',
        cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
        cta_url: '/pl/case-studies/example-case-study-pl-1',
        color: '#FFFFFF',
        background_color: '#F0F0F0',
        theme: 'default',
        order_index: 0
    }
  ]);
};

exports.down = async function(knex) {
  await knex('case_studies_en').where('id', 'example-case-study-en-1').del();
  await knex('case_studies_pl').where('id', 'example-case-study-pl-1').del();

};
