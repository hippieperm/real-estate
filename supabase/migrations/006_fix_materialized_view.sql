-- listings_search materialized view에 고유 인덱스 추가
-- CONCURRENTLY 새로고침을 위해 필요

-- 기존 인덱스들 확인 후 고유 인덱스 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_search_listing_id ON listings_search (listing_id);

-- materialized view 새로고침 함수 수정
CREATE OR REPLACE FUNCTION refresh_listings_search()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY listings_search;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
