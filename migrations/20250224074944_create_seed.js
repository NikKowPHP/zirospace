/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Seed data for zirospace_banners_en
  await knex('zirospace_banners_en').insert([
    {
      id: 'banner-en-1',
      title: 'English Banner 1',
      content: 'This is the first English banner.',
      subtitle: 'Subtitle for Banner 1',
      image_url: '/images/testimonials/testimonial.webp',
      is_active: true,
      cta_button_text: 'Learn More',
      cta_button_link: '/en/learn-more',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'banner-en-2',
      title: 'English Banner 2',
      content: 'This is the second English banner.',
      subtitle: 'Subtitle for Banner 2',
      image_url: '/images/testimonials/testimonial.webp',
      is_active: false,
      cta_button_text: 'Shop Now',
      cta_button_link: '/en/shop-now',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Seed data for zirospace_banners_pl
  await knex('zirospace_banners_pl').insert([
    {
      id: 'banner-pl-1',
      title: 'Polski Banner 1',
      content: 'To jest pierwszy polski baner.',
      subtitle: 'Podtytuł dla Banera 1',
      image_url: '/images/testimonials/testimonial.webp',
      is_active: true,
      cta_button_text: 'Dowiedz się więcej',
      cta_button_link: '/pl/dowiedz-sie-wiecej',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'banner-pl-2',
      title: 'Polski Banner 2',
      content: 'To jest drugi polski baner.',
      subtitle: 'Podtytuł dla Banera 2',
      image_url: '/images/testimonials/testimonial.webp',
      is_active: false,
      cta_button_text: 'Kup teraz',
      cta_button_link: '/pl/kup-teraz',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex('zirospace_banners_en').del();
  await knex('zirospace_banners_pl').del();
};
