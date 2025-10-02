-- Add 'withdrawn' status to listing_status enum
ALTER TYPE listing_status ADD VALUE 'withdrawn';  -- 매물철회 (withdrawn from market)