-- Function to update listing location
CREATE OR REPLACE FUNCTION update_listing_location(
  listing_id UUID,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE listings
  SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
  WHERE id = listing_id;
END;
$$;