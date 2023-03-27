import type { Behavior } from "./behavior"
import { listener } from "./events"

export function onClickOutside(fn: (event: Event) => void, when?: () => boolean): Behavior {
  let mousedownOutside = false
  return node => {
    function handleDown(event: Event) {
      if (!node.contains(event.target as Node)) {
          mousedownOutside = true
        }
      }
      listener(document.documentElement, 'mousedown', handleDown, true)
      // Memory leak? Listener not passed anywhere to be removed

    function handleClick(event: Event) {
      if ((event as PointerEvent).pointerType === '') return // ignore space as click
      if (!when || when()) {
        if (!node.contains(event.target as Node) && mousedownOutside) {
          mousedownOutside = false
          if (node.clientWidth) {
            event.preventDefault()
            event.stopPropagation()
            fn(event)
          }
        }
      }
    }

    return listener(document.documentElement, 'click', handleClick, true)
  }
}
