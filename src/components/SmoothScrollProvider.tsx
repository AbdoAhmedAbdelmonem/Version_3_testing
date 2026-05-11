"use client"

import { ReactLenis } from "lenis/react"
import { ReactNode, useEffect, useState } from "react"

/**
 * SmoothScrollProvider component that wraps the application with Lenis smooth scrolling.
 * Provides a buttery-smooth scrolling experience consistent across all browsers.
 * Native touch scrolling is preserved on mobile by default for better performance.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    const isLowEndMobile = coarsePointer || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    setEnableSmoothScroll(!prefersReducedMotion && !isLowEndMobile)
  }, [])

  if (!enableSmoothScroll) {
    return <>{children}</>
  }

  return (
    <ReactLenis 
      root 
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Power 4 easing
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
