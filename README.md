# 알파카 리스 (Alpaca Lease)

프라임 오피스 및 상가 임대 전문 플랫폼 - Supabase 백엔드 + Next.js 15 (App Router) 기반

## 🚀 주요 기능

### 🏢 매물 관리
- **지도 검색**: Kakao Maps 기반 지도에서 매물 검색 및 클러스터링
- **목록 검색**: 다양한 필터와 정렬 옵션으로 매물 검색
- **상세 정보**: 이미지 갤러리, 가격/면적 정보, 주변 교통편 안내
- **테마별 분류**: #시세이하, #역세권, #프라임 오피스 등 테마 기반 검색

### 🔍 검색 기능
- **텍스트 검색**: PostgreSQL pg_trgm 퍼지 검색 + 한글 초성 검색
- **지역 검색**: 지하철역별, 행정동별 매물 검색
- **고급 필터**: 가격, 면적, 층수, 매물 유형 등 다중 필터
- **지오 검색**: PostGIS 기반 위치 기반 검색

### 📱 사용자 경험
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **빠른 로딩**: Next.js 15 App Router + Suspense 활용
- **직관적 UI**: shadcn/ui 기반 일관된 디자인 시스템

### 📊 관리자 기능
- **매물 관리**: CRUD 작업, 이미지 업로드, 상태 관리
- **문의 관리**: 고객 문의 처리 및 상태 추적
- **권한 관리**: Admin/Agent/User 역할 기반 접근 제어

## 🛠 기술 스택

### Backend
- **Supabase**: PostgreSQL 15+ 데이터베이스, Auth, Storage
- **PostGIS**: 지리 정보 시스템 및 위치 기반 검색
- **RLS**: Row Level Security로 데이터 보안
- **Edge Functions**: 서버리스 함수

### Frontend
- **Next.js 15**: App Router, Server Components, Server Actions
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **shadcn/ui**: 재사용 가능한 컴포넌트
- **React Hook Form + Zod**: 폼 관리 및 검증
- **TanStack Query**: 서버 상태 관리

### 지도 & 검색
- **Kakao Maps JS SDK**: 한국 특화 지도 서비스
- **PostgreSQL Full-Text Search**: 고성능 텍스트 검색
- **한글 초성 검색**: 커스텀 함수로 초성 검색 지원

## 📦 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone <repository-url>
cd alpaca-lease
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
# 또는
pnpm install
\`\`\`

### 3. 환경 변수 설정
\`.env.example\`을 복사하여 \`.env.local\` 생성:

\`\`\`bash
cp .env.example .env.local
\`\`\`

필수 환경 변수:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Kakao Maps
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_javascript_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 4. Supabase 설정

#### 4.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 URL과 anon key를 환경 변수에 설정

#### 4.2 확장 기능 활성화
Supabase SQL Editor에서 실행:
\`\`\`sql
-- 필수 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
\`\`\`

#### 4.3 데이터베이스 마이그레이션
\`\`\`bash
# SQL 파일 직접 실행 (Supabase SQL Editor에서)
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_rls_policies.sql
# 3. supabase/migrations/003_seed_data.sql
\`\`\`

### 5. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

사이트가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## ✅ 완료된 기능

### 🗄 데이터베이스
- ✅ PostGIS 확장 + 지리 정보 스키마
- ✅ 한글 초성 검색 함수 (to_choseong)
- ✅ 텍스트 검색 최적화 (pg_trgm)
- ✅ RLS 정책 (역할 기반 접근 제어)
- ✅ 시드 데이터 (테마, 역, 지역, 매물 50개)

### 🎨 프론트엔드
- ✅ 홈페이지 (히어로, 테마별 매물, 평형별 최신 매물)
- ✅ 지도 검색 (Kakao Maps + 필터 + 마커 클러스터링)
- ✅ 목록 검색 (다중 필터 + 정렬 + 무한 스크롤)
- ✅ 매물 상세 (이미지 갤러리 + 상세 정보 + 유사 매물)
- ✅ 문의하기 (폼 + 검증)
- ✅ 지하철역별 검색

### 🔧 API
- ✅ 검색 API (/api/search) - 다중 필터 지원
- ✅ 매물 상세 API (/api/listings/[id])
- ✅ 문의 API (/api/inquiries)

### 🎨 UI/UX
- ✅ shadcn/ui 기반 디자인 시스템
- ✅ 반응형 레이아웃
- ✅ Loading states, Error handling
- ✅ 한국어 현지화

## 🚀 실행 방법

1. **환경 설정**:
   ```bash
   cd alpaca-lease
   cp .env.example .env.local
   npm install
   ```

2. **Supabase 설정**:
   - Supabase 프로젝트 생성
   - SQL Editor에서 마이그레이션 파일 순서대로 실행:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_rls_policies.sql`
     - `supabase/migrations/003_seed_data.sql`

3. **환경 변수 입력** (`.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_maps_key
   ```

4. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

## 📊 데이터베이스 구조

### 핵심 테이블
- **listings**: 매물 정보 (50개 샘플 데이터)
- **theme_categories**: 13개 테마 (#시세이하, #역세권 등)
- **stations**: 10개 주요 지하철역
- **regions**: 10개 행정동
- **inquiries**: 고객 문의

### 검색 최적화
- PostGIS 지리 인덱스
- pg_trgm 텍스트 검색 인덱스
- 한글 초성 검색 지원
- Materialized view로 검색 성능 향상

## 🔍 주요 기능 데모

1. **홈페이지**: 히어로 섹션 + 테마별 매물 + 평형별 최신 매물
2. **지도 검색**: 카카오맵 + 좌측 필터 + 마커 클러스터링
3. **목록 검색**: 그리드/리스트 뷰 + 고급 필터 + 정렬
4. **매물 상세**: 이미지 갤러리 + 상세 정보 + 문의 모달
5. **문의하기**: 맞춤형 문의 폼 + 실시간 검증

---

**알파카 리스** - 프라임 오피스 임대의 새로운 기준 🦙
