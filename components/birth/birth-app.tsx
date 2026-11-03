'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { birthDateFrom, type BirthInput } from '@/lib/birth'
import { haptic } from '@/lib/telegram'
import { cn } from '@/lib/utils'
import { Onboarding } from './onboarding'
import { AnalysisLoader } from './analysis-loader'
import { LifeInNumbers } from './life-in-numbers'
import { CultureCode } from './culture-code'
import { PosterScreen } from './poster-screen'

type Step = 'onboarding' | 'loading' | 'numbers' | 'culture' | 'poster'

const STORY: Step[] = ['numbers', 'culture', 'poster']
const STORY_LABELS: Record<string, string> = {
  numbers: 'Цифры',
  culture: 'Эпоха',
  poster: 'Постер',
}

export function BirthApp() {
  const [step, setStep] = useState<Step>('onboarding')
  const [input, setInput] = useState<BirthInput | null>(null)
  const birth = useMemo(() => (input ? birthDateFrom(input) : null), [input])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [step])

  const storyIndex = STORY.indexOf(step)
  const go = (next: Step) => {
    haptic()
    setStep(next)
  }

  return (
    <div className="film-grain relative min-h-dvh bg-background text-foreground">
      <div className="vignette pointer-events-none fixed inset-0" aria-hidden="true" />
      <main className="relative mx-auto min-h-dvh w-full max-w-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {step === 'onboarding' && (
              <Onboarding
                initial={input ?? undefined}
                onSubmit={(value) => {
                  setInput(value)
                  go('loading')
                }}
              />
            )}
            {step === 'loading' && <AnalysisLoader onDone={() => setStep('numbers')} />}
            {step === 'numbers' && input && birth && <LifeInNumbers input={input} birth={birth} />}
            {step === 'culture' && birth && <CultureCode birth={birth} />}
            {step === 'poster' && input && birth && <PosterScreen input={input} birth={birth} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {storyIndex >= 0 && (
        <nav
          aria-label="Навигация по главам"
          className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] bg-gradient-to-t from-background via-background/95 to-transparent px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8"
        >
          <div className="mb-3 flex items-center justify-center gap-4">
            {STORY.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => go(s)}
                aria-current={i === storyIndex ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] transition-colors',
                  i === storyIndex ? 'text-gold' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className={cn('h-px transition-all', i === storyIndex ? 'w-6 bg-gold' : 'w-3 bg-muted-foreground/50')} />
                {STORY_LABELS[s]}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(storyIndex === 0 ? 'onboarding' : STORY[storyIndex - 1])}
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/30 text-foreground transition-colors hover:border-gold/60"
              aria-label={storyIndex === 0 ? 'Изменить данные' : 'Назад'}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            {storyIndex < STORY.length - 1 ? (
              <button
                type="button"
                onClick={() => go(STORY[storyIndex + 1])}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-gold/60 bg-gold/10 font-serif text-lg text-gold transition-colors hover:bg-gold/20"
              >
                {storyIndex === 0 ? 'Культурный код эпохи' : 'Создать постер'}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go('onboarding')}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-gold/30 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Начать заново
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
