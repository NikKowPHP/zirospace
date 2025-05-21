// seeds/01_seed_services.js
exports.seed = async function(knex) {
  // Seed for services_en
  await knex('services_en').del(); // Clear existing data
  await knex('services_en').insert([
    {
      id: 'service-en-1',
      slug: 'english-service-one',
      title: 'English Service One',
      subtitle: 'Detailed subtitle for English service one',
      content_html: '<p>This is the full HTML content for the first English service.</p>',
      excerpt: 'A short excerpt for the first English service.',
      image_url: 'https://picsum.photos/200/300',
      image_alt: 'Image for English Service One',
      meta_title: 'SEO Title for English Service One',
      meta_description: 'SEO description for English Service One.',
      keywords: JSON.stringify(['digital health', 'ui/ux', 'english']), // Store as JSON string for SQLite TEXT column
      is_published: true,
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'service-en-2',
      slug: 'english-service-two',
      title: 'English Service Two',
      subtitle: 'Detailed subtitle for English service two',
      content_html: '<p>Content for the second English service.</p>',
      excerpt: 'Excerpt for the second English service.',
      image_url: 'https://picsum.photos/200/300',
      image_alt: 'Image for English Service Two',
      meta_title: 'SEO Title for English Service Two',
      meta_description: 'SEO description for English Service Two.',
      keywords: JSON.stringify(['healthcare tech', 'branding', 'english']),
      is_published: true,
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  // Seed for services_pl
  await knex('services_pl').del(); // Clear existing data
  await knex('services_pl').insert([
    {
      id: 'service-pl-1',
      slug: 'polski-serwis-jeden',
      title: 'Polski Serwis Jeden',
      subtitle: 'Szczegółowy podtytuł dla polskiego serwisu jeden',
      content_html: '<p>To jest pełna treść HTML dla pierwszego polskiego serwisu.</p>',
      excerpt: 'Krótki fragment dla pierwszego polskiego serwisu.',
      image_url: '/images/services/pl/serwis1.jpg',
      image_alt: 'Obraz dla Polskiego Serwisu Jeden',
      meta_title: 'Tytuł SEO dla Polskiego Serwisu Jeden',
      meta_description: 'Opis SEO dla Polskiego Serwisu Jeden.',
      keywords: JSON.stringify(['zdrowie cyfrowe', 'ui/ux', 'polski']), // Store as JSON string
      is_published: true,
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'service-pl-2',
      slug: 'polski-serwis-dwa',
      title: 'Polski Serwis Dwa',
      subtitle: 'Szczegółowy podtytuł dla polskiego serwisu dwa',
      content_html: '<p>Treść dla drugiego polskiego serwisu.</p>',
      excerpt: 'Fragment dla drugiego polskiego serwisu.',
      image_url: '/images/services/pl/serwis2.jpg',
      image_alt: 'Obraz dla Polskiego Serwisu Dwa',
      meta_title: 'Tytuł SEO dla Polskiego Serwisu Dwa',
      meta_description: 'Opis SEO dla Polskiego Serwisu Dwa.',
      keywords: JSON.stringify(['technologie medyczne', 'branding', 'polski']),
      is_published: false, // Example of an unpublished service
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
};