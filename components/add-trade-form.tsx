"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addTrade } from "@/lib/actions"
import { Plus } from "lucide-react"

export function AddTradeForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await addTrade(formData)
      if (result.success) {
        setIsOpen(false) // Close the dialog on success
        // Reset form by reloading
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting trade:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Trade</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {/* Symbol is now fixed and not displayed */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tradeType" className="text-foreground mb-2">
                Trade Type
              </Label>
              <Select name="tradeType" required>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lotSize" className="text-foreground">
                Lot Size
              </Label>
              <Input
                id="lotSize"
                name="lotSize"
                type="number"
                placeholder="0.1"
                min={0.01}
                step={0.01}
                required
                className="bg-background border-border text-foreground mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryPrice" className="text-foreground mb-2">
                Entry Price
              </Label>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                step="0.01"
                placeholder="150.00"
                required
                className="bg-background border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="exitPrice" className="text-foreground mb-2">
                Exit Price
              </Label>
              <Input
                id="exitPrice"
                name="exitPrice"
                type="number"
                step="0.01"
                placeholder="155.00"
                required // Exit price is now required
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tradeDate" className="text-foreground mb-2">
              Trade Date
            </Label>
            <Input
              id="tradeDate"
              name="tradeDate"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]} // Defaults to current date
              className="bg-background border-border text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-foreground mb-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Trade notes..."
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? "Adding..." : "Add Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
