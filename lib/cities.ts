export type City = { name: string; lat: number; lon: number }

export const CITIES: City[] = [
  { name: 'Москва', lat: 55.7558, lon: 37.6173 },
  { name: 'Санкт-Петербург', lat: 59.9343, lon: 30.3351 },
  { name: 'Новосибирск', lat: 55.0084, lon: 82.9357 },
  { name: 'Екатеринбург', lat: 56.8389, lon: 60.6057 },
  { name: 'Казань', lat: 55.7963, lon: 49.1088 },
  { name: 'Нижний Новгород', lat: 56.2965, lon: 43.9361 },
  { name: 'Челябинск', lat: 55.1644, lon: 61.4368 },
  { name: 'Самара', lat: 53.1959, lon: 50.1002 },
  { name: 'Омск', lat: 54.9885, lon: 73.3242 },
  { name: 'Ростов-на-Дону', lat: 47.2357, lon: 39.7015 },
  { name: 'Уфа', lat: 54.7388, lon: 55.9721 },
  { name: 'Красноярск', lat: 56.0153, lon: 92.8932 },
  { name: 'Воронеж', lat: 51.672, lon: 39.1843 },
  { name: 'Пермь', lat: 58.0105, lon: 56.2502 },
  { name: 'Волгоград', lat: 48.708, lon: 44.5133 },
  { name: 'Краснодар', lat: 45.0355, lon: 38.9753 },
  { name: 'Саратов', lat: 51.5331, lon: 46.0342 },
  { name: 'Тюмень', lat: 57.153, lon: 65.5343 },
  { name: 'Ижевск', lat: 56.8526, lon: 53.2045 },
  { name: 'Барнаул', lat: 53.3548, lon: 83.7698 },
  { name: 'Иркутск', lat: 52.287, lon: 104.305 },
  { name: 'Хабаровск', lat: 48.4802, lon: 135.0719 },
  { name: 'Владивосток', lat: 43.1155, lon: 131.8855 },
  { name: 'Ярославль', lat: 57.6261, lon: 39.8845 },
  { name: 'Калининград', lat: 54.7104, lon: 20.4522 },
  { name: 'Сочи', lat: 43.5855, lon: 39.7231 },
  { name: 'Мурманск', lat: 68.9585, lon: 33.0827 },
  { name: 'Архангельск', lat: 64.5399, lon: 40.5152 },
  { name: 'Томск', lat: 56.4846, lon: 84.9476 },
  { name: 'Тула', lat: 54.1931, lon: 37.6173 },
  { name: 'Севастополь', lat: 44.6166, lon: 33.5254 },
  { name: 'Якутск', lat: 62.0355, lon: 129.6755 },
]

export function findCity(name: string) {
  const normalized = name.trim().toLowerCase()
  return CITIES.find((c) => c.name.toLowerCase() === normalized)
}

export function formatCoords(city: City) {
  const lat = `${Math.abs(city.lat).toFixed(4)}° ${city.lat >= 0 ? 'с. ш.' : 'ю. ш.'}`
  const lon = `${Math.abs(city.lon).toFixed(4)}° ${city.lon >= 0 ? 'в. д.' : 'з. д.'}`
  return `${lat} · ${lon}`
}
