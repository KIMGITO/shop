import * as React from "react"
import { cn } from "@/lib/utils" // optional if you're using `cn`, else use plain string concat

export function CustomProgress({
  value = 0,
  direction = "horizontal",
  className = "",
}: {
  value: number
  direction?: "horizontal" | "vertical"
  className?: string
}) {
  const isVertical = direction === "vertical"

  return (
    <div
      className={cn(
        "relative overflow-hidden  bg-secondary ",
        isVertical ? "h-40 w-4 rounded-b-full" : "h-4 w-full rounded-l-full",
        className
      )}
    >
      <div
        className={cn(
          `absolute ${value <= 25 ? 'bg-red-500':value <= 60?'bg-amber-400' : value <= 100 ? 'bg-green-400' : value < 1 ? ' border-2 ': 'bg-gray-300'} transition-all duration-300`,
          isVertical ? "bottom-0 w-full" : "left-0 h-full"
        )}
        style={isVertical ? { height: `${value}%` } : { width: `${value}%` }}
      />
    </div>
  )
}
