'use client'

import { useState, type ComponentType } from 'react'
import { Lock, Newspaper, Star, Users, TrendingUp } from 'lucide-react'
import { Eyebrow, Reveal } from './reveal'
import { getTelegram, haptic } from '@/lib/telegram'

type ChapterIcon = ComponentType<{ className?: string; strokeWidth?: number }>

const CHAPTERS: { icon: ChapterIcon; title: string; hint: string }[] = [
  {
    icon: Star,
    title: 'Твоя звезда',
    hint: 'Звезда, чей свет летел столько же лет, сколько ты живёшь',
  },
  {
    icon: Newspaper,
    title: 'Мир в тот день',
    hint: 'Архивная пресса и телепрограмма вечера',
  },
  {
    icon: Users,
    title: 'Под одним небом',
    hint: 'Знаменитости того же дня',
  },
  {
    icon: TrendingUp,
    title: 'Экономика времени',
    hint: 'Индекс рубля и пломбира в год твоего рождения',
  },
]

export function LockedChapters() {
  const [payNotice, setPayNotice] = useState(false)

  const handleUnlock = () => {
    haptic('medium')
    const tg = getTelegram()
    const message = 'Оплата 290 ₽ станет доступна после подключения платёжного провайдера.'
    if (tg?.showAlert) tg.showAlert(message)
    else setPayNotice(true)
  }

  return (
    <div className="mt-10">
      <Reveal index={6} className="text-center">
        <Eyebrow>Самое интересное ещё впереди</Eyebrow>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          Четыре главы с глубоким погружением в день твоего появления на свет
        </p>
      </Reveal>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {CHAPTERS.map((ch, i) => (
          <Reveal key={ch.title} index={i + 7}>
            <div className="relative overflow-hidden rounded-lg border border-gold/20 bg-card/40 p-4 backdrop-blur-md">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Lock className="size-5 text-gold/30" strokeWidth={1.25} aria-hidden="true" />
              </div>
              <div className="flex flex-col items-start blur-[3px]">
                <span className="flex size-9 items-center justify-center rounded-full border border-gold/30">
                  <ch.icon className="size-4 text-gold" strokeWidth={1.25} />
                </span>
                <h3 className="mt-3 font-serif text-base font-semibold leading-tight text-foreground">{ch.title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{ch.hint}</p>
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-card/80 via-card/20 to-transparent" aria-hidden="true" />
            </div>
          </Reveal>
        ))}
      </div>

      {payNotice && (
        <Reveal index={11}>
          <p role="status" className="mt-4 rounded-lg border border-gold/30 bg-gold/[0.06] p-3 text-center text-xs leading-relaxed text-foreground">
            Оплата 290 ₽ станет доступна после подключения платёжного провайдера.
          </p>
        </Reveal>
      )}

      <Reveal index={12} className="mt-5">
        <button
          type="button"
          onClick={handleUnlock}
          className="sticky bottom-24 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-serif text-base font-semibold text-primary-foreground shadow-[0_0_40px_-8px_rgba(212,175,55,0.6)] transition-transform active:scale-[0.98]"
        >
          <Lock className="size-4 shrink-0" aria-hidden="true" />
          Открыть все 4 главы — 290 ₽
        </button>
      </Reveal>
    </div>
  )
}
