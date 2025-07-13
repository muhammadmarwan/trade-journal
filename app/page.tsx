import { getTrades, getDailyPnL } from "@/lib/actions"
import { DashboardClient } from "@/components/dashboard-client"

export default async function Dashboard() {
  const [initialTrades, dailyPnL] = await Promise.all([getTrades(), getDailyPnL()])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-6">
        <DashboardClient initialTrades={initialTrades} dailyPnL={dailyPnL} />
      </div>
    </div>
  )
}
