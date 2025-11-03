-- Seed data for development environment

-- Insert locations
INSERT INTO locations (id, country, city, region, latitude, longitude, name_i18n, description_i18n, image_url, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Portugal', 'Porto', 'Norte', 41.1579, -8.6291, '{"en": "Porto", "pt-BR": "Porto", "pt-PT": "Porto", "es": "Oporto"}', '{"en": "Historic riverside city with stunning architecture", "pt-BR": "Cidade histórica à beira-rio com arquitetura deslumbrante", "pt-PT": "Cidade histórica ribeirinha com arquitetura deslumbrante", "es": "Ciudad histórica junto al río con impresionante arquitectura"}', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'Portugal', 'Lisbon', 'Lisboa', 38.7223, -9.1393, '{"en": "Lisbon", "pt-BR": "Lisboa", "pt-PT": "Lisboa", "es": "Lisboa"}', '{"en": "Coastal capital with vibrant maritime culture", "pt-BR": "Capital costeira com vibrante cultura marítima", "pt-PT": "Capital costeira com vibrante cultura marítima", "es": "Capital costera con vibrante cultura marítima"}', 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop', true),
    ('550e8400-e29b-41d4-a716-446655440003', 'Portugal', 'Algarve', 'Algarve', 37.0194, -7.9304, '{"en": "Algarve", "pt-BR": "Algarve", "pt-PT": "Algarve", "es": "Algarve"}', '{"en": "Stunning beaches and golden cliffs", "pt-BR": "Praias deslumbrantes e falésias douradas", "pt-PT": "Praias deslumbrantes e falésias douradas", "es": "Impresionantes playas y acantilados dorados"}', 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=600&fit=crop', true),
    ('550e8400-e29b-41d4-a716-446655440004', 'Brazil', 'São Paulo', 'Sudeste', -23.5505, -46.6333, '{"en": "São Paulo", "pt-BR": "São Paulo", "pt-PT": "São Paulo", "es": "São Paulo"}', '{"en": "Coastal access from Brazil''s largest city", "pt-BR": "Acesso costeiro da maior cidade do Brasil", "pt-PT": "Acesso costeiro da maior cidade do Brasil", "es": "Acceso costero desde la ciudad más grande de Brasil"}', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop', true),
    ('550e8400-e29b-41d4-a716-446655440005', 'Brazil', 'Rio de Janeiro', 'Sudeste', -22.9068, -43.1729, '{"en": "Rio de Janeiro", "pt-BR": "Rio de Janeiro", "pt-PT": "Rio de Janeiro", "es": "Río de Janeiro"}', '{"en": "Iconic beaches and stunning coastal views", "pt-BR": "Praias icônicas e vistas costeiras deslumbrantes", "pt-PT": "Praias icónicas e vistas costeiras deslumbrantes", "es": "Playas icónicas e impresionantes vistas costeras"}', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop', true),
    ('550e8400-e29b-41d4-a716-446655440006', 'Brazil', 'Santa Catarina', 'Sul', -27.2423, -50.2189, '{"en": "Santa Catarina", "pt-BR": "Santa Catarina", "pt-PT": "Santa Catarina", "es": "Santa Catarina"}', '{"en": "Paradise islands and crystal clear waters", "pt-BR": "Ilhas paradisíacas e águas cristalinas", "pt-PT": "Ilhas paradisíacas e águas cristalinas", "es": "Islas paradisíacas y aguas cristalinas"}', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop', true);

-- Insert amenities
INSERT INTO amenities (id, name_i18n, icon, category) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '{"en": "Life Jackets", "pt-BR": "Coletes Salva-vidas", "pt-PT": "Coletes Salva-vidas", "es": "Chalecos Salvavidas"}', 'shield', 'SAFETY'),
    ('650e8400-e29b-41d4-a716-446655440002', '{"en": "First Aid Kit", "pt-BR": "Kit Primeiros Socorros", "pt-PT": "Estojo Primeiros Socorros", "es": "Botiquín Primeros Auxilios"}', 'heart-pulse', 'SAFETY'),
    ('650e8400-e29b-41d4-a716-446655440003', '{"en": "GPS Navigation", "pt-BR": "Navegação GPS", "pt-PT": "Navegação GPS", "es": "Navegación GPS"}', 'navigation', 'NAVIGATION'),
    ('650e8400-e29b-41d4-a716-446655440004', '{"en": "VHF Radio", "pt-BR": "Rádio VHF", "pt-PT": "Rádio VHF", "es": "Radio VHF"}', 'radio', 'NAVIGATION'),
    ('650e8400-e29b-41d4-a716-446655440005', '{"en": "WiFi", "pt-BR": "WiFi", "pt-PT": "WiFi", "es": "WiFi"}', 'wifi', 'COMFORT'),
    ('650e8400-e29b-41d4-a716-446655440006', '{"en": "Air Conditioning", "pt-BR": "Ar Condicionado", "pt-PT": "Ar Condicionado", "es": "Aire Acondicionado"}', 'thermometer', 'COMFORT'),
    ('650e8400-e29b-41d4-a716-446655440007', '{"en": "Bluetooth Sound System", "pt-BR": "Sistema de Som Bluetooth", "pt-PT": "Sistema de Som Bluetooth", "es": "Sistema de Sonido Bluetooth"}', 'music', 'ENTERTAINMENT'),
    ('650e8400-e29b-41d4-a716-446655440008', '{"en": "Snorkeling Equipment", "pt-BR": "Equipamento de Snorkel", "pt-PT": "Equipamento de Snorkel", "es": "Equipo de Snorkel"}', 'goggles', 'ENTERTAINMENT'),
    ('650e8400-e29b-41d4-a716-446655440009', '{"en": "Fishing Equipment", "pt-BR": "Equipamento de Pesca", "pt-PT": "Equipamento de Pesca", "es": "Equipo de Pesca"}', 'fish', 'ENTERTAINMENT'),
    ('650e8400-e29b-41d4-a716-446655440010', '{"en": "Kitchen/Galley", "pt-BR": "Cozinha/Copa", "pt-PT": "Cozinha/Copa", "es": "Cocina/Galera"}', 'utensils', 'COMFORT');

-- Insert demo users (password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, preferred_language, country, is_email_verified, is_active) VALUES
    ('750e8400-e29b-41d4-a716-446655440001', 'admin@villasboats.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8i7AYnJPMu6gC5QLk6', 'Admin User', '+351 912 345 678', 'ADMIN', 'EN', 'Portugal', true, true),
    ('750e8400-e29b-41d4-a716-446655440002', 'john.doe@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8i7AYnJPMu6gC5QLk6', 'John Doe', '+351 913 456 789', 'CUSTOMER', 'EN', 'Portugal', true, true),
    ('750e8400-e29b-41d4-a716-446655440003', 'maria.silva@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8i7AYnJPMu6gC5QLk6', 'Maria Silva', '+55 11 98765-4321', 'CUSTOMER', 'PT_BR', 'Brazil', true, true);

-- Insert boats
INSERT INTO boats (id, slug, name_i18n, description_i18n, short_description_i18n, type, status, make, model, year, length_feet, capacity, cabins, bathrooms, location_id, price_per_day_usd, price_per_day_eur, price_per_day_gbp, price_per_day_brl, captain_required, captain_price_per_day_usd, captain_price_per_day_eur, captain_price_per_day_gbp, captain_price_per_day_brl, primary_image_url, average_rating, review_count, total_bookings) VALUES
    (
        '850e8400-e29b-41d4-a716-446655440001',
        'luxury-catamaran-algarve',
        '{"en": "Luxury Catamaran Algarve", "pt-BR": "Catamarã de Luxo Algarve", "pt-PT": "Catamarã de Luxo Algarve", "es": "Catamarán de Lujo Algarve"}',
        '{"en": "Experience luxury sailing in the beautiful Algarve coast. This stunning catamaran offers spacious decks, comfortable cabins, and all modern amenities for an unforgettable day at sea.", "pt-BR": "Experimente navegação de luxo na bela costa do Algarve. Este catamarã deslumbrante oferece decks espaçosos, cabines confortáveis e todas as comodidades modernas para um dia inesquecível no mar.", "pt-PT": "Experimente navegação de luxo na bela costa do Algarve. Este catamarã deslumbrante oferece decks espaçosos, cabines confortáveis e todas as comodidades modernas para um dia inesquecível no mar.", "es": "Experimenta la navegación de lujo en la hermosa costa del Algarve. Este impresionante catamarán ofrece cubiertas espaciosas, cabinas cómodas y todas las comodidades modernas para un día inolvidable en el mar."}',
        '{"en": "Spacious luxury catamaran perfect for groups", "pt-BR": "Catamarã de luxo espaçoso perfeito para grupos", "pt-PT": "Catamarã de luxo espaçoso perfeito para grupos", "es": "Catamarán de lujo espacioso perfecto para grupos"}',
        'CATAMARAN',
        'ACTIVE',
        'Lagoon',
        '450',
        2020,
        45.00,
        12,
        4,
        2,
        '550e8400-e29b-41d4-a716-446655440003',
        850.00,
        780.00,
        670.00,
        4200.00,
        false,
        200.00,
        185.00,
        160.00,
        1000.00,
        'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
        4.9,
        12,
        45
    ),
    (
        '850e8400-e29b-41d4-a716-446655440002',
        'classic-sailboat-lisbon',
        '{"en": "Classic Sailboat Lisbon", "pt-BR": "Veleiro Clássico Lisboa", "pt-PT": "Veleiro Clássico Lisboa", "es": "Velero Clásico Lisboa"}',
        '{"en": "Discover the Tagus River on a classic sailboat. Perfect for romantic getaways or peaceful sailing experiences along Lisbon''s beautiful waterfront.", "pt-BR": "Descubra o Rio Tejo num veleiro clássico. Perfeito para escapadas românticas ou experiências de navegação tranquilas ao longo da bela orla de Lisboa.", "pt-PT": "Descubra o Rio Tejo num veleiro clássico. Perfeito para escapadas românticas ou experiências de navegação tranquilas ao longo da bela orla de Lisboa.", "es": "Descubre el río Tajo en un velero clásico. Perfecto para escapadas románticas o experiencias de navegación tranquilas a lo largo del hermoso paseo marítimo de Lisboa."}',
        '{"en": "Elegant sailboat for the Tagus River", "pt-BR": "Veleiro elegante para o Rio Tejo", "pt-PT": "Veleiro elegante para o Rio Tejo", "es": "Velero elegante para el río Tajo"}',
        'SAILBOAT',
        'ACTIVE',
        'Jeanneau',
        'Sun Odyssey 389',
        2018,
        38.00,
        6,
        3,
        1,
        '550e8400-e29b-41d4-a716-446655440002',
        320.00,
        300.00,
        260.00,
        1600.00,
        false,
        150.00,
        140.00,
        120.00,
        750.00,
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        4.8,
        8,
        32
    ),
    (
        '850e8400-e29b-41d4-a716-446655440003',
        'speedboat-rio-janeiro',
        '{"en": "Speedboat Rio de Janeiro", "pt-BR": "Lancha Rio de Janeiro", "pt-PT": "Lancha Rio de Janeiro", "es": "Lancha Río de Janeiro"}',
        '{"en": "Explore the stunning bays of Rio on a fast speedboat. Experience the thrill of high-speed cruising while enjoying breathtaking coastal views.", "pt-BR": "Explore as baías deslumbrantes do Rio numa lancha rápida. Experimente a emoção do cruzeiro em alta velocidade enquanto desfruta de vistas costeiras de tirar o fôlego.", "pt-PT": "Explore as baías deslumbrantes do Rio numa lancha rápida. Experimente a emoção do cruzeiro em alta velocidade enquanto desfruta de vistas costeiras de tirar o fôlego.", "es": "Explora las impresionantes bahías de Río en una lancha rápida. Experimenta la emoción del crucero a alta velocidad mientras disfrutas de impresionantes vistas costeras."}',
        '{"en": "High-speed adventure in Rio''s bays", "pt-BR": "Aventura em alta velocidade nas baías do Rio", "pt-PT": "Aventura em alta velocidade nas baías do Rio", "es": "Aventura de alta velocidad en las bahías de Río"}',
        'SPEEDBOAT',
        'ACTIVE',
        'Sea Ray',
        'SDX 270',
        2022,
        27.00,
        8,
        0,
        0,
        '550e8400-e29b-41d4-a716-446655440005',
        400.00,
        370.00,
        320.00,
        2000.00,
        true,
        100.00,
        92.00,
        80.00,
        500.00,
        'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80',
        4.7,
        6,
        28
    );

-- Insert boat images
INSERT INTO boat_images (id, boat_id, image_url, alt_text_i18n, display_order, is_primary) VALUES
    ('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80', '{"en": "Luxury Catamaran", "pt-BR": "Catamarã de Luxo", "pt-PT": "Catamarã de Luxo", "es": "Catamarán de Lujo"}', 0, true),
    ('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80', '{"en": "Deck View", "pt-BR": "Vista do Deck", "pt-PT": "Vista do Deck", "es": "Vista de Cubierta"}', 1, false),
    ('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', '{"en": "Sailboat", "pt-BR": "Veleiro", "pt-PT": "Veleiro", "es": "Velero"}', 0, true),
    ('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80', '{"en": "Speedboat", "pt-BR": "Lancha", "pt-PT": "Lancha", "es": "Lancha"}', 0, true);

-- Insert boat amenities
INSERT INTO boat_amenities (boat_id, amenity_id) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'),
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002'),
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003'),
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005'),
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440006'),
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440007'),
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010'),
    ('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'),
    ('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003'),
    ('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440008'),
    ('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001'),
    ('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003'),
    ('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007');

-- Insert sample reviews
INSERT INTO reviews (id, boat_id, customer_id, rating, title, comment, is_verified) VALUES
    ('a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 5, 'Amazing experience!', 'The catamaran was absolutely beautiful and the captain was very professional. Highly recommend!', true),
    ('a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 5, 'Perfect for groups', 'We had a fantastic time celebrating my birthday. The boat was spacious and well-equipped.', true),
    ('a50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 5, 'Romantic sunset cruise', 'Beautiful sailboat, perfect for a romantic evening. Will definitely book again!', true),
    ('a50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 4, 'Exciting ride!', 'Great speedboat, very thrilling experience exploring Rio''s coastline.', true);
