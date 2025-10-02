-- Add 'in_progress' status to listing_status enum
ALTER TYPE listing_status ADD VALUE 'in_progress';  -- 거래중 (transaction in progress)