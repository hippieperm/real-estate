-- Seed theme categories
INSERT INTO theme_categories (key, label_ko, sort_order) VALUES
('below_market', '#시세이하', 1),
('ground_retail', '#1층/리테일', 2),
('prime_office', '#프라임 오피스', 3),
('interior', '#인테리어', 4),
('whole_building', '#통건물', 5),
('academy_hospital', '#학원/병원', 6),
('basement_studio', '#지하/스튜디오', 7),
('residential_office', '#주택형 사무실', 8),
('main_road', '#대로변 사무실', 9),
('station_area', '#역세권', 10),
('terrace', '#테라스', 11),
('new_first', '#신축 첫임대', 12),
('housing', '#주택', 13);

-- Seed stations (Seoul major stations)
INSERT INTO stations (name, line, location) VALUES
('강남역', '2호선', ST_GeogFromText('POINT(127.027619 37.497942)')),
('역삼역', '2호선', ST_GeogFromText('POINT(127.036456 37.500622)')),
('삼성역', '2호선', ST_GeogFromText('POINT(127.063197 37.508844)')),
('선릉역', '2호선', ST_GeogFromText('POINT(127.049063 37.504503)')),
('논현역', '7호선', ST_GeogFromText('POINT(127.021456 37.511093)')),
('신논현역', '9호선', ST_GeogFromText('POINT(127.025304 37.504598)')),
('잠실역', '2호선', ST_GeogFromText('POINT(127.100162 37.513312)')),
('건대입구역', '2호선', ST_GeogFromText('POINT(127.070602 37.540693)')),
('성수역', '2호선', ST_GeogFromText('POINT(127.056037 37.544581)')),
('왕십리역', '2호선', ST_GeogFromText('POINT(127.037732 37.561533)'));

-- Seed regions (Seoul districts)
INSERT INTO regions (sido, sigungu, dong, polygon) VALUES
('서울특별시', '강남구', '역삼동', ST_GeogFromText('POLYGON((127.033 37.495, 127.043 37.495, 127.043 37.505, 127.033 37.505, 127.033 37.495))')),
('서울특별시', '강남구', '논현동', ST_GeogFromText('POLYGON((127.018 37.507, 127.028 37.507, 127.028 37.517, 127.018 37.517, 127.018 37.507))')),
('서울특별시', '강남구', '삼성동', ST_GeogFromText('POLYGON((127.058 37.505, 127.068 37.505, 127.068 37.515, 127.058 37.515, 127.058 37.505))')),
('서울특별시', '서초구', '서초동', ST_GeogFromText('POLYGON((127.020 37.485, 127.030 37.485, 127.030 37.495, 127.020 37.495, 127.020 37.485))')),
('서울특별시', '송파구', '잠실동', ST_GeogFromText('POLYGON((127.095 37.508, 127.105 37.508, 127.105 37.518, 127.095 37.518, 127.095 37.508))')),
('서울특별시', '광진구', '건대입구', ST_GeogFromText('POLYGON((127.065 37.535, 127.075 37.535, 127.075 37.545, 127.065 37.545, 127.065 37.535))')),
('서울특별시', '성동구', '성수동', ST_GeogFromText('POLYGON((127.051 37.539, 127.061 37.539, 127.061 37.549, 127.051 37.549, 127.051 37.539))')),
('서울특별시', '마포구', '상암동', ST_GeogFromText('POLYGON((126.885 37.575, 126.895 37.575, 126.895 37.585, 126.885 37.585, 126.885 37.575))')),
('서울특별시', '중구', '을지로', ST_GeogFromText('POLYGON((126.985 37.560, 126.995 37.560, 126.995 37.570, 126.985 37.570, 126.985 37.560))')),
('서울특별시', '종로구', '종로', ST_GeogFromText('POLYGON((126.975 37.565, 126.985 37.565, 126.985 37.575, 126.975 37.575, 126.975 37.565))'));

-- Create test agent profile
INSERT INTO profiles (id, role, name, phone, company) VALUES
('11111111-1111-1111-1111-111111111111', 'agent', '김에이전트', '010-1234-5678', '알파카 부동산')
ON CONFLICT (id) DO NOTHING;

-- Seed sample listings
DO $$
DECLARE
    agent_id UUID := '11111111-1111-1111-1111-111111111111';
    listing_id UUID;
    station_record RECORD;
    region_record RECORD;
    theme_record RECORD;
    i INT;
BEGIN
    FOR i IN 1..50 LOOP
        listing_id := uuid_generate_v4();

        INSERT INTO listings (
            id, code, title, description,
            price_deposit, price_monthly, price_maintenance,
            exclusive_m2, supply_m2,
            floor, floors_total, property_type, status,
            location, address_road, address_jibun,
            near_boulevard, built_year, tags, created_by
        ) VALUES (
            listing_id,
            'AL' || LPAD(i::text, 6, '0'),
            CASE
                WHEN i % 5 = 0 THEN '역삼동 프라임 오피스 ' || i || '층'
                WHEN i % 5 = 1 THEN '강남역 인근 신축 사무실 ' || i || '호'
                WHEN i % 5 = 2 THEN '테헤란로 대로변 상가 ' || i || '호'
                WHEN i % 5 = 3 THEN '선릉역 도보 5분 사무실 ' || i || '층'
                ELSE '삼성동 통건물 임대'
            END,
            '깔끔한 인테리어와 넓은 공간, 교통 편리한 위치의 사무실입니다. 주차 가능하며 엘리베이터 있습니다.',
            (1000 + i * 500)::BIGINT, -- 보증금
            (50 + i * 10)::BIGINT, -- 월세
            (300000 + i * 10000)::BIGINT, -- 관리비
            (50 + i * 2.5)::DECIMAL, -- 전용면적
            (70 + i * 3.5)::DECIMAL, -- 공급면적
            (i % 15) + 1, -- 층
            20, -- 총층수
            CASE i % 4
                WHEN 0 THEN 'office'::property_type
                WHEN 1 THEN 'retail'::property_type
                WHEN 2 THEN 'whole_building'::property_type
                ELSE 'office'::property_type
            END,
            'active'::listing_status,
            ST_GeogFromText('POINT(' ||
                (127.020 + (random() * 0.08))::text || ' ' ||
                (37.490 + (random() * 0.06))::text || ')'
            ),
            '서울특별시 강남구 테헤란로 ' || (100 + i * 2) || '길 ' || i,
            '서울특별시 강남구 역삼동 ' || (600 + i),
            i % 3 = 0, -- near_boulevard
            2020 - (i % 20), -- built_year
            ARRAY['주차가능', '엘리베이터', '24시간출입'],
            agent_id
        );

        -- Add images
        FOR j IN 1..5 LOOP
            INSERT INTO listing_images (listing_id, path, width, height, sort_order)
            VALUES (
                listing_id,
                'listings/' || listing_id || '/image_' || j || '.jpg',
                1920, 1080, j
            );
        END LOOP;

        -- Add themes (random 1-3 themes)
        FOR theme_record IN (
            SELECT id FROM theme_categories
            ORDER BY RANDOM()
            LIMIT 1 + (RANDOM() * 2)::INT
        ) LOOP
            INSERT INTO listing_themes (listing_id, theme_id)
            VALUES (listing_id, theme_record.id);
        END LOOP;
    END LOOP;
END $$;

-- Sample inquiries
INSERT INTO inquiries (listing_id, name, phone, message, source, status) VALUES
((SELECT id FROM listings LIMIT 1), '김고객', '010-2222-3333', '이 매물 아직 있나요?', 'web', 'new'),
((SELECT id FROM listings OFFSET 1 LIMIT 1), '이고객', '010-3333-4444', '직접 보고 싶습니다', 'map', 'new'),
((SELECT id FROM listings OFFSET 2 LIMIT 1), '박고객', '010-4444-5555', '가격 협상 가능한가요?', 'list', 'new');

-- Refresh materialized view
REFRESH MATERIALIZED VIEW listings_search;