/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Seed for English hero section
  await knex('zirospace_hero_en').insert([
    {
      id: 'hero_en_1', // Fixed ID
      title: 'Pioneering Integrated Digital Health Solutions',
      subtitle: 'Designing User-Friendly Technology for Better Patient Experiences, from Apps to Devices',
      background_image: '/images/hero-background.avif', // Example path, replace with actual if available
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);

  // Seed for Polish hero section
  await knex('zirospace_hero_pl').insert([
    {
      id: 'hero_pl_1', // Fixed ID
      title: 'Tworzymy marki z troską',
      subtitle: 'Partnerstwo dla Twojego sukcesu poprzez design',
      background_image: '/images/hero-background-pl.avif', // Example path, replace with actual if available
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex('zirospace_hero_en').where('id', 'hero_en_1').del();
  await knex('zirospace_hero_pl').where('id', 'hero_pl_1').del();
};