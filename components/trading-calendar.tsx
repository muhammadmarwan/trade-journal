"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DailyPnL } from "@/lib/types"

interface TradingCalendarProps {
  dailyPnL: DailyPnL[]
  onDayClick: (date: string) => void
  selectedDate: string | null
}

export function TradingCalendar({ dailyPnL, onDayClick, selectedDate }: TradingCalendarProps) {
  const [displayDate, setDisplayDate] = useState(new Date()) // Date object for current month/year view
  const pnlMap = new Map(dailyPnL.map((day) => [day.date, day]))

  const currentMonth = displayDate.getMonth()
  const currentYear = displayDate.getFullYear()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday of the first week

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      // 6 weeks * 7 days
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return days
  }

  const days = getDaysInMonth(currentYear, currentMonth)

  const handlePrevMonth = () => {
    setDisplayDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setDisplayDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-muted-foreground hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="text-foreground text-lg">
          {monthNames[currentMonth]} {currentYear}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-muted-foreground hover:bg-muted ">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 ml-12 mr-12 mb-10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const dateStr = day.toISOString().split("T")[0]
            const dayData = pnlMap.get(dateStr)
            const isCurrentMonth = day.getMonth() === currentMonth
            const isToday = day.toDateString() === new Date().toDateString()
            const isSelected = selectedDate === dateStr

            return (
              <div
                key={index}
                className={`
                  p-2 min-h-[100px] border rounded-lg transition-colors cursor-pointer
                  ${isCurrentMonth ? "bg-background" : "bg-muted/50"}
                  ${isToday ? "ring-2 ring-primary" : ""}
                  ${isSelected ? "bg-primary/20 border-primary" : "border-border"}
                  hover:bg-muted
                `}
                onClick={() => onDayClick(dateStr)}
              >
                <div className={`text-sm ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>
                  {day.getDate()}
                </div>
                {dayData && (
                  <div className="mt-1">
                    <div
                      className={`text-xs font-medium ${dayData.total_pnl >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      ${dayData.total_pnl.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">{dayData.trade_count} trades</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
