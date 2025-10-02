-- Update listing_status enum to include new property transaction statuses
-- 매물상태 enum 업데이트: 예약중, 거래중, 거래완료 등 추가

-- IMPORTANT: PostgreSQL requires each enum value to be added in separate transactions
-- Execute these ALTER TYPE statements one by one, not all at once

-- Add new enum values (execute each separately)
ALTER TYPE listing_status ADD VALUE 'available';     -- 매물가능 (available for viewing/rental)

-- Execute this separately:
-- ALTER TYPE listing_status ADD VALUE 'reserved';      -- 예약중 (reserved by potential tenant)

-- Execute this separately:
-- ALTER TYPE listing_status ADD VALUE 'in_progress';   -- 거래중 (transaction in progress)

-- Execute this separately:
-- ALTER TYPE listing_status ADD VALUE 'completed';     -- 거래완료 (transaction completed)

-- Execute this separately:
-- ALTER TYPE listing_status ADD VALUE 'withdrawn';     -- 매물철회 (withdrawn from market)

-- After all enum values are added, optionally update existing data:
-- UPDATE listings SET status = 'available' WHERE status = 'active';

-- Note: We keep the old 'active', 'hidden', 'archived' values for backward compatibility
-- but new listings should use the more specific status values