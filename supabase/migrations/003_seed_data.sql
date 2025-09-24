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

-- Note: profiles, listings, and inquiries data will be created when users register
-- and agents create listings through the application interface

-- Refresh materialized view
REFRESH MATERIALIZED VIEW listings_search;