-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types
CREATE TYPE user_role_enum AS ENUM ('CUSTOMER', 'BOAT_OWNER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE boat_type_enum AS ENUM ('SAILBOAT', 'MOTORBOAT', 'CATAMARAN', 'YACHT', 'JETSKI', 'FISHING_BOAT', 'SPEEDBOAT');
CREATE TYPE boat_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');
CREATE TYPE booking_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE currency_enum AS ENUM ('USD', 'EUR', 'GBP', 'BRL');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role_enum NOT NULL DEFAULT 'CUSTOMER',
    preferred_language VARCHAR(10) DEFAULT 'en',
    country VARCHAR(100),
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verification_token VARCHAR(100),
    password_reset_token VARCHAR(100),
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    name_i18n JSONB NOT NULL,
    description_i18n JSONB,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_active ON locations(is_active);
CREATE INDEX idx_locations_name_i18n ON locations USING gin(name_i18n);

-- Boats table
CREATE TABLE boats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_i18n JSONB NOT NULL,
    description_i18n JSONB NOT NULL,
    short_description_i18n JSONB,
    type boat_type_enum NOT NULL,
    status boat_status_enum NOT NULL DEFAULT 'ACTIVE',
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    length_feet DECIMAL(6, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    cabins INTEGER,
    bathrooms INTEGER,
    location_id UUID NOT NULL REFERENCES locations(id),
    price_per_day_usd DECIMAL(10, 2) NOT NULL,
    price_per_day_eur DECIMAL(10, 2) NOT NULL,
    price_per_day_gbp DECIMAL(10, 2) NOT NULL,
    price_per_day_brl DECIMAL(10, 2) NOT NULL,
    captain_required BOOLEAN NOT NULL DEFAULT FALSE,
    captain_price_per_day_usd DECIMAL(10, 2),
    captain_price_per_day_eur DECIMAL(10, 2),
    captain_price_per_day_gbp DECIMAL(10, 2),
    captain_price_per_day_brl DECIMAL(10, 2),
    primary_image_url VARCHAR(500),
    average_rating DECIMAL(3, 2),
    review_count INTEGER NOT NULL DEFAULT 0,
    total_bookings INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_boats_slug ON boats(slug);
CREATE INDEX idx_boats_type ON boats(type);
CREATE INDEX idx_boats_status ON boats(status);
CREATE INDEX idx_boats_location ON boats(location_id);
CREATE INDEX idx_boats_price_usd ON boats(price_per_day_usd);
CREATE INDEX idx_boats_capacity ON boats(capacity);
CREATE INDEX idx_boats_rating ON boats(average_rating DESC);
CREATE INDEX idx_boats_name_i18n ON boats USING gin(name_i18n);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    boat_id UUID NOT NULL REFERENCES boats(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    guest_count INTEGER NOT NULL,
    needs_captain BOOLEAN NOT NULL DEFAULT FALSE,
    currency currency_enum NOT NULL,
    boat_price_per_day DECIMAL(10, 2) NOT NULL,
    captain_price_per_day DECIMAL(10, 2),
    days_count INTEGER NOT NULL,
    extras_total DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_percentage DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    status booking_status_enum NOT NULL DEFAULT 'PENDING',
    customer_notes TEXT,
    admin_notes TEXT,
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_bookings_dates CHECK (end_datetime > start_datetime),
    CONSTRAINT chk_bookings_guest_count CHECK (guest_count > 0)
);

CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_boat ON bookings(boat_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_datetime, end_datetime);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- Boat Images table
CREATE TABLE boat_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boat_id UUID NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text_i18n JSONB,
    caption_i18n JSONB,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_boat_images_boat ON boat_images(boat_id);
CREATE INDEX idx_boat_images_order ON boat_images(boat_id, display_order);

-- Amenities table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_i18n JSONB NOT NULL,
    icon VARCHAR(100),
    category VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_amenities_category ON amenities(category);
CREATE INDEX idx_amenities_name_i18n ON amenities USING gin(name_i18n);

-- Boat Amenities junction table
CREATE TABLE boat_amenities (
    boat_id UUID NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (boat_id, amenity_id)
);

CREATE INDEX idx_boat_amenities_boat ON boat_amenities(boat_id);
CREATE INDEX idx_boat_amenities_amenity ON boat_amenities(amenity_id);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boat_id UUID NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    admin_response TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_reviews_boat ON reviews(boat_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_verified ON reviews(is_verified);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES users(id),
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boats_updated_at BEFORE UPDATE ON boats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boat_images_updated_at BEFORE UPDATE ON boat_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_amenities_updated_at BEFORE UPDATE ON amenities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update boat statistics after review
CREATE OR REPLACE FUNCTION update_boat_stats_after_review()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE boats SET
            average_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE boat_id = NEW.boat_id AND is_verified = TRUE),
            review_count = (SELECT COUNT(*) FROM reviews WHERE boat_id = NEW.boat_id AND is_verified = TRUE)
        WHERE id = NEW.boat_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE boats SET
            average_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE boat_id = OLD.boat_id AND is_verified = TRUE),
            review_count = (SELECT COUNT(*) FROM reviews WHERE boat_id = OLD.boat_id AND is_verified = TRUE)
        WHERE id = OLD.boat_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_boat_stats_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_boat_stats_after_review();

-- Function to update boat booking count
CREATE OR REPLACE FUNCTION update_boat_bookings_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'CONFIRMED' THEN
        UPDATE boats SET total_bookings = total_bookings + 1 WHERE id = NEW.boat_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.status = 'CONFIRMED' AND OLD.status != 'CONFIRMED' THEN
        UPDATE boats SET total_bookings = total_bookings + 1 WHERE id = NEW.boat_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.status != 'CONFIRMED' AND OLD.status = 'CONFIRMED' THEN
        UPDATE boats SET total_bookings = total_bookings - 1 WHERE id = NEW.boat_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_boat_bookings_on_booking
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_boat_bookings_count();
