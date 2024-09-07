CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  type VARCHAR(50)
);

INSERT INTO businesses (name, latitude, longitude, type)
VALUES
('Business 1', 40.7128, -74.0060, 'Cafe'),
('Business 2', 34.0522, -118.2437, 'Restaurant'),
('Business 3', 51.5074, -0.1278, 'Cafe'),
('Business 4', 48.8566, 2.3522, 'Restaurant'),
('Business 5', 41.8781, -87.6298, 'Cafe'),
('Business 6', 51.5074, -0.1278, 'Restaurant');
