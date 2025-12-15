"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface HoverButtonProps {
  buttonText?: string;
  className?: string;
}

export function HoverButton({ buttonText = "Let's Talk", className }: HoverButtonProps) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Neucha&display=swap" rel="stylesheet" />
      <Link 
        href="mailto:amikafernando123@gmail.com"
        className={cn("button-55", className)}
      >
        {buttonText}
      </Link>
    </>
  )
}
