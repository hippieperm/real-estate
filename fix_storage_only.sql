-- Supabase Storage 버킷만 설정하는 SQL
-- 이미지 업로드가 안되면 이 SQL을 실행하세요

-- 1. Storage 버킷 생성/업데이트
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. 기존 Storage 정책 모두 삭제
DO $$ 
BEGIN
    -- 모든 관련 정책 삭제 시도
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
    DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 3. 새로운 간단한 정책 생성 (모든 작업 허용)
-- 공개 읽기 허용
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-images');

-- 모든 사용자 업로드 허용 (테스트용)
CREATE POLICY "Allow all uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'listing-images');

-- 모든 사용자 삭제 허용 (테스트용)
CREATE POLICY "Allow all deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'listing-images');

-- 모든 사용자 업데이트 허용 (테스트용)
CREATE POLICY "Allow all updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'listing-images');