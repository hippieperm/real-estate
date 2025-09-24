-- 지역별 페이지를 위한 더미 데이터 생성
-- Regions 테이블에 서울 주요 구 데이터 삽입 (기존 데이터와 중복 방지)

-- 서울 주요 구 데이터 삽입 (기존 데이터와 중복되지 않는 것만)
INSERT INTO regions (sido, sigungu, dong, polygon) 
SELECT * FROM (VALUES
-- 강남구 (기존에 없는 동네들)
('서울특별시', '강남구', '청담동', ST_GeogFromText('POLYGON((127.045 37.495, 127.055 37.495, 127.055 37.505, 127.045 37.505, 127.045 37.495))')),
('서울특별시', '강남구', '압구정동', ST_GeogFromText('POLYGON((127.025 37.505, 127.035 37.505, 127.035 37.515, 127.025 37.515, 127.025 37.505))')),
('서울특별시', '강남구', '신사동', ST_GeogFromText('POLYGON((127.015 37.505, 127.025 37.505, 127.025 37.515, 127.015 37.515, 127.015 37.505))')),

-- 서초구
('서울특별시', '서초구', '방배동', ST_GeogFromText('POLYGON((126.995 37.475, 127.005 37.475, 127.005 37.485, 126.995 37.485, 126.995 37.475))')),
('서울특별시', '서초구', '잠원동', ST_GeogFromText('POLYGON((127.005 37.485, 127.015 37.485, 127.015 37.495, 127.005 37.495, 127.005 37.485))')),
('서울특별시', '서초구', '반포동', ST_GeogFromText('POLYGON((126.995 37.485, 127.005 37.485, 127.005 37.495, 126.995 37.495, 126.995 37.485))')),
('서울특별시', '서초구', '내곡동', ST_GeogFromText('POLYGON((127.015 37.465, 127.025 37.465, 127.025 37.475, 127.015 37.475, 127.015 37.465))')),

-- 송파구 (기존에 없는 동네들)
('서울특별시', '송파구', '문정동', ST_GeogFromText('POLYGON((127.105 37.485, 127.115 37.485, 127.115 37.495, 127.105 37.495, 127.105 37.485))')),
('서울특별시', '송파구', '가락동', ST_GeogFromText('POLYGON((127.115 37.485, 127.125 37.485, 127.125 37.495, 127.115 37.495, 127.115 37.485))')),
('서울특별시', '송파구', '석촌동', ST_GeogFromText('POLYGON((127.095 37.495, 127.105 37.495, 127.105 37.505, 127.095 37.505, 127.095 37.495))')),
('서울특별시', '송파구', '방이동', ST_GeogFromText('POLYGON((127.105 37.495, 127.115 37.495, 127.115 37.505, 127.105 37.505, 127.105 37.495))')),
('서울특별시', '송파구', '송파동', ST_GeogFromText('POLYGON((127.085 37.495, 127.095 37.495, 127.095 37.505, 127.085 37.505, 127.085 37.495))')),

-- 마포구 (기존에 없는 동네들)
('서울특별시', '마포구', '홍대', ST_GeogFromText('POLYGON((126.925 37.545, 126.935 37.545, 126.935 37.555, 126.925 37.555, 126.925 37.545))')),
('서울특별시', '마포구', '합정동', ST_GeogFromText('POLYGON((126.915 37.545, 126.925 37.545, 126.925 37.555, 126.915 37.555, 126.915 37.545))')),
('서울특별시', '마포구', '성산동', ST_GeogFromText('POLYGON((126.905 37.555, 126.915 37.555, 126.915 37.565, 126.905 37.565, 126.905 37.555))')),
('서울특별시', '마포구', '공덕동', ST_GeogFromText('POLYGON((126.945 37.535, 126.955 37.535, 126.955 37.545, 126.945 37.545, 126.945 37.535))')),
('서울특별시', '마포구', '대흥동', ST_GeogFromText('POLYGON((126.935 37.545, 126.945 37.545, 126.945 37.555, 126.935 37.555, 126.935 37.545))')),

-- 영등포구
('서울특별시', '영등포구', '여의도', ST_GeogFromText('POLYGON((126.925 37.515, 126.935 37.515, 126.935 37.525, 126.925 37.525, 126.925 37.515))')),
('서울특별시', '영등포구', '영등포동', ST_GeogFromText('POLYGON((126.905 37.515, 126.915 37.515, 126.915 37.525, 126.905 37.525, 126.905 37.515))')),
('서울특별시', '영등포구', '당산동', ST_GeogFromText('POLYGON((126.895 37.525, 126.905 37.525, 126.905 37.535, 126.895 37.535, 126.895 37.525))')),
('서울특별시', '영등포구', '문래동', ST_GeogFromText('POLYGON((126.885 37.515, 126.895 37.515, 126.895 37.525, 126.885 37.525, 126.885 37.515))')),
('서울특별시', '영등포구', '신길동', ST_GeogFromText('POLYGON((126.915 37.505, 126.925 37.505, 126.925 37.515, 126.915 37.515, 126.915 37.505))')),

-- 중구 (기존에 없는 동네들)
('서울특별시', '중구', '명동', ST_GeogFromText('POLYGON((126.985 37.555, 126.995 37.555, 126.995 37.565, 126.985 37.565, 126.985 37.555))')),
('서울특별시', '중구', '회현동', ST_GeogFromText('POLYGON((126.985 37.545, 126.995 37.545, 126.995 37.555, 126.985 37.555, 126.985 37.545))')),
('서울특별시', '중구', '중림동', ST_GeogFromText('POLYGON((126.975 37.555, 126.985 37.555, 126.985 37.565, 126.975 37.565, 126.975 37.555))')),
('서울특별시', '중구', '봉래동', ST_GeogFromText('POLYGON((126.995 37.545, 127.005 37.545, 127.005 37.555, 126.995 37.555, 126.995 37.545))'))
) AS new_regions(sido, sigungu, dong, polygon)
WHERE NOT EXISTS (
    SELECT 1 FROM regions r 
    WHERE r.sido = new_regions.sido 
    AND r.sigungu = new_regions.sigungu 
    AND r.dong = new_regions.dong
);

-- 지역별 통계를 위한 뷰 생성
CREATE OR REPLACE VIEW region_stats AS
SELECT 
    r.sigungu as region_name,
    r.sido as district,
    COUNT(DISTINCT r.id) as dong_count,
    COUNT(l.id) as building_count,
    COALESCE(AVG(l.price_monthly), 0) as avg_price,
    COALESCE(AVG(l.price_deposit), 0) as avg_deposit,
    COUNT(CASE WHEN l.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_listings,
    CASE 
        WHEN COUNT(l.id) > 1000 THEN true 
        ELSE false 
    END as popular
FROM regions r
LEFT JOIN listing_regions lr ON r.id = lr.region_id
LEFT JOIN listings l ON lr.listing_id = l.id AND l.status = 'active'
WHERE r.sido = '서울특별시'
GROUP BY r.sigungu, r.sido
ORDER BY building_count DESC;

-- 지역별 주요 동네 정보를 위한 뷰 생성
CREATE OR REPLACE VIEW region_sub_areas AS
SELECT 
    r.sigungu as region_name,
    r.dong as sub_area_name,
    COUNT(l.id) as listing_count,
    COALESCE(AVG(l.price_monthly), 0) as avg_price
FROM regions r
LEFT JOIN listing_regions lr ON r.id = lr.region_id
LEFT JOIN listings l ON lr.listing_id = l.id AND l.status = 'active'
WHERE r.sido = '서울특별시'
GROUP BY r.sigungu, r.dong
ORDER BY r.sigungu, listing_count DESC;

-- 지역별 매물 샘플 데이터 생성 (실제 매물이 없을 경우를 대비)
-- 이 데이터는 실제 매물이 추가되면 자동으로 업데이트됩니다.

-- 지역별 인기도 및 트렌드 데이터를 위한 테이블 생성
CREATE TABLE IF NOT EXISTS region_trends (
    id SERIAL PRIMARY KEY,
    region_name TEXT NOT NULL,
    month_year TEXT NOT NULL,
    avg_price BIGINT,
    listing_count INT,
    price_trend DECIMAL(5,2), -- 상승률 (%)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(region_name, month_year)
);

-- 지역별 트렌드 더미 데이터 삽입
INSERT INTO region_trends (region_name, month_year, avg_price, listing_count, price_trend) VALUES
('강남구', '2024-01', 850000, 1247, 12.5),
('서초구', '2024-01', 720000, 892, 8.2),
('송파구', '2024-01', 680000, 654, 15.3),
('마포구', '2024-01', 520000, 423, 6.1),
('영등포구', '2024-01', 480000, 387, 4.7),
('중구', '2024-01', 450000, 298, 3.2);

-- 지역별 상세 정보를 위한 함수 생성
CREATE OR REPLACE FUNCTION get_region_details(region_name_param TEXT)
RETURNS TABLE (
    region_name TEXT,
    district TEXT,
    building_count BIGINT,
    avg_price NUMERIC,
    avg_deposit NUMERIC,
    recent_listings BIGINT,
    popular BOOLEAN,
    sub_areas TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rs.region_name,
        rs.district,
        rs.building_count,
        rs.avg_price,
        rs.avg_deposit,
        rs.recent_listings,
        rs.popular,
        ARRAY(
            SELECT rsa.sub_area_name 
            FROM region_sub_areas rsa 
            WHERE rsa.region_name = rs.region_name 
            ORDER BY rsa.listing_count DESC 
            LIMIT 6
        ) as sub_areas
    FROM region_stats rs
    WHERE rs.region_name = region_name_param;
END;
$$ LANGUAGE plpgsql;

-- 지역 검색을 위한 함수 생성
CREATE OR REPLACE FUNCTION search_regions(search_term TEXT)
RETURNS TABLE (
    region_name TEXT,
    district TEXT,
    building_count BIGINT,
    avg_price NUMERIC,
    popular BOOLEAN,
    match_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rs.region_name,
        rs.district,
        rs.building_count,
        rs.avg_price,
        rs.popular,
        CASE 
            WHEN rs.region_name ILIKE '%' || search_term || '%' THEN 'region'
            WHEN rs.district ILIKE '%' || search_term || '%' THEN 'district'
            ELSE 'sub_area'
        END as match_type
    FROM region_stats rs
    WHERE 
        rs.region_name ILIKE '%' || search_term || '%' OR
        rs.district ILIKE '%' || search_term || '%' OR
        EXISTS (
            SELECT 1 FROM region_sub_areas rsa 
            WHERE rsa.region_name = rs.region_name 
            AND rsa.sub_area_name ILIKE '%' || search_term || '%'
        )
    ORDER BY 
        CASE WHEN rs.region_name ILIKE '%' || search_term || '%' THEN 1 ELSE 2 END,
        rs.building_count DESC;
END;
$$ LANGUAGE plpgsql;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_regions_sigungu ON regions(sigungu);
CREATE INDEX IF NOT EXISTS idx_regions_sido ON regions(sido);
CREATE INDEX IF NOT EXISTS idx_region_trends_region ON region_trends(region_name);
CREATE INDEX IF NOT EXISTS idx_region_trends_month ON region_trends(month_year);

-- 뷰 새로고침을 위한 함수
CREATE OR REPLACE FUNCTION refresh_region_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY region_stats;
    -- region_sub_areas는 일반 뷰이므로 새로고침 불필요
END;
$$ LANGUAGE plpgsql;
