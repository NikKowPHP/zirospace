-- Supabase SQL seed script for zirospace_services_pl table

INSERT INTO zirospace_services_pl (id, slug, title, subtitle, content_html, excerpt, image_url, image_alt, meta_title, meta_description, keywords, is_published, order_index, created_at, updated_at) VALUES
('1', 'serwis-1', 'Serwis 1', 'Podtytuł 1', '<p>Treść 1</p>', 'Fragment 1', 'image1.jpg', 'Obraz 1 Alt', 'Meta Tytuł 1', 'Meta Opis 1', '["słowo kluczowe 1", "słowo kluczowe 2"]', true, 0, NOW(), NOW()),
('2', 'serwis-2', 'Serwis 2', 'Podtytuł 2', '<p>Treść 2</p>', 'Fragment 2', 'image2.jpg', 'Obraz 2 Alt', 'Meta Tytuł 2', 'Meta Opis 2', '["słowo kluczowe 3", "słowo kluczowe 4"]', true, 1, NOW(), NOW()),
('3', 'serwis-3', 'Serwis 3', 'Podtytuł 3', '<p>Treść 3</p>', 'Fragment 3', 'image3.jpg', 'Obraz 3 Alt', 'Meta Tytuł 3', 'Meta Opis 3', '["słowo kluczowe 5", "słowo kluczowe 6"]', false, 2, NOW(), NOW());