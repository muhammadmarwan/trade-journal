import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Trade } from "@/lib/types"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface TradingStatsProps {
  trades: Trade[]
}

export function TradingStats({ trades }: TradingStatsProps) {
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED")
  const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.profit_loss, 0)
  const winningTrades = closedTrades.filter((trade) => trade.profit_loss > 0)
  const losingTrades = closedTrades.filter((trade) => trade.profit_loss < 0)
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
            ${totalPnL.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Winning Trades</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{winningTrades.length}</div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Losing Trades</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{losingTrades.length}</div>
        </CardContent>
      </Card>
    </div>
  )
}
