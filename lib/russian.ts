export function plural(n: number, forms: [string, string, string]) {
  const abs = Math.abs(Math.floor(n))
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

export function formatNumber(n: number) {
  return Math.floor(n).toLocaleString('ru-RU')
}

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export const WEEKDAYS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

const DAY_UNITS_NEUTER = [
  '',
  'первое',
  'второе',
  'третье',
  'четвёртое',
  'пятое',
  'шестое',
  'седьмое',
  'восьмое',
  'девятое',
  'десятое',
  'одиннадцатое',
  'двенадцатое',
  'тринадцатое',
  'четырнадцатое',
  'пятнадцатое',
  'шестнадцатое',
  'семнадцатое',
  'восемнадцатое',
  'девятнадцатое',
]

const ORD_GEN_UNITS = [
  '',
  'первого',
  'второго',
  'третьего',
  'четвёртого',
  'пятого',
  'шестого',
  'седьмого',
  'восьмого',
  'девятого',
  'десятого',
  'одиннадцатого',
  'двенадцатого',
  'тринадцатого',
  'четырнадцатого',
  'пятнадцатого',
  'шестнадцатого',
  'семнадцатого',
  'восемнадцатого',
  'девятнадцатого',
]

const TENS_CARDINAL = [
  '',
  '',
  'двадцать',
  'тридцать',
  'сорок',
  'пятьдесят',
  'шестьдесят',
  'семьдесят',
  'восемьдесят',
  'девяносто',
]

const TENS_ORD_GEN = [
  '',
  '',
  'двадцатого',
  'тридцатого',
  'сорокового',
  'пятидесятого',
  'шестидесятого',
  'семидесятого',
  'восьмидесятого',
  'девяностого',
]

const HUNDREDS_CARDINAL = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
]

const HUNDREDS_ORD_GEN = [
  '',
  'сотого',
  'двухсотого',
  'трёхсотого',
  'четырёхсотого',
  'пятисотого',
  'шестисотого',
  'семисотого',
  'восьмисотого',
  'девятисотого',
]

function dayToWords(day: number) {
  if (day < 20) return DAY_UNITS_NEUTER[day]
  const tens = Math.floor(day / 10)
  const units = day % 10
  const tensNeuter = tens === 2 ? 'двадцатое' : 'тридцатое'
  if (units === 0) return tensNeuter
  return `${TENS_CARDINAL[tens]} ${DAY_UNITS_NEUTER[units]}`
}

function yearToWords(year: number) {
  const thousands = Math.floor(year / 1000)
  const rest = year % 1000
  if (rest === 0) return thousands === 2 ? 'двухтысячного' : 'тысячного'
  const prefix = thousands === 2 ? 'две тысячи' : 'тысяча'
  const hundreds = Math.floor(rest / 100)
  const tail = rest % 100
  if (tail === 0) return `${prefix} ${HUNDREDS_ORD_GEN[hundreds]}`
  const parts = [prefix]
  if (hundreds) parts.push(HUNDREDS_CARDINAL[hundreds])
  if (tail < 20) {
    parts.push(ORD_GEN_UNITS[tail])
  } else {
    const tens = Math.floor(tail / 10)
    const units = tail % 10
    if (units === 0) parts.push(TENS_ORD_GEN[tens])
    else parts.push(TENS_CARDINAL[tens], ORD_GEN_UNITS[units])
  }
  return parts.join(' ')
}

export function dateInWords(date: Date) {
  return `${dayToWords(date.getDate())} ${MONTHS_GENITIVE[date.getMonth()]} ${yearToWords(date.getFullYear())} года`
}

export function shortDate(date: Date) {
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`
}

export function spacedUpper(text: string) {
  return text.toUpperCase().split('').join(' ')
}
