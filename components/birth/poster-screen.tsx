'use client'

import { useRef, useState, type ReactNode } from 'react'
import { Download, Gem, Loader2, Moon, Sparkles, Star, Sun } from 'lucide-react'
import { birthstone, easternYear, moonPhase, zodiacSign } from '@/lib/astro'
import { findCity, formatCoords } from '@/lib/cities'
import type { BirthInput } from '@/lib/birth'
import { shortDate, spacedUpper } from '@/lib/russian'
import { haptic } from '@/lib/telegram'
import { StarSkyCanvas } from './star-sky-canvas'
import { Reveal } from './reveal'
import { PricingCards } from './pricing-cards'
import { ShareCards } from './share-cards'
import { GiftBlock } from './gift-block'

function Sigil({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-10 items-center justify-center rounded-full border border-ink/25 text-ink">{icon}</div>
      <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.22em] text-ink/55">{label}</p>
      <p className="mt-0.5 font-serif text-[13px] font-semibold leading-tight text-ink">{value}</p>
    </div>
  )
}

export function PosterScreen({ input, birth }: { input: BirthInput; birth: Date }) {
  const posterRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)

  const zodiac = zodiacSign(birth)
  const moon = moonPhase(birth)
  const eastern = easternYear(birth)
  const stone = birthstone(birth)
  const city = findCity(input.city)
  const seedKey = `${input.date}T${input.time}@${input.city.toLowerCase()}`

  const downloadPreview = async () => {
    if (!posterRef.current) return
    setSaving(true)
    haptic('medium')
    try {
      const { default: html2canvas } = await import('html2canvas-pro')
      const canvas = await html2canvas(posterRef.current, { scale: 2, backgroundColor: '#fdfbf7', useCORS: true })
      const link = document.createElement('a')
      link.download = `poster-${input.name}-preview.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="px-5 pb-36 pt-8" aria-label="Постер звёздного неба">
      <Reveal>
        <div ref={posterRef} className="paper-texture relative overflow-hidden rounded-sm p-3 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="relative border border-ink/70 p-1">
            <div className="flex flex-col items-center border border-ink/30 px-5 pb-6 pt-7">
              <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-ink/60">Звёздная карта</p>
              <h1 className="mt-3 text-balance text-center font-serif text-[1.45rem] font-semibold leading-tight tracking-[0.08em]">
                НОЧЬ, КОГДА МИР ВСТРЕТИЛ ТЕБЯ
              </h1>

              <div className="mt-5 w-full px-2">
                <StarSkyCanvas seedKey={seedKey} moonIllumination={moon.illumination} />
              </div>

              <p className="mt-6 text-center font-serif text-[1.7rem] font-semibold leading-none tracking-[0.12em]">
                {spacedUpper(input.name)}
              </p>
              <div className="mt-3 flex items-center gap-2 text-ink/60" aria-hidden="true">
                <span className="h-px w-8 bg-ink/40" />
                <Sparkles className="size-3" strokeWidth={1.5} />
                <span className="h-px w-8 bg-ink/40" />
              </div>
              <p className="mt-3 text-center font-serif text-base italic">
                {shortDate(birth)} · {input.time}
              </p>
              <p className="mt-1 text-center text-[10px] uppercase tracking-[0.3em] text-ink/70">{input.city}</p>
              {city && <p className="mt-1 text-center text-[10px] tabular-nums tracking-[0.12em] text-ink/50">{formatCoords(city)}</p>}

              <div className="mt-6 grid w-full grid-cols-4 gap-1 border-t border-ink/20 pt-5">
                <Sigil icon={<Star className="size-4" strokeWidth={1.25} />} label="Знак" value={zodiac.name} />
                <Sigil icon={<Moon className="size-4" strokeWidth={1.25} />} label="Луна" value={moon.name} />
                <Sigil icon={<Sun className="size-4" strokeWidth={1.25} />} label="Год" value={eastern.animal} />
                <Sigil icon={<Gem className="size-4" strokeWidth={1.25} />} label="Камень" value={stone} />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="-rotate-[30deg] select-none font-serif text-[5.5rem] font-bold tracking-[0.15em] text-ink/[0.07]">
              PREVIEW
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal index={1} className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={downloadPreview}
          disabled={saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gold/30 text-sm text-foreground transition-colors hover:border-gold/60 disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
          {saving ? 'Готовим превью...' : 'Скачать превью с водяным знаком'}
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Восточный символ: {eastern.animal}, стихия {eastern.element}
        </p>
      </Reveal>

      <PricingCards />

      <ShareCards input={input} birth={birth} />

      <GiftBlock />
    </section>
  )
}
