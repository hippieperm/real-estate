-- RLS 정책 설정

-- 1. listings 테이블에 대한 정책 추가

-- 모든 사용자가 읽기 가능
CREATE POLICY "Enable read access for all users" ON "public"."listings"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Service role은 모든 작업 가능
CREATE POLICY "Enable all access for service role" ON "public"."listings"
AS PERMISSIVE FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 또는 RLS를 완전히 비활성화 (개발 환경에서만 권장)
-- ALTER TABLE listings DISABLE ROW LEVEL SECURITY;