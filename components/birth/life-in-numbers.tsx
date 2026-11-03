'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { CalendarDays, HeartPulse, Moon, Orbit } from 'lucide-react'
import { ageBreakdown, totalDays, type BirthInput } from '@/lib/birth'
import { SYNODIC_MONTH } from '@/lib/astro'
import { WEEKDAYS, dateInWords, formatNumber, plural } from '@/lib/russian'
import { Eyebrow, Ornament, Reveal } from './reveal'
import { LockedChapters } from './locked-chapters'

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function TickerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-3xl font-medium tabular-nums text-foreground">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  value,
  label,
  note,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  value: string
  label: string
  note?: string
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card/70 p-4">
      <Icon className="size-5 text-gold" strokeWidth={1.25} />
      <p className="mt-5 break-words font-serif text-2xl font-semibold leading-none tabular-nums gold-text">{value}</p>
      <p className="mt-2 text-sm leading-snug text-foreground">{label}</p>
      {note && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{note}</p>}
    </div>
  )
}

export function LifeInNumbers({ input, birth }: { input: BirthInput; birth: Date }) {
  const now = useNow()
  const age = ageBreakdown(birth, now)
  const days = totalDays(birth, now)
  const heartbeats = days * 24 * 60 * 72

  const metrics = [
    {
      icon: Orbit,
      value: formatNumber(age.years),
      label: `${plural(age.years, ['оборот', 'оборота', 'оборотов'])} вокруг Солнца`,
    },
    {
      icon: Moon,
      value: formatNumber(days / SYNODIC_MONTH),
      label: 'полнолуний с момента рождения',
    },
    {
      icon: CalendarDays,
      value: formatNumber(days),
      label: `${plural(days, ['день', 'дня', 'дней'])} на этой планете`,
    },
    {
      icon: HeartPulse,
      value: formatNumber(heartbeats),
      label: 'ударов сердца',
      note: 'Примерно при 72 уд./мин',
    },
  ]

  return (
    <section className="px-6 pb-32 pt-12" aria-labelledby="numbers-title">
      <Reveal className="text-center">
        <Eyebrow>Глава I · Жизнь в цифрах</Eyebrow>
        <h1 id="numbers-title" className="mt-5 text-balance font-serif text-[2.2rem] font-medium leading-[1.1]">
          <span className="gold-text italic">{input.name}</span>, вот каким был мир в день твоего рождения
        </h1>
        <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground">
          {WEEKDAYS[birth.getDay()]}, {dateInWords(birth)}, {input.city}.
          <br />
          <span className="text-foreground">Твой первый вдох — в {input.time}.</span>
        </p>
        <Ornament className="mt-8" />
      </Reveal>

      <Reveal index={1} className="mt-8 rounded-lg border border-gold/30 bg-gradient-to-b from-gold/[0.07] to-transparent px-3 py-6">
        <p className="mb-5 text-center text-[11px] uppercase tracking-[0.3em] text-gold/80">Ты живёшь уже</p>
        <div className="grid grid-cols-5 gap-1" aria-live="off">
          <TickerUnit value={age.years} label={plural(age.years, ['год', 'года', 'лет'])} />
          <TickerUnit value={age.days} label={plural(age.days, ['день', 'дня', 'дней'])} />
          <TickerUnit value={age.hours} label="час." />
          <TickerUnit value={age.minutes} label="мин." />
          <TickerUnit value={age.seconds} label="сек." />
        </div>
      </Reveal>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <Reveal key={m.label} index={i + 2}>
            <MetricCard {...m} />
          </Reveal>
        ))}
      </div>

      <LockedChapters />
    </section>
  )
}
