"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export type Season = "christmas" | "new-year" | "avurudu" | "vesak" | null

export function useSeason() {
  const [season, setSeason] = useState<Season>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Allow manual override via query param ?season=christmas
    const override = searchParams.get("season")
    if (override && ["christmas", "new-year", "avurudu", "vesak"].includes(override)) {
      setSeason(override as Season)
      return
    }

    const date = new Date()
    const month = date.getMonth() // 0-11
    const day = date.getDate()

    // 1. Christmas: Dec 20 - Dec 30
    if (month === 11 && day >= 20 && day <= 30) {
      setSeason("christmas")
      return
    }

    // 2. New Year: Dec 31 - Jan 2
    if ((month === 11 && day === 31) || (month === 0 && day <= 2)) {
      setSeason("new-year")
      return
    }

    // 3. Avurudu (Sinhala/Hindu New Year): April 10 - April 20
    if (month === 3 && day >= 10 && day <= 20) {
      setSeason("avurudu")
      return
    }

    // 4. Vesak: May (Usually Full Moon, but let's set for first 2 weeks or specific date range)
    // Let's assume May 1st to May 15th for broad coverage or dynamically calc full moon (too complex)
    // Simplification: May 1 - May 10
    if (month === 4 && day >= 1 && day <= 15) {
      setSeason("vesak")
      return
    }

    setSeason(null)
  }, [searchParams])

  return season
}
