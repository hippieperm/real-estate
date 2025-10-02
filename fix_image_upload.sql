-- 이미지 업로드 문제 해결을 위한 SQL 스크립트
-- Supabase Dashboard의 SQL Editor에서 실행하세요

-- 1. Storage 버킷 생성/업데이트
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images', 
  'listing-images', 
  true,  -- 공개 버킷으로 설정
  10485760,  -- 10MB 파일 크기 제한
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]  -- 허용된 이미지 타입
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[];

-- 2. 기존 Storage 정책 모두 삭제 (안전하게)
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
    DROP POLICY IF EXISTS "Allow all uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Allow all deletes" ON storage.objects;
    DROP POLICY IF EXISTS "Allow all updates" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
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

-- 4. listing_images 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS public.listing_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    path text NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. listing_images 테이블에 대한 RLS 활성화
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- 6. 기존 RLS 정책 삭제 (있으면)
DROP POLICY IF EXISTS "Anyone can view listing images" ON public.listing_images;
DROP POLICY IF EXISTS "Authenticated users can insert listing images" ON public.listing_images;
DROP POLICY IF EXISTS "Users can update their own listing images" ON public.listing_images;
DROP POLICY IF EXISTS "Users can delete their own listing images" ON public.listing_images;
DROP POLICY IF EXISTS "Agents and admins can manage all listing images" ON public.listing_images;

-- 7. 새로운 간단한 RLS 정책 생성
-- 모든 사용자가 이미지 조회 가능
CREATE POLICY "Anyone can view listing images" ON public.listing_images
  FOR SELECT USING (true);

-- 인증된 사용자가 이미지 삽입 가능
CREATE POLICY "Authenticated users can insert listing images" ON public.listing_images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 모든 사용자가 이미지 업데이트 가능 (테스트용)
CREATE POLICY "Anyone can update listing images" ON public.listing_images
  FOR UPDATE USING (true);

-- 모든 사용자가 이미지 삭제 가능 (테스트용)
CREATE POLICY "Anyone can delete listing images" ON public.listing_images
  FOR DELETE USING (true);

-- 8. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_sort_order ON public.listing_images(listing_id, sort_order);

-- 완료 메시지
SELECT 'Storage 버킷과 정책이 성공적으로 설정되었습니다!' as message;
