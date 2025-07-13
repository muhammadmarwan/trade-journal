export interface Trade {
  id: number
  trade_date: string
  symbol: string
  trade_type: "BUY" | "SELL"
  lot_size: number
  entry_price: number
  exit_price?: number
  profit_loss: number
  status: "OPEN" | "CLOSED"
  notes?: string
  created_at: string
  updated_at: string
}

export interface DailyPnL {
  date: string
  total_pnl: number
  trade_count: number
}
