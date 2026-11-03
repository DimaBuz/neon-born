export type BirthInput = {
  name: string
  date: string
  time: string
  city: string
}

export function birthDateFrom(input: BirthInput) {
  const [y, m, d] = input.date.split('-').map(Number)
  const [hh, mm] = (input.time || '12:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

export function ageBreakdown(birth: Date, now: Date) {
  let years = now.getFullYear() - birth.getFullYear()
  const lastBirthday = new Date(birth)
  lastBirthday.setFullYear(birth.getFullYear() + years)
  if (lastBirthday > now) {
    years -= 1
    lastBirthday.setFullYear(birth.getFullYear() + years)
  }
  let rest = Math.max(0, now.getTime() - lastBirthday.getTime()) / 1000
  const days = Math.floor(rest / 86400)
  rest -= days * 86400
  const hours = Math.floor(rest / 3600)
  rest -= hours * 3600
  const minutes = Math.floor(rest / 60)
  const seconds = Math.floor(rest - minutes * 60)
  return { years: Math.max(0, years), days, hours, minutes, seconds }
}

export function totalDays(birth: Date, now: Date) {
  return Math.max(0, (now.getTime() - birth.getTime()) / 86_400_000)
}
