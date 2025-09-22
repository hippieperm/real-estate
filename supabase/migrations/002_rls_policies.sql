-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role FROM profiles WHERE id = auth.uid()),
        'user'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (auth_user_role() = 'admin');

CREATE POLICY "New users can create profile" ON profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Stations policies (public read)
CREATE POLICY "Anyone can view stations" ON stations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage stations" ON stations
    FOR ALL USING (auth_user_role() = 'admin');

-- Regions policies (public read)
CREATE POLICY "Anyone can view regions" ON regions
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage regions" ON regions
    FOR ALL USING (auth_user_role() = 'admin');

-- Theme categories policies (public read)
CREATE POLICY "Anyone can view themes" ON theme_categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage themes" ON theme_categories
    FOR ALL USING (auth_user_role() = 'admin');

-- Listings policies
CREATE POLICY "Anyone can view active listings" ON listings
    FOR SELECT USING (status = 'active' OR created_by = auth.uid() OR auth_user_role() IN ('agent', 'admin'));

CREATE POLICY "Agents can create listings" ON listings
    FOR INSERT WITH CHECK (auth_user_role() IN ('agent', 'admin'));

CREATE POLICY "Agents can update own listings" ON listings
    FOR UPDATE USING (created_by = auth.uid() OR auth_user_role() = 'admin');

CREATE POLICY "Agents can delete own listings" ON listings
    FOR DELETE USING (created_by = auth.uid() OR auth_user_role() = 'admin');

-- Listing images policies
CREATE POLICY "Anyone can view listing images" ON listing_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_images.listing_id
            AND (l.status = 'active' OR l.created_by = auth.uid() OR auth_user_role() IN ('agent', 'admin'))
        )
    );

CREATE POLICY "Listing owner can manage images" ON listing_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_images.listing_id
            AND (l.created_by = auth.uid() OR auth_user_role() = 'admin')
        )
    );

-- Listing stations policies (follow listing visibility)
CREATE POLICY "View listing stations" ON listing_stations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_stations.listing_id
            AND (l.status = 'active' OR l.created_by = auth.uid() OR auth_user_role() IN ('agent', 'admin'))
        )
    );

CREATE POLICY "Manage listing stations" ON listing_stations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_stations.listing_id
            AND (l.created_by = auth.uid() OR auth_user_role() = 'admin')
        )
    );

-- Listing regions policies
CREATE POLICY "View listing regions" ON listing_regions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_regions.listing_id
            AND (l.status = 'active' OR l.created_by = auth.uid() OR auth_user_role() IN ('agent', 'admin'))
        )
    );

CREATE POLICY "Manage listing regions" ON listing_regions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_regions.listing_id
            AND (l.created_by = auth.uid() OR auth_user_role() = 'admin')
        )
    );

-- Listing themes policies
CREATE POLICY "View listing themes" ON listing_themes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_themes.listing_id
            AND (l.status = 'active' OR l.created_by = auth.uid() OR auth_user_role() IN ('agent', 'admin'))
        )
    );

CREATE POLICY "Manage listing themes" ON listing_themes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings l
            WHERE l.id = listing_themes.listing_id
            AND (l.created_by = auth.uid() OR auth_user_role() = 'admin')
        )
    );

-- Inquiries policies
CREATE POLICY "Users can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON inquiries
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND name = inquiries.name AND phone = inquiries.phone)
            OR assigned_to = auth.uid()
            OR auth_user_role() IN ('agent', 'admin')
        )
    );

CREATE POLICY "Agents can manage assigned inquiries" ON inquiries
    FOR UPDATE USING (assigned_to = auth.uid() OR auth_user_role() = 'admin');

CREATE POLICY "Admins can manage all inquiries" ON inquiries
    FOR ALL USING (auth_user_role() = 'admin');

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (user_id = auth.uid());

-- Saved searches policies
CREATE POLICY "Users can manage own searches" ON saved_searches
    FOR ALL USING (user_id = auth.uid());

-- Recently viewed policies
CREATE POLICY "Users can manage own history" ON recently_viewed
    FOR ALL USING (user_id = auth.uid());

-- Storage policies (to be configured in Supabase dashboard)
-- listings bucket: public read for images, authenticated upload
-- avatars bucket: public read, user can upload own