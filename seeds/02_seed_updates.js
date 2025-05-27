exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('updates_en').del()
  await knex('updates_pl').del()

  // Inserts seed entries
  await knex('updates_en').insert([
    {
      id: '1',
      slug: 'first-update',
      title: 'First Update (EN)',
      publish_date: new Date(),
      content_html: '<p>This is the first update in English.</p>',
      excerpt: 'First update excerpt',
      image_url: 'https://picsum.photos/seed/1/800/400',
      image_alt: 'First update image',
      is_published: true,
      order_index: 0,
    },
    {
      id: '2',
      slug: 'second-update',
      title: 'Second Update (EN)',
      publish_date: new Date(Date.now() - 86400000), // One day ago
      content_html: '<p>This is the second update in English.</p>',
      excerpt: 'Second update excerpt',
      image_url: 'https://picsum.photos/seed/2/800/400',
      image_alt: 'Second update image',
      is_published: false,
      order_index: 1,
    },
    {
      id: '3',
      slug: 'third-update',
      title: 'Third Update (EN)',
      publish_date: new Date(Date.now() - 172800000), // Two days ago
      content_html: '<p>This is the third update in English.</p>',
      excerpt: 'Third update excerpt',
      image_url: 'https://picsum.photos/seed/3/800/400',
      image_alt: 'Third update image',
      is_published: true,
      order_index: 2,
    }
  ]);

  await knex('updates_pl').insert([
    {
      id: '4',
      slug: 'pierwsza-aktualizacja',
      title: 'Pierwsza Aktualizacja (PL)',
      publish_date: new Date(),
      content_html: '<p>To jest pierwsza aktualizacja po polsku.</p>',
      excerpt: 'Pierwsza aktualizacja streszczenie',
      image_url: 'https://picsum.photos/seed/4/800/400',
      image_alt: 'Pierwsza aktualizacja obraz',
      is_published: true,
      order_index: 0,
    },
    {
      id: '5',
      slug: 'druga-aktualizacja',
      title: 'Druga Aktualizacja (PL)',
      publish_date: new Date(Date.now() - 86400000), // One day ago
      content_html: '<p>To jest druga aktualizacja po polsku.</p>',
      excerpt: 'Druga aktualizacja streszczenie',
      image_url: 'https://picsum.photos/seed/5/800/400',
      image_alt: 'Druga aktualizacja obraz',
      is_published: false,
      order_index: 1,
    },
    {
      id: '6',
      slug: 'trzecia-aktualizacja',
      title: 'Trzecia Aktualizacja (PL)',
      publish_date: new Date(Date.now() - 172800000), // Two days ago
      content_html: '<p>To jest trzecia aktualizacja po polsku.</p>',
      excerpt: 'Trzecia aktualizacja streszczenie',
      image_url: 'https://picsum.photos/seed/6/800/400',
      image_alt: 'Trzecia aktualizacja obraz',
      is_published: true,
      order_index: 2,
    }
  ]);
};