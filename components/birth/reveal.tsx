'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 text-gold', className)} aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/70" />
      <span className="size-1.5 rotate-45 border border-gold" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[11px] font-medium uppercase tracking-[0.32em] text-gold/80', className)}>
      {children}
    </p>
  )
}
