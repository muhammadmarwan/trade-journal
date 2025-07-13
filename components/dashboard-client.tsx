"use client"

import { useState, useEffect } from "react"
import { TradingStats } from "@/components/trading-stats"
import { TradingCalendar } from "@/components/trading-calendar"
import { AddTradeForm } from "@/components/add-trade-form"
import { TradesTable } from "@/components/trades-table"
import type { Trade, DailyPnL } from "@/lib/types"
import { getTrades } from "@/lib/actions"

interface DashboardClientProps {
  initialTrades: Trade[]
  dailyPnL: DailyPnL[]
}

export function DashboardClient({ initialTrades, dailyPnL }: DashboardClientProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [tradesForSelectedDate, setTradesForSelectedDate] = useState<Trade[]>(initialTrades)

  useEffect(() => {
    const fetchTrades = async () => {
      const trades = await getTrades(selectedDate || undefined)
      setTradesForSelectedDate(trades)
    }
    fetchTrades()
  }, [selectedDate])

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
  }

  const handleClearDate = () => {
    setSelectedDate(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trading Journal</h1>
            <p className="text-muted-foreground">Track your XAUUSD trades and analyze performance</p>
          </div>
          <AddTradeForm />
        </div>

        <TradingStats trades={tradesForSelectedDate} />

        <div className="grid gap-6 lg:grid-cols-2">
          <TradingCalendar dailyPnL={dailyPnL} onDayClick={handleDayClick} selectedDate={selectedDate} />
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Trades:</span>
                    <span className="ml-2 font-medium text-foreground">{tradesForSelectedDate.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Lot Size:</span>
                    <span className="ml-2 font-medium text-foreground">
                      {tradesForSelectedDate.length > 0
                        ? Math.round(
                            tradesForSelectedDate.reduce((sum, t) => sum + t.lot_size, 0) /
                              tradesForSelectedDate.length,
                          )
                        : 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Best Day:</span>
                    <span className="ml-2 font-medium text-green-500">
                      ${dailyPnL.length > 0 ? Math.max(...dailyPnL.map((d) => d.total_pnl)).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TradesTable trades={tradesForSelectedDate} selectedDate={selectedDate} onClearDate={handleClearDate} />
      </div>
    </div>
  )
}
