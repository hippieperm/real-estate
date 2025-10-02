-- Add 'reserved' status to listing_status enum
ALTER TYPE listing_status ADD VALUE 'reserved';  -- 예약중 (reserved by potential tenant)