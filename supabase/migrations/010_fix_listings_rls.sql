-- Fix listings RLS policy to allow viewing active listings regardless of created_by
DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;

-- Allow anyone to view active listings, regardless of created_by
CREATE POLICY "Anyone can view active listings" ON listings
    FOR SELECT USING (status = 'active');

-- Allow users to view their own listings
CREATE POLICY "Users can view own listings" ON listings
    FOR SELECT USING (created_by = auth.uid());

-- Allow agents and admins to view all listings
CREATE POLICY "Agents and admins can view all listings" ON listings
    FOR SELECT USING (auth_user_role() IN ('agent', 'admin'));
