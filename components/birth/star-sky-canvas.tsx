'use client'

import { useEffect, useRef } from 'react'

function hashString(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function drawSky(canvas: HTMLCanvasElement, seedKey: string, moonIllumination: number) {
  const cssSize = canvas.clientWidth
  if (!cssSize) return
  const scale = Math.max(2, window.devicePixelRatio || 1) * 1.5
  canvas.width = Math.round(cssSize * scale)
  canvas.height = Math.round(cssSize * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(scale, 0, 0, scale, 0, 0)

  const rand = mulberry32(hashString(seedKey))
  const c = cssSize / 2
  const ringGap = cssSize * 0.035
  const R = c - ringGap - 2

  ctx.clearRect(0, 0, cssSize, cssSize)

  ctx.strokeStyle = 'rgba(30, 27, 22, 0.75)'
  ctx.lineWidth = 0.6
  for (let deg = 0; deg < 360; deg += 2) {
    const a = (deg * Math.PI) / 180
    const len = deg % 30 === 0 ? ringGap * 0.85 : deg % 10 === 0 ? ringGap * 0.55 : ringGap * 0.3
    ctx.beginPath()
    ctx.moveTo(c + Math.cos(a) * (R + 2), c + Math.sin(a) * (R + 2))
    ctx.lineTo(c + Math.cos(a) * (R + 2 + len), c + Math.sin(a) * (R + 2 + len))
    ctx.stroke()
  }

  ctx.save()
  ctx.beginPath()
  ctx.arc(c, c, R, 0, Math.PI * 2)
  ctx.clip()

  const bg = ctx.createRadialGradient(c, c * 0.8, R * 0.1, c, c, R)
  bg.addColorStop(0, '#1a2438')
  bg.addColorStop(1, '#080c15')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, cssSize, cssSize)

  const milky = ctx.createLinearGradient(0, cssSize * (0.2 + rand() * 0.2), cssSize, cssSize * (0.6 + rand() * 0.2))
  milky.addColorStop(0, 'rgba(255,255,255,0)')
  milky.addColorStop(0.5, 'rgba(220,210,190,0.06)')
  milky.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = milky
  ctx.fillRect(0, 0, cssSize, cssSize)

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.14)'
  ctx.lineWidth = 0.5
  for (const f of [0.33, 0.66]) {
    ctx.beginPath()
    ctx.arc(c, c, R * f, 0, Math.PI * 2)
    ctx.stroke()
  }
  for (let deg = 0; deg < 180; deg += 30) {
    const a = (deg * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(c + Math.cos(a) * R, c + Math.sin(a) * R)
    ctx.lineTo(c - Math.cos(a) * R, c - Math.sin(a) * R)
    ctx.stroke()
  }

  const drawStar = (x: number, y: number, r: number, alpha: number) => {
    if (r > 1.1) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4)
      glow.addColorStop(0, `rgba(255, 244, 214, ${alpha * 0.35})`)
      glow.addColorStop(1, 'rgba(255, 244, 214, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, r * 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = `rgba(255, 250, 235, ${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const starCount = 620
  for (let i = 0; i < starCount; i++) {
    const rr = R * Math.sqrt(rand())
    const a = rand() * Math.PI * 2
    const mag = Math.pow(rand(), 3.2)
    drawStar(c + Math.cos(a) * rr, c + Math.sin(a) * rr, 0.25 + mag * 1.5, 0.35 + mag * 0.65)
  }

  const constellations = 7
  for (let k = 0; k < constellations; k++) {
    const cr = R * (0.15 + Math.sqrt(rand()) * 0.65)
    const ca = rand() * Math.PI * 2
    let x = c + Math.cos(ca) * cr
    let y = c + Math.sin(ca) * cr
    const points: [number, number][] = [[x, y]]
    const len = 4 + Math.floor(rand() * 4)
    let heading = rand() * Math.PI * 2
    for (let i = 1; i < len; i++) {
      heading += (rand() - 0.5) * 1.8
      const step = R * (0.07 + rand() * 0.09)
      x += Math.cos(heading) * step
      y += Math.sin(heading) * step
      points.push([x, y])
    }
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)'
    ctx.lineWidth = 0.7
    ctx.beginPath()
    points.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)))
    if (len > 5 && rand() > 0.5) {
      const [bx, by] = points[Math.floor(len / 2)]
      ctx.moveTo(bx, by)
      ctx.lineTo(bx + (rand() - 0.5) * R * 0.25, by + (rand() - 0.5) * R * 0.25)
    }
    ctx.stroke()
    points.forEach(([px, py]) => drawStar(px, py, 1.2 + rand() * 0.9, 1))
  }

  const moonR = R * 0.055
  const mx = c + R * 0.52
  const my = c - R * 0.5
  ctx.fillStyle = 'rgba(255, 246, 220, 0.95)'
  ctx.beginPath()
  ctx.arc(mx, my, moonR, 0, Math.PI * 2)
  ctx.fill()
  const shadowOffset = (moonIllumination / 100) * moonR * 2
  ctx.fillStyle = '#0f1624'
  ctx.beginPath()
  ctx.arc(mx + shadowOffset, my, moonR, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.arc(c, c, R, 0, Math.PI * 2)
  ctx.stroke()
}

export function StarSkyCanvas({ seedKey, moonIllumination }: { seedKey: string; moonIllumination: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSky(canvas, seedKey, moonIllumination)
    const observer = new ResizeObserver(() => drawSky(canvas, seedKey, moonIllumination))
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [seedKey, moonIllumination])

  return (
    <canvas
      ref={ref}
      className="aspect-square w-full"
      role="img"
      aria-label="Карта звёздного неба в момент рождения"
    />
  )
}
