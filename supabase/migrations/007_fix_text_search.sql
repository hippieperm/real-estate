-- 텍스트 검색 설정 수정
-- korean 설정이 없으므로 simple 설정으로 변경

-- make_search_vector 함수 수정
CREATE OR REPLACE FUNCTION make_search_vector(name TEXT, address TEXT, tags TEXT[])
RETURNS tsvector AS $$
BEGIN
    RETURN to_tsvector('simple',
        COALESCE(name, '') || ' ' ||
        COALESCE(address, '') || ' ' ||
        COALESCE(array_to_string(tags, ' '), '')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- to_choseong 함수는 이미 올바르게 정의되어 있으므로 수정하지 않음
-- 기존 함수가 올바르게 작동함
