-- Supabase SQL seed script for zirospace_services_en table

INSERT INTO zirospace_services_en (id, slug, title, subtitle, content_html, excerpt, image_url, image_alt, meta_title, meta_description, keywords, is_published, order_index, created_at, updated_at) VALUES
('1', 'service-1', 'Service 1', 'Subtitle 1', '<p>Content 1</p>', 'Excerpt 1', 'image1.jpg', 'Image 1 Alt', 'Meta Title 1', 'Meta Description 1', '["keyword1", "keyword2"]', true, 0, NOW(), NOW()),
('2', 'service-2', 'Service 2', 'Subtitle 2', '<p>Content 2</p>', 'Excerpt 2', 'image2.jpg', 'Image 2 Alt', 'Meta Title 2', 'Meta Description 2', '["keyword3", "keyword4"]', true, 1, NOW(), NOW()),
('3', 'service-3', 'Service 3', 'Subtitle 3', '<p>Content 3</p>', 'Excerpt 3', 'image3.jpg', 'Image 3 Alt', 'Meta Title 3', 'Meta Description 3', '["keyword5", "keyword6"]', false, 2, NOW(), NOW());