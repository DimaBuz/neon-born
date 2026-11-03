export const SYNODIC_MONTH = 29.53059

const ZODIAC: { name: string; symbol: string; from: [number, number] }[] = [
  { name: 'Козерог', symbol: '♑', from: [1, 1] },
  { name: 'Водолей', symbol: '♒', from: [1, 20] },
  { name: 'Рыбы', symbol: '♓', from: [2, 19] },
  { name: 'Овен', symbol: '♈', from: [3, 21] },
  { name: 'Телец', symbol: '♉', from: [4, 20] },
  { name: 'Близнецы', symbol: '♊', from: [5, 21] },
  { name: 'Рак', symbol: '♋', from: [6, 21] },
  { name: 'Лев', symbol: '♌', from: [7, 23] },
  { name: 'Дева', symbol: '♍', from: [8, 23] },
  { name: 'Весы', symbol: '♎', from: [9, 23] },
  { name: 'Скорпион', symbol: '♏', from: [10, 23] },
  { name: 'Стрелец', symbol: '♐', from: [11, 22] },
  { name: 'Козерог', symbol: '♑', from: [12, 22] },
]

export function zodiacSign(date: Date) {
  const m = date.getMonth() + 1
  const d = date.getDate()
  let sign = ZODIAC[0]
  for (const z of ZODIAC) {
    if (m > z.from[0] || (m === z.from[0] && d >= z.from[1])) sign = z
  }
  return { name: sign.name, symbol: `${sign.symbol}\uFE0E` }
}

export function moonPhase(date: Date) {
  const reference = Date.UTC(2000, 0, 6, 18, 14)
  const days = (date.getTime() - reference) / 86_400_000
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2) * 100)
  const phases = [
    [1.84, 'Новолуние'],
    [5.53, 'Растущий серп'],
    [9.22, 'Первая четверть'],
    [12.91, 'Растущая Луна'],
    [16.61, 'Полнолуние'],
    [20.3, 'Убывающая Луна'],
    [23.99, 'Последняя четверть'],
    [27.68, 'Убывающий серп'],
    [Infinity, 'Новолуние'],
  ] as const
  const name = phases.find(([limit]) => age < limit)![1]
  return { name, age, illumination }
}

const ANIMALS = [
  'Крыса',
  'Бык',
  'Тигр',
  'Кролик',
  'Дракон',
  'Змея',
  'Лошадь',
  'Коза',
  'Обезьяна',
  'Петух',
  'Собака',
  'Свинья',
]
const ELEMENTS = ['Дерева', 'Огня', 'Земли', 'Металла', 'Воды']

export function easternYear(date: Date) {
  let year = date.getFullYear()
  const beforeLunarNewYear = date.getMonth() === 0 || (date.getMonth() === 1 && date.getDate() < 5)
  if (beforeLunarNewYear) year -= 1
  const animal = ANIMALS[(((year - 4) % 12) + 12) % 12]
  const element = ELEMENTS[Math.floor(((((year - 4) % 10) + 10) % 10) / 2)]
  return { animal, element }
}

const STONES = [
  'Гранат',
  'Аметист',
  'Аквамарин',
  'Бриллиант',
  'Изумруд',
  'Жемчуг',
  'Рубин',
  'Перидот',
  'Сапфир',
  'Опал',
  'Топаз',
  'Бирюза',
]

export function birthstone(date: Date) {
  return STONES[date.getMonth()]
}
