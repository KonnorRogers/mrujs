export const Utils = {
  isSignificantClick,
  isInsignificantClick,
  // handleEnterKey
  getMetaContent,
  getCookieValue
}

function isSignificantClick (event: MouseEvent): boolean {
  return !(
    ((event.target != null) && (event.target as HTMLElement).isContentEditable) ||
      event.defaultPrevented ||
      event.button > 0 || // Only left clicks!
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  )
}

function isInsignificantClick (event: MouseEvent): boolean {
  return !isSignificantClick(event)
}

// function handleEnterKey(event: KeyboardEvent): void {
//   if (event.key !== "Enter") return

//   if (event.altKey === true) {
//     // new Tab
//     return
//   }

//   if (event.shiftKey === true) {
//     // new Window
//     return
//   }
// }

// function preventInsignificantClick (event: MouseEvent): void {
//   if (isSignificantClick(event)) return

//   event.stopImmediatePropagation
// }

function getCookieValue (cookieName: string | null): string | null {
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

function getMetaContent (str: string): string | null {
  const element: HTMLMetaElement | null = document.querySelector(`meta[name="${str}"]`)
  return element?.content ?? null
}
