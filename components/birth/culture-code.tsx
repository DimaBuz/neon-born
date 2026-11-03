'use client'

import type { ComponentType, ReactNode } from 'react'
import { CassetteTape, Hourglass, IceCreamCone, Ticket, TrainFront, Tv } from 'lucide-react'
import { getEra } from '@/lib/era-data'
import { Eyebrow, Ornament, Reveal } from './reveal'

function FactCard({
  icon: Icon,
  eyebrow,
  children,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  eyebrow: string
  children: ReactNode
}) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-border bg-card/70 p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full border border-gold/30">
          <Icon className="size-4 text-gold" strokeWidth={1.25} />
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold/80">{eyebrow}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </article>
  )
}

function PriceRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
}) {
  return (
    <li className="flex items-center gap-3 border-b border-dashed border-gold/15 py-3 last:border-0">
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.25} aria-hidden="true" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <span className="font-serif text-xl font-semibold tabular-nums text-gold">{value}</span>
    </li>
  )
}

export function CultureCode({ birth }: { birth: Date }) {
  const era = getEra(birth)
  const year = birth.getFullYear()

  return (
    <section className="px-6 pb-32 pt-12" aria-labelledby="culture-title">
      <Reveal className="text-center">
        <Eyebrow>Глава II · Культурный код</Eyebrow>
        <h1 id="culture-title" className="mt-5 text-balance font-serif text-[2.2rem] font-medium leading-[1.1]">
          Эпоха <span className="gold-text italic">{year}</span> года
        </h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
          {era.soviet
            ? 'Страна ещё называлась СССР, а новости узнавали из газет и программы «Время».'
            : 'Что звучало, что смотрели и сколько всё стоило, когда ты только появился.'}
        </p>
        <Ornament className="mt-8" />
      </Reveal>

      <div className="mt-8 flex flex-col gap-3">
        <Reveal index={1}>
          <FactCard icon={CassetteTape} eyebrow="Хит в магнитофонах">
            <p className="font-serif text-[1.75rem] font-medium italic leading-tight text-foreground">
              «{era.hit.title}»
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{era.hit.artist}</p>
          </FactCard>
        </Reveal>

        <Reveal index={2}>
          <FactCard icon={Tv} eyebrow="Вечерний эфир">
            <ol className="flex flex-col gap-3">
              <li className="flex gap-4">
                <span className="font-serif text-lg tabular-nums text-gold">21:00</span>
                <span className="text-sm leading-relaxed text-foreground">
                  Программа «{era.news.program}»
                  <span className="block text-xs text-muted-foreground">{era.news.channel}</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-serif text-lg tabular-nums text-gold">21:40</span>
                <span className="text-sm leading-relaxed text-foreground">
                  «{era.screen.title}»
                  <span className="block text-xs text-muted-foreground">
                    Культовый {era.screen.kind} эпохи — его обсуждала вся страна
                  </span>
                </span>
              </li>
            </ol>
          </FactCard>
        </Reveal>

        <Reveal index={3}>
          <FactCard icon={Ticket} eyebrow="Индекс эпохи">
            <ul>
              <PriceRow icon={IceCreamCone} label="Пломбир" value={era.prices.iceCream} />
              <PriceRow icon={Ticket} label="Билет в кино" value={era.prices.cinema} />
              <PriceRow icon={TrainFront} label="Проезд в метро" value={era.prices.metro} />
            </ul>
          </FactCard>
        </Reveal>

        <Reveal index={4}>
          <FactCard icon={Hourglass} eyebrow="Мир до тебя">
            {era.notYet.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">Ещё не существовало:</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {era.notYet.map((item) => (
                    <li
                      key={item.name}
                      className="rounded-full border border-gold/25 px-3 py-1.5 text-sm text-foreground"
                    >
                      {item.name}
                      <span className="ml-1.5 text-xs tabular-nums text-gold/70">{item.year}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-foreground">
                Ты родился в мире, где уже есть всё: смартфоны, нейросети и Telegram. Следующие открытия — за твоим
                поколением.
              </p>
            )}
          </FactCard>
        </Reveal>
      </div>
      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        Цены указаны ориентировочно для Москвы того года
      </p>
    </section>
  )
}
