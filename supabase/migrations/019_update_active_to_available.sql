-- Update existing 'active' listings to 'available' for better clarity
-- 기존 'active' 상태를 'available'로 변경하여 의미를 명확히 함
-- Execute this ONLY after all previous enum values have been added successfully

UPDATE listings SET status = 'available' WHERE status = 'active';