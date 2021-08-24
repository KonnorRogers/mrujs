import { stopEverything } from '../utils/events'

export function isInsignificantClick (event: MouseEvent): boolean {
  return (
    ((event.target != null) && (event.target as HTMLElement).isContentEditable) ||
      event.defaultPrevented ||
      event.button > 0 || // Only left clicks!
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  )
}

export function isSignificantClick (event: MouseEvent): boolean {
  return !isInsignificantClick(event)
}

export function preventInsignificantClick (event: MouseEvent): void {
  if (isSignificantClick(event)) return

  stopEverything(event)
}

export function getCookieValue (cookieName: string | null): string | null {
  if (cookieName != null) {
    const cookies = document.cookie.trim() !== '' ? document.cookie.split('; ') : []
    const cookie = cookies.find((cookie) => cookie.startsWith(cookieName))
    if (cookie != null) {
      const value = cookie.split('=').slice(1).join('=')
      return (value.trim() !== '' ? decodeURIComponent(value) : null)
    }
  }

  return null
}

export function getMetaContent (str: string): string | null {
  const element: HTMLMetaElement | null = document.querySelector(`meta[name="${str}"]`)
  return element?.content ?? null
}
