'use client'

import { useState } from 'react'
import { Check, Crown, Lock } from 'lucide-react'
import { Eyebrow, Reveal } from './reveal'
import { getTelegram, haptic } from '@/lib/telegram'

const TIERS = [
  {
    name: 'История',
    price: '290 ₽',
    badge: null as string | null,
    features: [
      'Мгновенная разблокировка 4 закрытых глав',
      'Доступ онлайн навсегда',
      'Все расчёты звёзд и дат',
    ],
  },
  {
    name: 'На память',
    price: '590 ₽',
    badge: 'ХИТ',
    features: [
      'Всё из тарифа «История»',
      'Персональный сертификат со звёздной картой в Ultra HD (2048×3072 px)',
      'Без водяных знаков — для печати А4/А3',
      'Авторское эссе о твоём дне',
    ],
  },
]

export function PricingCards() {
  const [payNotice, setPayNotice] = useState<string | null>(null)

  const handleSelect = (tier: string, price: string) => {
    haptic('medium')
    const tg = getTelegram()
    const message = `Оплата ${price} за тариф «${tier}» станет доступна после подключения платёжного провайдера.`
    if (tg?.showAlert) tg.showAlert(message)
    else setPayNotice(tier)
  }

  return (
    <div className="mt-10">
      <Reveal index={2} className="text-center">
        <Eyebrow>Выбери свой тариф</Eyebrow>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          Один платеж — доступ навсегда
        </p>
      </Reveal>

      <div className="mt-6 flex flex-col gap-4">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} index={i + 3}>
            <div className={`relative rounded-lg border p-5 transition-colors ${
              tier.badge
                ? 'border-gold/50 bg-gradient-to-b from-gold/[0.08] to-transparent'
                : 'border-border bg-card/70'
            }`}>
              {tier.badge && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-gold px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                  {tier.badge}
                </span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-foreground">{tier.name}</h3>
                <span className="font-serif text-2xl font-bold tabular-nums gold-text">{tier.price}</span>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={2} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSelect(tier.name, tier.price)}
                className={`mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full font-serif text-base font-semibold transition-transform active:scale-[0.98] ${
                  tier.badge
                    ? 'bg-gold text-primary-foreground shadow-[0_0_40px_-8px_rgba(212,175,55,0.6)]'
                    : 'border border-gold/40 text-gold hover:bg-gold/10'
                }`}
              >
                {tier.badge ? <Crown className="size-4 shrink-0" aria-hidden="true" /> : <Lock className="size-4 shrink-0" aria-hidden="true" />}
                Выбрать
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      {payNotice && (
        <Reveal index={5}>
          <p role="status" className="mt-4 rounded-lg border border-gold/30 bg-gold/[0.06] p-3 text-center text-xs leading-relaxed text-foreground">
            Оплата за тариф «{payNotice}» станет доступна после подключения платёжного провайдера.
          </p>
        </Reveal>
      )}
    </div>
  )
}
