'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const STATUSES = [
  'Вычисляем положение созвездий над горизонтом...',
  'Ищем архивные сводки и сетку передач того вечера...',
  'Считаем удары сердца и фазы Луны...',
]

const DURATION = 3000

export function AnalysisLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const start = performance.now()
    let frame = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION)
      setProgress(p)
      if (p < 1) frame = requestAnimationFrame(tick)
      else setTimeout(() => doneRef.current(), 250)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const statusIndex = Math.min(STATUSES.length - 1, Math.floor(progress * STATUSES.length))

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center" role="status" aria-live="polite">
      <motion.div
        className="relative mb-12 flex size-28 items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border border-dashed border-gold/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-4 rounded-full border border-gold/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.9)]" />
        </motion.span>
        <Sparkles className="size-7 text-gold" strokeWidth={1.25} aria-hidden="true" />
      </motion.div>

      <div className="h-16 w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-balance font-serif text-xl italic leading-snug text-foreground"
          >
            {STATUSES[statusIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-8 w-full max-w-xs">
        <div className="relative h-px w-full bg-gold/15">
          <div
            className="absolute inset-y-0 left-0 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>Архив</span>
          <span className="tabular-nums text-gold">{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </div>
  )
}
