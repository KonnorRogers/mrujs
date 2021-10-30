import { stopEverything } from '../utils/events'
import { $ } from './dom'

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

export function getCookieValue (cookieName?: string): string | undefined {
  if (cookieName != null) {
    const cookies = document.cookie.trim() !== '' ? document.cookie.split('; ') : []
    const cookie = cookies.find((cookie) => cookie.startsWith(cookieName))
    if (cookie != null) {
      const value = cookie.split('=').slice(1).join('=')
      return (value.trim() !== '' ? decodeURIComponent(value) : undefined)
    }
  }

  return undefined
}

export function getMetaContent (str: string): string | undefined {
  const elements = $(`meta[name="${str}"]`)
  const element = elements[elements.length - 1] as HTMLMetaElement | undefined
  return element?.content ?? undefined
}
