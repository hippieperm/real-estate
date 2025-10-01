-- Create listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_sort_order ON listing_images(listing_id, sort_order);

-- Enable RLS
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listing_images
-- Anyone can view images
CREATE POLICY "Anyone can view listing images" ON listing_images
  FOR SELECT USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated users can insert listing images" ON listing_images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own listing images
CREATE POLICY "Users can update their own listing images" ON listing_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.created_by = auth.uid()
    )
  );

-- Users can delete their own listing images
CREATE POLICY "Users can delete their own listing images" ON listing_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.created_by = auth.uid()
    )
  );

-- Agents and admins can manage all images
CREATE POLICY "Agents and admins can manage all listing images" ON listing_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('agent', 'admin')
    )
  );

-- Create storage bucket for listing images (manual step required in Supabase Dashboard)
-- Bucket name: listing-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
