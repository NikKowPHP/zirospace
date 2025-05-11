-- Insert sample data into the 'apps' table
INSERT INTO public.apps (name, description, thumbnail_url)
VALUES
  ('ZiroSpace App 1', 'Description for ZiroSpace App 1', '/images/ziro.avif'),
  ('ZiroSpace App 2', 'Description for ZiroSpace App 2', '/images/pl.svg'),
  ('ZiroSpace App 3', 'Description for ZiroSpace App 3', '/images/favicon.ico');

-- Insert sample data into the 'screenshots' table
-- Assuming the apps table is already populated and we can get the app IDs
INSERT INTO public.screenshots (app_id, image_url, screen_name, route_path, description, order_index)
SELECT
  a.id,
  s.image_url,
  s.screen_name,
  s.route_path,
  s.description,
  s.order_index
FROM public.apps a, (
  VALUES
    ('/images/image-service-1.png', 'App Screenshot 1', '/app/screen1', 'Screenshot 1', 0),
    ('/images/image-service-2.png', 'App Screenshot 2', '/app/screen2', 'Screenshot 2', 1),
    ('/images/image-service-3.png', 'App Screenshot 3', '/app/screen3', 'Screenshot 3', 2)
) AS s(image_url, screen_name, route_path, description, order_index);
