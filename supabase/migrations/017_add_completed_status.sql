-- Add 'completed' status to listing_status enum
ALTER TYPE listing_status ADD VALUE 'completed';  -- 거래완료 (transaction completed)