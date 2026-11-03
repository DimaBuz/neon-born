type TelegramWebApp = {
  ready: () => void
  expand: () => void
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
  showAlert?: (message: string) => void
  shareMessage?: (text: string, url: string) => void
  initData?: string
  initDataUnsafe?: { user?: { first_name?: string } }
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export function getTelegram() {
  if (typeof window === 'undefined') return undefined
  const app = window.Telegram?.WebApp
  return app && app.initData ? app : undefined
}

export function haptic(style: 'light' | 'medium' = 'light') {
  getTelegram()?.HapticFeedback?.impactOccurred(style)
}
