-- Insert sample trades
INSERT INTO trades (trade_date, symbol, trade_type, lot_size, entry_price, exit_price, profit_loss, status, notes) VALUES
('2024-01-15', 'AAPL', 'BUY', 100, 185.50, 190.25, 475.00, 'CLOSED', 'Strong earnings report'),
('2024-01-16', 'GOOGL', 'BUY', 50, 142.30, 145.80, 175.00, 'CLOSED', 'AI momentum'),
('2024-01-17', 'TSLA', 'SELL', 75, 248.90, 245.20, 277.50, 'CLOSED', 'Overvalued position'),
('2024-01-18', 'MSFT', 'BUY', 80, 405.60, 410.30, 376.00, 'CLOSED', 'Cloud growth'),
('2024-01-19', 'NVDA', 'BUY', 25, 875.20, 892.40, 430.00, 'CLOSED', 'GPU demand'),
('2024-01-22', 'AMZN', 'BUY', 60, 155.80, NULL, 0, 'OPEN', 'E-commerce recovery'),
('2024-01-23', 'META', 'SELL', 40, 485.30, NULL, 0, 'OPEN', 'Regulatory concerns');
