export const Utils = {
  isSignificantClick,
  isInsignificantClick
  // handleEnterKey
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
