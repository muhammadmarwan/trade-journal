-- Create the column only if it does not already exist
ALTER TABLE trades
ADD COLUMN IF NOT EXISTS trade_date DATE;

-- Back-fill any rows that still have NULL
UPDATE trades
SET trade_date = COALESCE(trade_date, created_at::date)
WHERE trade_date IS NULL;
