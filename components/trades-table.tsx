"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Trade } from "@/lib/types"
import { getTrades } from "@/lib/actions"
import { X } from "lucide-react"

function fmt(n?: number | null) {
  return typeof n === "number" && !Number.isNaN(n) ? n.toFixed(2) : "-"
}

interface TradesTableProps {
  trades: Trade[] // Initial trades from server
  selectedDate: string | null
  onClearDate: () => void
}

export function TradesTable({ trades: initialTrades, selectedDate, onClearDate }: TradesTableProps) {
  const [currentTrades, setCurrentTrades] = useState<Trade[]>(initialTrades)

  useEffect(() => {
    const fetchTrades = async () => {
      const fetchedTrades = await getTrades(selectedDate || undefined)
      setCurrentTrades(fetchedTrades)
    }
    fetchTrades()
  }, [selectedDate])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">
          {selectedDate ? `Trades for ${new Date(selectedDate).toLocaleDateString()}` : "Recent Trades"}
        </CardTitle>
        {selectedDate && (
          <Button variant="ghost" size="sm" onClick={onClearDate} className="text-muted-foreground hover:bg-muted">
            Clear Date <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Symbol</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Lot Size</TableHead>
                <TableHead className="text-muted-foreground">Entry</TableHead>
                <TableHead className="text-muted-foreground">Exit</TableHead>
                <TableHead className="text-muted-foreground">P&L</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTrades.length > 0 ? (
                currentTrades.map((trade) => (
                  <TableRow key={trade.id} className="border-border">
                    <TableCell className="text-foreground">{new Date(trade.trade_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium text-foreground">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.trade_type === "BUY" ? "default" : "secondary"}>{trade.trade_type}</Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{trade.lot_size}</TableCell>
                    <TableCell className="text-foreground">${fmt(trade.entry_price)}</TableCell>
                    <TableCell className="text-foreground">
                      {trade.exit_price != null ? `$${fmt(trade.exit_price)}` : "-"}
                    </TableCell>
                    <TableCell className={trade.profit_loss >= 0 ? "text-green-500" : "text-red-500"}>
                      ${fmt(trade.profit_loss)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.status === "CLOSED" ? "default" : "outline"}>{trade.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No trades found for this date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
