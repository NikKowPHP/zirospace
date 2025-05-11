/**
 * @param { import("knex").Knex } knex
 * @return { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('screenshots').del();
  await knex('apps').del();

  // Inserts seed entries for apps
  const apps = await knex('apps').insert([
    { name: 'ZiroSpace App 1', description: 'Description for ZiroSpace App 1', thumbnail_url: '/images/ziro.avif' },
    { name: 'ZiroSpace App 2', description: 'Description for ZiroSpace App 2', thumbnail_url: '/images/pl.svg' },
    { name: 'ZiroSpace App 3', description: 'Description for ZiroSpace App 3', thumbnail_url: '/images/favicon.ico' },
  ]).returning('id');

  // Inserts seed entries for screenshots
  const screenshots = [];
  apps.forEach(app => {
    screenshots.push(
      { app_id: app.id, image_url: '/images/image-service-1.png', screen_name: 'App 1 Screenshot 1', route_path: '/app1/screen1', description: 'Screenshot 1 for App 1', order_index: 0 },
      { app_id: app.id, image_url: '/images/image-service-2.png', screen_name: 'App 1 Screenshot 2', route_path: '/app1/screen2', description: 'Screenshot 2 for App 1', order_index: 1 },
      { app_id: app.id, image_url: '/images/image-service-3.png', screen_name: 'App 1 Screenshot 3', route_path: '/app1/screen3', description: 'Screenshot 3 for App 1', order_index: 2 }
    );
  });

  await knex('screenshots').insert(screenshots);
};
