'use client'

import { useRef, useState } from 'react'
import { Download, Loader2, Share2 } from 'lucide-react'
import { ageBreakdown, totalDays, type BirthInput } from '@/lib/birth'
import { moonPhase } from '@/lib/astro'
import { findCity, formatCoords } from '@/lib/cities'
import { getEra } from '@/lib/era-data'
import { shortDate } from '@/lib/russian'
import { Eyebrow, Reveal } from './reveal'
import { getTelegram, haptic } from '@/lib/telegram'

type CardFormat = 'receipt' | 'celestial' | 'starmap'

const FORMATS: { id: CardFormat; label: string }[] = [
  { id: 'receipt', label: 'Винтажный чек' },
  { id: 'celestial', label: 'Небесный' },
  { id: 'starmap', label: 'Звёздная карта' },
]

export function ShareCards({ input, birth }: { input: BirthInput; birth: Date }) {
  const [active, setActive] = useState<CardFormat>('receipt')
  const [saving, setSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const era = getEra(birth)
  const moon = moonPhase(birth)
  const city = findCity(input.city)
  const age = ageBreakdown(birth, new Date())
  const days = totalDays(birth, new Date())

  const downloadCard = async () => {
    if (!cardRef.current) return
    setSaving(true)
    haptic('medium')
    try {
      const { default: html2canvas } = await import('html2canvas-pro')
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: '#0d0d0d', useCORS: true })
      const link = document.createElement('a')
      link.download = `capsule-${active}-${input.name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  const shareCard = async () => {
    haptic('medium')
    const text = `Маленькая капсула времени: ${input.name}, ${shortDate(birth)} — ${era.hit.artist} «${era.hit.title}»`
    const tg = getTelegram()
    if (tg?.shareMessage) {
      tg.shareMessage(text, '')
    } else if (navigator.share) {
      try {
        await navigator.share({ title: 'Капсула времени', text })
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(text)
      } catch { /* clipboard not available */ }
    }
  }

  return (
    <div className="mt-10">
      <Reveal index={2} className="text-center">
        <Eyebrow>Маленькая капсула времени — поделись ей</Eyebrow>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          Выбери формат карточки для соцсетей и Stories
        </p>
      </Reveal>

      <Reveal index={3} className="mt-6 flex justify-center gap-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            type="button"
            onClick={() => { haptic(); setActive(fmt.id) }}
            className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
              active === fmt.id
                ? 'bg-gold text-primary-foreground'
                : 'border border-gold/25 text-muted-foreground hover:text-foreground'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </Reveal>

      <Reveal index={4} className="mt-6">
        <div ref={cardRef} className="relative mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-gold/20 bg-card/80 p-6">
          {active === 'receipt' && (
            <div className="flex flex-col gap-1 font-serif text-foreground" style={{ fontFamily: 'monospace' }}>
              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gold/70">Кассовый чек · {birth.getFullYear()}</p>
              <div className="my-2 border-t border-dashed border-gold/30" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Пломбир</span>
                <span className="tabular-nums text-gold">{era.prices.iceCream}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Билет в кино</span>
                <span className="tabular-nums text-gold">{era.prices.cinema}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Проезд в метро</span>
                <span className="tabular-nums text-gold">{era.prices.metro}</span>
              </div>
              <div className="my-2 border-t border-dashed border-gold/30" />
              <p className="text-center text-sm text-foreground">{input.name}, {shortDate(birth)}</p>
              <p className="text-center text-[10px] text-muted-foreground">{input.city}</p>
              <div className="mt-3 flex justify-center gap-1 text-gold/40" aria-hidden="true">
                {'▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌'}
              </div>
            </div>
          )}

          {active === 'celestial' && (
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Небесная сводка</p>
              <p className="mt-4 font-serif text-2xl font-semibold text-foreground">{input.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{shortDate(birth)} · {input.time}</p>
              <div className="my-4 h-px w-20 bg-gold/30" />
              <p className="font-serif text-lg text-gold">Фаза Луны: {moon.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">Освещённость: {moon.illumination}%</p>
              {city && <p className="mt-2 text-xs tabular-nums text-muted-foreground">{formatCoords(city)}</p>}
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gold/50">{input.city}</p>
            </div>
          )}

          {active === 'starmap' && (
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Звёздная карта</p>
              <div className="relative my-4 size-32 rounded-full border border-gold/40 bg-gradient-to-b from-night to-background">
                <div className="absolute inset-2 rounded-full border border-gold/20" />
                <div className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="absolute left-[30%] top-[25%] size-0.5 rounded-full bg-foreground/60" />
                <div className="absolute left-[60%] top-[40%] size-0.5 rounded-full bg-foreground/60" />
                <div className="absolute left-[45%] top-[65%] size-0.5 rounded-full bg-foreground/60" />
                <div className="absolute left-[70%] top-[70%] size-0.5 rounded-full bg-foreground/40" />
                <div className="absolute left-[20%] top-[55%] size-0.5 rounded-full bg-foreground/40" />
              </div>
              <p className="font-serif text-lg text-foreground">{input.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{shortDate(birth)}</p>
              <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-foreground/20">Neon Born · Preview</p>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal index={5} className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={downloadCard}
          disabled={saving}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-gold/40 text-sm text-foreground transition-colors hover:border-gold/60 disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
          {saving ? 'Готовим...' : 'Скачать бесплатную карточку'}
        </button>
        <button
          type="button"
          onClick={shareCard}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          <Share2 className="size-4" aria-hidden="true" />
          Поделиться
        </button>
      </Reveal>
    </div>
  )
}
