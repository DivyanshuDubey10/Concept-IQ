import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

/**
 * A lightweight scroll-reveal wrapper.
 * Children fade up into view when they enter the viewport.
 * Uses IntersectionObserver — no third-party deps.
 */
interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Delay in milliseconds before the reveal starts (for stagger effects) */
  delay?: number
  /** Distance in px elements travel upward during reveal (default 24) */
  distance?: number
}

export function Reveal({ children, className, delay = 0, distance = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el) // fire once
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700 ease-out', className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  )
}
