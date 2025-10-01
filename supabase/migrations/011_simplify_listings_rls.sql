-- Simplify listings RLS policies to fix visibility issues
DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;
DROP POLICY IF EXISTS "Users can view own listings" ON listings;
DROP POLICY IF EXISTS "Agents and admins can view all listings" ON listings;

-- Simple policy: anyone can view active listings
CREATE POLICY "Anyone can view active listings" ON listings
    FOR SELECT USING (status = 'active');

-- Allow authenticated users to view their own listings regardless of status
CREATE POLICY "Users can view own listings" ON listings
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND created_by = auth.uid()
    );

-- Allow agents and admins to view all listings
CREATE POLICY "Agents and admins can view all listings" ON listings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('agent', 'admin')
        )
    );

