"use client"

import { useEffect, useState } from "react"

/** Live local time in Colombo. Client-only, so the server's time never mismatches on hydration. */
export function ColomboClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return <span className="tabular-nums">{time ?? "--:--:--"}</span>
}
