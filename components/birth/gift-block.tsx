'use client'

import { useState } from 'react'
import { Heart, Mail, Sparkles } from 'lucide-react'
import { Eyebrow, Reveal } from './reveal'
import { haptic } from '@/lib/telegram'

const TAGS = ['Мама', 'Папа', 'Любимый человек', 'Друг'] as const

export function GiftBlock() {
  const [recipient, setRecipient] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const handleTag = (tag: string) => {
    haptic()
    setSelectedTag(tag)
    setRecipient(tag)
  }

  return (
    <div className="mt-10">
      <Reveal index={2} className="text-center">
        <Eyebrow>Подарок близкому</Eyebrow>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          Подари капсулу времени тем, кого любишь
        </p>
      </Reveal>

      <Reveal index={3} className="mt-6">
        <div className="relative mx-auto w-full max-w-sm">
          {/* Envelope body */}
          <div className="relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-b from-card to-background p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
            {/* Envelope flap hint */}
            <div className="pointer-events-none absolute -top-px left-0 right-0 h-12 bg-gradient-to-b from-gold/[0.06] to-transparent" aria-hidden="true" />

            {/* Wax seal */}
            <div className="absolute top-3 right-4 flex size-10 items-center justify-center rounded-full bg-gold/90 shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
              <Heart className="size-4 text-primary-foreground" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </div>

            {/* Letter header */}
            <div className="flex items-center gap-2 text-gold">
              <Mail className="size-4" strokeWidth={1.25} aria-hidden="true" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Кому</span>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTag(tag)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-gold text-primary-foreground'
                      : 'border border-gold/25 text-muted-foreground hover:border-gold/50 hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Name input */}
            <div className="mt-4">
              <input
                type="text"
                value={recipient}
                onChange={(e) => { setRecipient(e.target.value); setSelectedTag(null) }}
                placeholder="Имя получателя"
                maxLength={24}
                className="h-12 w-full border-0 border-b border-gold/30 bg-transparent px-0 font-serif text-xl text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none"
              />
            </div>

            {/* Letter preview */}
            <div className="mt-5 rounded-lg border border-gold/15 bg-background/60 p-4">
              <div className="flex items-center gap-2 text-gold/60">
                <Sparkles className="size-3" strokeWidth={1.25} aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-[0.25em]">Текст открытки</span>
              </div>
              <p className="mt-2 font-serif text-sm italic leading-relaxed text-muted-foreground">
                {recipient
                  ? `«Дорогой ${recipient}, твой день — это не просто дата. Это ночь, когда звёзды выстроились ради тебя. Этот подарок — капсула твоего начала.»`
                  : '«Дорогой друг, твой день — это не просто дата. Это ночь, когда звёзды выстроились ради тебя. Этот подарок — капсула твоего начала.»'}
              </p>
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={() => haptic('medium')}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold/15 border border-gold/40 font-serif text-base text-gold transition-colors hover:bg-gold/25"
            >
              <Mail className="size-4" aria-hidden="true" />
              Отправить подарок
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
