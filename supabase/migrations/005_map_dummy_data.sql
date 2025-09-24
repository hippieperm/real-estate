-- 지도 페이지용 더미 데이터 추가
-- 서울 주요 지역의 실제 좌표를 사용한 매물 데이터

-- 서울 주요 지역 좌표 (위도, 경도)
-- 강남구: 37.5172, 127.0473
-- 서초구: 37.4837, 127.0324
-- 송파구: 37.5145, 127.1058
-- 마포구: 37.5663, 126.9019
-- 용산구: 37.5384, 126.9654
-- 중구: 37.5636, 126.9970
-- 영등포구: 37.5264, 126.8962
-- 성동구: 37.5633, 127.0366
-- 광진구: 37.5384, 127.0823
-- 성북구: 37.5894, 127.0167

-- 매물 더미 데이터 삽입
INSERT INTO listings (
    code,
    title,
    description,
    price_deposit,
    price_monthly,
    price_maintenance,
    exclusive_m2,
    supply_m2,
    floor,
    floors_total,
    property_type,
    location,
    address_road,
    address_jibun,
    near_boulevard,
    built_year,
    tags,
    created_at
) VALUES 
-- 강남구 매물들
('GN001', '강남역 프리미엄 오피스', '강남역 도보 5분 거리의 최고급 오피스텔', 50000, 500, 150000, 165.3, 198.4, 15, 25, 'office', ST_GeogFromText('POINT(127.0276 37.4979)'), '서울특별시 강남구 테헤란로 123', '서울특별시 강남구 역삼동 123-45', true, 2020, ARRAY['강남역', '지하철', '주차장'], NOW()),
('GN002', '논현동 상가', '논현동 번화가 상가 건물', 80000, 800, 200000, 99.2, 132.1, 3, 8, 'retail', ST_GeogFromText('POINT(127.0219 37.5115)'), '서울특별시 강남구 논현로 456', '서울특별시 강남구 논현동 456-78', true, 2018, ARRAY['논현동', '상가', '번화가'], NOW()),
('GN003', '삼성동 통건물', '삼성동 코엑스 근처 통건물', 200000, 0, 500000, 495.9, 595.1, 1, 5, 'whole_building', ST_GeogFromText('POINT(127.0630 37.5125)'), '서울특별시 강남구 영동대로 789', '서울특별시 강남구 삼성동 789-12', true, 2019, ARRAY['삼성동', '코엑스', '통건물'], NOW()),
('GN004', '역삼동 주택형사무실', '역삼동 조용한 주택가 사무실', 30000, 300, 100000, 66.1, 82.6, 2, 4, 'residential', ST_GeogFromText('POINT(127.0390 37.5000)'), '서울특별시 강남구 역삼로 321', '서울특별시 강남구 역삼동 321-54', false, 2021, ARRAY['역삼동', '주택가', '조용함'], NOW()),

-- 서초구 매물들
('SC001', '서초역 오피스', '서초역 도보 3분 거리 오피스', 60000, 600, 180000, 132.2, 165.3, 12, 20, 'office', ST_GeogFromText('POINT(127.0324 37.4837)'), '서울특별시 서초구 서초대로 654', '서울특별시 서초구 서초동 654-87', true, 2019, ARRAY['서초역', '지하철', '오피스'], NOW()),
('SC002', '방배동 상가', '방배동 상업지구 상가', 45000, 450, 120000, 82.6, 99.2, 2, 6, 'retail', ST_GeogFromText('POINT(127.0036 37.4764)'), '서울특별시 서초구 방배로 987', '서울특별시 서초구 방배동 987-65', false, 2017, ARRAY['방배동', '상가', '상업지구'], NOW()),

-- 송파구 매물들
('SP001', '잠실역 오피스텔', '잠실역 도보 7분 거리 오피스텔', 70000, 700, 220000, 198.4, 247.9, 18, 30, 'office', ST_GeogFromText('POINT(127.1058 37.5145)'), '서울특별시 송파구 올림픽로 147', '서울특별시 송파구 잠실동 147-25', true, 2020, ARRAY['잠실역', '오피스텔', '올림픽공원'], NOW()),
('SP002', '문정동 상가', '문정동 신도시 상가', 35000, 350, 90000, 115.7, 148.8, 1, 4, 'retail', ST_GeogFromText('POINT(127.1200 37.4850)'), '서울특별시 송파구 문정로 258', '서울특별시 송파구 문정동 258-36', false, 2018, ARRAY['문정동', '신도시', '상가'], NOW()),

-- 마포구 매물들
('MP001', '홍대입구역 오피스', '홍대입구역 도보 5분 거리 오피스', 40000, 400, 130000, 148.8, 181.8, 8, 15, 'office', ST_GeogFromText('POINT(126.9019 37.5663)'), '서울특별시 마포구 홍익로 369', '서울특별시 마포구 서교동 369-74', true, 2019, ARRAY['홍대입구역', '홍대', '오피스'], NOW()),
('MP002', '상암동 상가', '상암동 DMC 상가', 55000, 550, 160000, 99.2, 132.1, 3, 10, 'retail', ST_GeogFromText('POINT(126.8962 37.5700)'), '서울특별시 마포구 상암로 741', '서울특별시 마포구 상암동 741-85', true, 2021, ARRAY['상암동', 'DMC', '상가'], NOW()),

-- 용산구 매물들
('YS001', '이촌동 오피스', '이촌동 한강뷰 오피스', 65000, 650, 190000, 165.3, 198.4, 10, 18, 'office', ST_GeogFromText('POINT(126.9654 37.5384)'), '서울특별시 용산구 이촌로 852', '서울특별시 용산구 이촌동 852-96', true, 2020, ARRAY['이촌동', '한강뷰', '오피스'], NOW()),
('YS002', '한남동 통건물', '한남동 프리미엄 통건물', 150000, 0, 400000, 330.6, 413.2, 1, 6, 'whole_building', ST_GeogFromText('POINT(127.0080 37.5400)'), '서울특별시 용산구 한남대로 963', '서울특별시 용산구 한남동 963-47', true, 2019, ARRAY['한남동', '프리미엄', '통건물'], NOW()),

-- 중구 매물들
('JG001', '명동 오피스', '명동 번화가 오피스', 80000, 800, 250000, 198.4, 247.9, 20, 35, 'office', ST_GeogFromText('POINT(126.9970 37.5636)'), '서울특별시 중구 명동길 159', '서울특별시 중구 명동 159-63', true, 2018, ARRAY['명동', '번화가', '오피스'], NOW()),
('JG002', '을지로 상가', '을지로 상업지구 상가', 60000, 600, 180000, 132.2, 165.3, 4, 12, 'retail', ST_GeogFromText('POINT(126.9850 37.5650)'), '서울특별시 중구 을지로 357', '서울특별시 중구 을지로2가 357-84', true, 2017, ARRAY['을지로', '상업지구', '상가'], NOW()),

-- 영등포구 매물들
('YD001', '여의도 오피스', '여의도 금융가 오피스', 90000, 900, 280000, 247.9, 297.5, 25, 40, 'office', ST_GeogFromText('POINT(126.8962 37.5264)'), '서울특별시 영등포구 여의대로 456', '서울특별시 영등포구 여의도동 456-72', true, 2020, ARRAY['여의도', '금융가', '오피스'], NOW()),
('YD002', '문래동 상가', '문래동 상업지구 상가', 30000, 300, 80000, 82.6, 99.2, 2, 8, 'retail', ST_GeogFromText('POINT(126.8950 37.5150)'), '서울특별시 영등포구 문래로 654', '서울특별시 영등포구 문래동 654-91', false, 2016, ARRAY['문래동', '상업지구', '상가'], NOW()),

-- 성동구 매물들
('SD001', '성수동 오피스', '성수동 IT 밸리 오피스', 50000, 500, 150000, 165.3, 198.4, 12, 22, 'office', ST_GeogFromText('POINT(127.0366 37.5633)'), '서울특별시 성동구 성수일로 753', '서울특별시 성동구 성수동 753-28', true, 2021, ARRAY['성수동', 'IT밸리', '오피스'], NOW()),
('SD002', '왕십리 상가', '왕십리역 근처 상가', 35000, 350, 100000, 99.2, 132.1, 3, 9, 'retail', ST_GeogFromText('POINT(127.0350 37.5610)'), '서울특별시 성동구 왕십리로 951', '서울특별시 성동구 하왕십리동 951-46', true, 2018, ARRAY['왕십리', '지하철', '상가'], NOW()),

-- 광진구 매물들
('GJ001', '건대입구역 오피스', '건대입구역 도보 3분 거리 오피스', 45000, 450, 140000, 148.8, 181.8, 15, 25, 'office', ST_GeogFromText('POINT(127.0823 37.5384)'), '서울특별시 광진구 아차산로 258', '서울특별시 광진구 화양동 258-73', true, 2019, ARRAY['건대입구역', '지하철', '오피스'], NOW()),
('GJ002', '구의동 상가', '구의동 상업지구 상가', 25000, 250, 70000, 66.1, 82.6, 2, 6, 'retail', ST_GeogFromText('POINT(127.0850 37.5400)'), '서울특별시 광진구 구의강변로 147', '서울특별시 광진구 구의동 147-52', false, 2017, ARRAY['구의동', '상업지구', '상가'], NOW()),

-- 성북구 매물들
('SB001', '성신여대입구역 오피스', '성신여대입구역 도보 4분 거리 오피스', 40000, 400, 120000, 132.2, 165.3, 10, 18, 'office', ST_GeogFromText('POINT(127.0167 37.5894)'), '서울특별시 성북구 보문로 369', '서울특별시 성북구 보문동 369-85', true, 2020, ARRAY['성신여대입구역', '지하철', '오피스'], NOW()),
('SB002', '안암동 상가', '안암동 대학가 상가', 20000, 200, 60000, 49.6, 66.1, 1, 4, 'retail', ST_GeogFromText('POINT(127.0200 37.5900)'), '서울특별시 성북구 안암로 741', '서울특별시 성북구 안암동 741-29', false, 2016, ARRAY['안암동', '대학가', '상가'], NOW());

-- 매물 이미지 더미 데이터
INSERT INTO listing_images (listing_id, path, sort_order, created_at)
SELECT 
    l.id,
    'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=' || l.title,
    1,
    NOW()
FROM listings l
WHERE l.code IN ('GN001', 'GN002', 'GN003', 'GN004', 'SC001', 'SC002', 'SP001', 'SP002', 'MP001', 'MP002', 'YS001', 'YS002', 'JG001', 'JG002', 'YD001', 'YD002', 'SD001', 'SD002', 'GJ001', 'GJ002', 'SB001', 'SB002');

-- 매물 테마 연결 더미 데이터
INSERT INTO listing_themes (listing_id, theme_id, created_at)
SELECT 
    l.id,
    t.id,
    NOW()
FROM listings l
CROSS JOIN theme_categories t
WHERE l.code IN ('GN001', 'GN002', 'GN003', 'GN004', 'SC001', 'SC002', 'SP001', 'SP002', 'MP001', 'MP002', 'YS001', 'YS002', 'JG001', 'JG002', 'YD001', 'YD002', 'SD001', 'SD002', 'GJ001', 'GJ002', 'SB001', 'SB002')
AND t.key IN ('location', 'transportation', 'facility')
LIMIT 60;

-- 매물 역 연결 더미 데이터 (주요 지하철역과의 거리)
INSERT INTO listing_stations (listing_id, station_id, distance_m, created_at)
SELECT 
    l.id,
    s.id,
    CASE 
        WHEN l.code LIKE 'GN%' THEN 200 + (random() * 300)::int
        WHEN l.code LIKE 'SC%' THEN 300 + (random() * 400)::int
        WHEN l.code LIKE 'SP%' THEN 400 + (random() * 500)::int
        WHEN l.code LIKE 'MP%' THEN 250 + (random() * 350)::int
        WHEN l.code LIKE 'YS%' THEN 350 + (random() * 450)::int
        WHEN l.code LIKE 'JG%' THEN 200 + (random() * 300)::int
        WHEN l.code LIKE 'YD%' THEN 500 + (random() * 600)::int
        WHEN l.code LIKE 'SD%' THEN 300 + (random() * 400)::int
        WHEN l.code LIKE 'GJ%' THEN 200 + (random() * 300)::int
        WHEN l.code LIKE 'SB%' THEN 400 + (random() * 500)::int
        ELSE 500 + (random() * 600)::int
    END,
    NOW()
FROM listings l
CROSS JOIN stations s
WHERE l.code IN ('GN001', 'GN002', 'GN003', 'GN004', 'SC001', 'SC002', 'SP001', 'SP002', 'MP001', 'MP002', 'YS001', 'YS002', 'JG001', 'JG002', 'YD001', 'YD002', 'SD001', 'SD002', 'GJ001', 'GJ002', 'SB001', 'SB002')
AND s.name IN ('강남역', '서초역', '잠실역', '홍대입구역', '이촌역', '명동역', '여의도역', '성수역', '건대입구역', '성신여대입구역')
LIMIT 200;

-- 매물 지역 연결 더미 데이터
INSERT INTO listing_regions (listing_id, region_id, created_at)
SELECT 
    l.id,
    r.id,
    NOW()
FROM listings l
CROSS JOIN regions r
WHERE l.code IN ('GN001', 'GN002', 'GN003', 'GN004', 'SC001', 'SC002', 'SP001', 'SP002', 'MP001', 'MP002', 'YS001', 'YS002', 'JG001', 'JG002', 'YD001', 'YD002', 'SD001', 'SD002', 'GJ001', 'GJ002', 'SB001', 'SB002')
AND (
    (l.code LIKE 'GN%' AND r.dong IN ('역삼동', '논현동', '삼성동'))
    OR (l.code LIKE 'SC%' AND r.dong IN ('서초동', '방배동'))
    OR (l.code LIKE 'SP%' AND r.dong IN ('잠실동', '문정동'))
    OR (l.code LIKE 'MP%' AND r.dong IN ('서교동', '상암동'))
    OR (l.code LIKE 'YS%' AND r.dong IN ('이촌동', '한남동'))
    OR (l.code LIKE 'JG%' AND r.dong IN ('명동', '을지로2가'))
    OR (l.code LIKE 'YD%' AND r.dong IN ('여의도동', '문래동'))
    OR (l.code LIKE 'SD%' AND r.dong IN ('성수동', '하왕십리동'))
    OR (l.code LIKE 'GJ%' AND r.dong IN ('화양동', '구의동'))
    OR (l.code LIKE 'SB%' AND r.dong IN ('보문동', '안암동'))
)
LIMIT 50;
