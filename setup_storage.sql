-- Supabase Storage 버킷 설정 SQL
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요

-- 1. Storage 버킷 생성 (이미 존재하는 경우 업데이트)
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

-- 2. 기존 Storage 정책 삭제 (있으면)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- 3. Storage 정책 재생성
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'listing-images'
);

CREATE POLICY "Authenticated users can delete images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'listing-images'
);

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
DROP POLICY IF EXISTS "Authenticated users can delete listing images" ON public.listing_images;

-- 7. RLS 정책 재생성
-- 모든 사용자가 이미지 정보를 볼 수 있음
CREATE POLICY "Anyone can view listing images" ON public.listing_images
FOR SELECT USING (true);

-- 인증된 사용자만 이미지 정보 추가 가능
CREATE POLICY "Authenticated users can insert listing images" ON public.listing_images
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 이미지 정보 삭제 가능
CREATE POLICY "Authenticated users can delete listing images" ON public.listing_images
FOR DELETE USING (auth.role() = 'authenticated');