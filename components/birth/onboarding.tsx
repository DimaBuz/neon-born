'use client'

import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { MoonStar, ArrowRight } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import type { BirthInput } from '@/lib/birth'
import { getTelegram } from '@/lib/telegram'
import { Eyebrow, Ornament, Reveal } from './reveal'

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'h-12 w-full rounded-none border-0 border-b border-gold/30 bg-transparent px-0 font-serif text-2xl text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus-visible:ring-0 transition-colors'

export function Onboarding({
  initial,
  onSubmit,
}: {
  initial?: BirthInput
  onSubmit: (input: BirthInput) => void
}) {
  const id = useId()
  const [form, setForm] = useState<BirthInput>(initial ?? { name: '', date: '', time: '', city: 'Москва' })
  const [fromTelegram, setFromTelegram] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#0d0d0d')
    tg.setBackgroundColor?.('#0d0d0d')
    const firstName = tg.initDataUnsafe?.user?.first_name
    if (firstName) {
      setForm((f) => (f.name ? f : { ...f, name: firstName }))
      setFromTelegram(true)
    }
  }, [])

  const update = (key: keyof BirthInput) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const canSubmit = form.name.trim() && form.date && form.time && form.city.trim()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ ...form, name: form.name.trim(), city: form.city.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-dvh flex-col px-6 pb-8 pt-14">
      <Reveal className="flex flex-col items-center text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-gold/40">
          <MoonStar className="size-6 text-gold" strokeWidth={1.25} aria-hidden="true" />
        </div>
        <Eyebrow>Архив одного дня</Eyebrow>
        <h1 className="mt-4 text-balance font-serif text-[2.6rem] font-medium leading-[1.05] text-foreground">
          День, когда <span className="gold-text italic">ты появился</span> на свет
        </h1>
        <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          Поднимем сводки, сетку передач и карту звёзд того самого вечера.
        </p>
        <Ornament className="mt-8" />
      </Reveal>

      <div className="mt-10 flex flex-col gap-7">
        <Reveal index={1}>
          <Field label="Имя" htmlFor={`${id}-name`}>
            <input
              id={`${id}-name`}
              className={inputClass}
              placeholder="Как тебя зовут?"
              autoComplete="given-name"
              value={form.name}
              onChange={update('name')}
              maxLength={24}
              required
            />
            {fromTelegram && <span className="text-xs text-gold/70">Подхватили из Telegram</span>}
          </Field>
        </Reveal>

        <Reveal index={2} className="grid grid-cols-2 gap-5">
          <Field label="Дата" htmlFor={`${id}-date`}>
            <input
              id={`${id}-date`}
              type="date"
              className={`${inputClass} text-xl`}
              value={form.date}
              onChange={update('date')}
              min="1930-01-01"
              max={today}
              required
            />
          </Field>
          <Field label="Время" htmlFor={`${id}-time`}>
            <input
              id={`${id}-time`}
              type="time"
              className={`${inputClass} text-xl`}
              value={form.time}
              onChange={update('time')}
              required
            />
          </Field>
        </Reveal>

        <Reveal index={3}>
          <Field label="Город рождения" htmlFor={`${id}-city`}>
            <input
              id={`${id}-city`}
              list={`${id}-cities`}
              className={inputClass}
              placeholder="Выбери или впиши"
              value={form.city}
              onChange={update('city')}
              required
            />
            <datalist id={`${id}-cities`}>
              {CITIES.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </Field>
        </Reveal>
      </div>

      <Reveal index={4} className="mt-auto pt-10">
        <button
          type="submit"
          disabled={!canSubmit}
          className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-gold px-6 font-serif text-xl font-semibold text-primary-foreground shadow-[0_0_40px_-8px_rgba(212,175,55,0.6)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gold/25 disabled:text-foreground/40 disabled:shadow-none"
        >
          Заглянуть в день своего появления
          <ArrowRight className="size-5 transition-transform group-enabled:group-hover:translate-x-1" aria-hidden="true" />
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Данные остаются только на твоём устройстве</p>
      </Reveal>
    </form>
  )
}
