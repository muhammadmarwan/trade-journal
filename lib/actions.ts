"use server"

import { sql } from "./db"
import type { Trade, DailyPnL } from "./types"
import { revalidatePath } from "next/cache"

/* ──────────────────────────────────────────────────────────────── */
/*  Helpers                                                        */
/* ──────────────────────────────────────────────────────────────── */
async function ensureColumns() {
  /* Idempotently create all columns the app needs */
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS trade_date  DATE;`

  /* Ensure the legacy "date" column exists and is NOT NULL with a default */
  await sql`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades' AND column_name='date') THEN
            ALTER TABLE trades ADD COLUMN "date" DATE NOT NULL DEFAULT CURRENT_DATE;
        ELSE
            -- If 'date' column exists but is nullable, make it NOT NULL with a default
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades' AND column_name='date' AND is_nullable='YES') THEN
                UPDATE trades SET "date" = COALESCE("date", CURRENT_DATE) WHERE "date" IS NULL;
                ALTER TABLE trades ALTER COLUMN "date" SET NOT NULL;
                ALTER TABLE trades ALTER COLUMN "date" SET DEFAULT CURRENT_DATE;
            END IF;
        END IF;
    END
    $$;
  `

  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS trade_type  VARCHAR(4);`
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS lot_size    INTEGER;`
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS entry_price NUMERIC;`
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS exit_price  NUMERIC;`
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS profit_loss NUMERIC DEFAULT 0;`
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS status      VARCHAR(10) DEFAULT 'CLOSED';`
  await sql`ALTER TABLE trades ADD COLUMN IF NOT EXISTS notes       TEXT;`

  /* Back-fill date columns if they are still null for some reason */
  await sql`
    UPDATE trades
    SET trade_date = COALESCE(trade_date, created_at::date)
    WHERE trade_date IS NULL;
  `

  await sql`
    UPDATE trades
    SET "date" = COALESCE("date", trade_date, created_at::date)
    WHERE "date" IS NULL;
  `

  /* Back-fill profit/loss if exit_price exists. */
  await sql`
    UPDATE trades
    SET profit_loss = CASE
                        WHEN trade_type = 'BUY'
                          THEN (exit_price - entry_price) * lot_size
                        ELSE (entry_price - exit_price) * lot_size
                      END
    WHERE profit_loss IS NULL
      AND exit_price IS NOT NULL;
  `
}

/* ──────────────────────────────────────────────────────────────── */
/*  Queries                                                         */
/* ──────────────────────────────────────────────────────────────── */

export async function getTrades(date?: string): Promise<Trade[]> {
  await ensureColumns()
  let query = sql`
    SELECT
      id,
      COALESCE(trade_date, created_at::date)        AS trade_date,
      symbol,
      trade_type,
      lot_size,
      entry_price::float8                           AS entry_price,
      exit_price::float8                            AS exit_price,
      profit_loss::float8                           AS profit_loss,
      status,
      notes,
      created_at,
      updated_at
    FROM trades
    WHERE symbol = 'XAUUSD'
  `
  if (date) {
    query = sql`${query} AND COALESCE(trade_date, created_at::date) = ${date}::DATE`
  }
  query = sql`${query} ORDER BY COALESCE(trade_date, created_at::date) DESC, created_at DESC`

  const trades = await query
  return trades as Trade[]
}

export async function getDailyPnL(): Promise<DailyPnL[]> {
  await ensureColumns()
  const rows = await sql`
    SELECT
      COALESCE(trade_date, created_at::date)::text  AS date,
      SUM(profit_loss)::float8                      AS total_pnl,
      COUNT(*)                                      AS trade_count
    FROM trades
    WHERE status = 'CLOSED' AND symbol = 'XAUUSD'
    GROUP BY COALESCE(trade_date, created_at::date)
    ORDER BY COALESCE(trade_date, created_at::date) DESC
  `
  return rows as DailyPnL[]
}

export async function addTrade(formData: FormData) {
  await ensureColumns()

  const tradeDate = (formData.get("tradeDate") as string) || new Date().toISOString().split("T")[0] // yyyy-mm-dd

  const symbol = "XAUUSD"
  const tradeType = formData.get("tradeType") as string
  const lotSize = Number.parseInt(formData.get("lotSize") as string)
  const entryPrice = Number.parseFloat(formData.get("entryPrice") as string)
  const exitPrice = Number.parseFloat(formData.get("exitPrice") as string) // required
  const notes = formData.get("notes") as string

  const profitLoss = tradeType === "BUY" ? (exitPrice - entryPrice) * lotSize : (entryPrice - exitPrice) * lotSize

  /* ALWAYS provide both date columns */
  await sql`
    INSERT INTO trades
      (trade_date, "date", symbol, trade_type, lot_size,
       entry_price, exit_price, profit_loss, status, notes)
    VALUES
      (${tradeDate}::date, ${tradeDate}::date, ${symbol}, ${tradeType},
       ${lotSize}, ${entryPrice}, ${exitPrice}, ${profitLoss}, 'CLOSED', ${notes})
  `

  revalidatePath("/")
  return { success: true }
}
