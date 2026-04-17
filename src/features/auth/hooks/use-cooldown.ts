import { useCountDown } from "ahooks"
import { useState } from "react"

interface UseCooldownReturn {
  secondsRemaining: number
  isActive: boolean
  start: (seconds: number) => void
}

export function useCooldown(): UseCooldownReturn {
  const [targetDate, setTargetDate] = useState<number | undefined>()
  const [ms] = useCountDown({ targetDate })

  return {
    secondsRemaining: Math.ceil(ms / 1000),
    isActive: ms > 0,
    start: (seconds: number) => setTargetDate(Date.now() + seconds * 1000),
  }
}
