-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'user');
CREATE TYPE property_type AS ENUM ('office', 'retail', 'whole_building', 'residential', 'etc');
CREATE TYPE listing_status AS ENUM ('active', 'hidden', 'archived');
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'done');
CREATE TYPE inquiry_source AS ENUM ('web', 'map', 'list');

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    name TEXT,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stations table (지하철역)
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    line TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regions table (행정동)
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    sido TEXT NOT NULL,
    sigungu TEXT NOT NULL,
    dong TEXT NOT NULL,
    polygon GEOGRAPHY(POLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme categories
CREATE TABLE theme_categories (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    label_ko TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table (매물)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price_deposit BIGINT, -- 보증금 (만원 단위)
    price_monthly BIGINT, -- 월세 (만원 단위)
    price_maintenance BIGINT, -- 관리비 (원 단위)
    exclusive_m2 DECIMAL(10,2), -- 전용면적(㎡)
    supply_m2 DECIMAL(10,2), -- 공급면적(㎡)
    pyeong_exclusive DECIMAL(10,2) GENERATED ALWAYS AS (exclusive_m2 / 3.305785) STORED, -- 전용(평)
    pyeong_supply DECIMAL(10,2) GENERATED ALWAYS AS (supply_m2 / 3.305785) STORED, -- 공급(평)
    floor INT,
    floors_total INT,
    property_type property_type DEFAULT 'office',
    status listing_status DEFAULT 'active',
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address_road TEXT,
    address_jibun TEXT,
    near_boulevard BOOLEAN DEFAULT FALSE,
    built_year INT,
    tags TEXT[],
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing images
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    width INT,
    height INT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing-station relations
CREATE TABLE listing_stations (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    station_id INT REFERENCES stations(id) ON DELETE CASCADE,
    distance_m INT,
    PRIMARY KEY (listing_id, station_id)
);

-- Listing-region relations
CREATE TABLE listing_regions (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, region_id)
);

-- Listing-theme relations
CREATE TABLE listing_themes (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    theme_id INT REFERENCES theme_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, theme_id)
);

-- Inquiries
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    source inquiry_source DEFAULT 'web',
    assigned_to UUID REFERENCES profiles(id),
    status inquiry_status DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, listing_id)
);

-- Saved searches
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    params JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recently viewed
CREATE TABLE recently_viewed (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, listing_id)
);

-- Korean text processing functions

-- Function to extract Korean initial consonants (초성)
CREATE OR REPLACE FUNCTION to_choseong(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT := '';
    char_code INT;
    initial_index INT;
BEGIN
    FOR i IN 1..length(input_text) LOOP
        char_code := ascii(substring(input_text, i, 1));

        -- Korean Unicode range: 0xAC00 to 0xD7A3
        IF char_code >= 44032 AND char_code <= 55203 THEN
            initial_index := ((char_code - 44032) / 588);
            -- Map to initial consonant
            result := result ||
                CASE initial_index
                    WHEN 0 THEN 'ㄱ'
                    WHEN 1 THEN 'ㄲ'
                    WHEN 2 THEN 'ㄴ'
                    WHEN 3 THEN 'ㄷ'
                    WHEN 4 THEN 'ㄸ'
                    WHEN 5 THEN 'ㄹ'
                    WHEN 6 THEN 'ㅁ'
                    WHEN 7 THEN 'ㅂ'
                    WHEN 8 THEN 'ㅃ'
                    WHEN 9 THEN 'ㅅ'
                    WHEN 10 THEN 'ㅆ'
                    WHEN 11 THEN 'ㅇ'
                    WHEN 12 THEN 'ㅈ'
                    WHEN 13 THEN 'ㅉ'
                    WHEN 14 THEN 'ㅊ'
                    WHEN 15 THEN 'ㅋ'
                    WHEN 16 THEN 'ㅌ'
                    WHEN 17 THEN 'ㅍ'
                    WHEN 18 THEN 'ㅎ'
                END;
        ELSE
            result := result || substring(input_text, i, 1);
        END IF;
    END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate Korean-English QWERTY keyboard variants
CREATE OR REPLACE FUNCTION ko_en_qwerty_variants(input_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
    ko_to_en JSONB := '{
        "ㅂ":"q","ㅈ":"w","ㄷ":"e","ㄱ":"r","ㅅ":"t","ㅛ":"y","ㅕ":"u","ㅑ":"i","ㅐ":"o","ㅔ":"p",
        "ㅁ":"a","ㄴ":"s","ㅇ":"d","ㄹ":"f","ㅎ":"g","ㅗ":"h","ㅓ":"j","ㅏ":"k","ㅣ":"l",
        "ㅋ":"z","ㅌ":"x","ㅊ":"c","ㅍ":"v","ㅠ":"b","ㅜ":"n","ㅡ":"m"
    }';
    en_to_ko JSONB := '{
        "q":"ㅂ","w":"ㅈ","e":"ㄷ","r":"ㄱ","t":"ㅅ","y":"ㅛ","u":"ㅕ","i":"ㅑ","o":"ㅐ","p":"ㅔ",
        "a":"ㅁ","s":"ㄴ","d":"ㅇ","f":"ㄹ","g":"ㅎ","h":"ㅗ","j":"ㅓ","k":"ㅏ","l":"ㅣ",
        "z":"ㅋ","x":"ㅌ","c":"ㅊ","v":"ㅍ","b":"ㅠ","n":"ㅜ","m":"ㅡ"
    }';
    variants TEXT[];
BEGIN
    variants := ARRAY[input_text];
    -- Add more sophisticated conversion logic here if needed
    RETURN variants;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Search vector creation function
CREATE OR REPLACE FUNCTION make_search_vector(name TEXT, address TEXT, tags TEXT[])
RETURNS tsvector AS $$
BEGIN
    RETURN to_tsvector('korean',
        COALESCE(name, '') || ' ' ||
        COALESCE(address, '') || ' ' ||
        COALESCE(array_to_string(tags, ' '), '')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Materialized view for search
CREATE MATERIALIZED VIEW listings_search AS
SELECT
    l.id AS listing_id,
    make_search_vector(l.title, l.address_road || ' ' || l.address_jibun, l.tags) AS search_text,
    unaccent(l.title) AS name_norm,
    unaccent(l.address_road || ' ' || l.address_jibun) AS addr_norm,
    to_choseong(l.title || ' ' || COALESCE(l.address_road, '') || ' ' || COALESCE(l.address_jibun, '')) AS choseong_key
FROM listings l
WHERE l.status = 'active';

-- Indexes
CREATE INDEX idx_listings_location ON listings USING GIST(location);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_price_deposit ON listings(price_deposit);
CREATE INDEX idx_listings_price_monthly ON listings(price_monthly);
CREATE INDEX idx_listings_pyeong_exclusive ON listings(pyeong_exclusive);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_tags ON listings USING GIN(tags);

CREATE INDEX idx_stations_location ON stations USING GIST(location);
CREATE INDEX idx_regions_polygon ON regions USING GIST(polygon);

CREATE INDEX idx_listings_search_text ON listings_search USING GIN(search_text);
CREATE INDEX idx_listings_search_name ON listings_search USING GIN(name_norm gin_trgm_ops);
CREATE INDEX idx_listings_search_addr ON listings_search USING GIN(addr_norm gin_trgm_ops);
CREATE INDEX idx_listings_search_choseong ON listings_search USING GIN(choseong_key gin_trgm_ops);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Refresh search view trigger
CREATE OR REPLACE FUNCTION refresh_listings_search()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY listings_search;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_search_on_listing_change
AFTER INSERT OR UPDATE OR DELETE ON listings
FOR EACH STATEMENT EXECUTE FUNCTION refresh_listings_search();

-- Helper function to find nearby stations
CREATE OR REPLACE FUNCTION find_nearby_stations(
    listing_location GEOGRAPHY,
    max_distance_m INT DEFAULT 1000
) RETURNS TABLE(station_id INT, distance_m INT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        ST_Distance(s.location, listing_location)::INT AS distance_m
    FROM stations s
    WHERE ST_DWithin(s.location, listing_location, max_distance_m)
    ORDER BY distance_m;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-populate listing_stations
CREATE OR REPLACE FUNCTION auto_populate_listing_stations()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete existing relations
    DELETE FROM listing_stations WHERE listing_id = NEW.id;

    -- Insert nearby stations
    INSERT INTO listing_stations (listing_id, station_id, distance_m)
    SELECT NEW.id, station_id, distance_m
    FROM find_nearby_stations(NEW.location, 1000)
    LIMIT 3;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_stations_on_listing_insert
AFTER INSERT OR UPDATE OF location ON listings
FOR EACH ROW EXECUTE FUNCTION auto_populate_listing_stations();