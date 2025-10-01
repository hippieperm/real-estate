-- Add latitude and longitude columns for easier access
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Update existing records to populate lat/lng from location
UPDATE listings
SET
  latitude = ST_Y(location::geometry),
  longitude = ST_X(location::geometry)
WHERE location IS NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_listings_lat_lng ON listings(latitude, longitude);
