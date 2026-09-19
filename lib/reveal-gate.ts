/**
 * Full-screen covers (the intro, page transitions) hold this gate so heading reveals
 * don't play underneath them. Reveals wait on `onRevealsReady` until every hold is released.
 */
let holds = 0
const listeners = new Set<() => void>()

export function holdReveals() {
  holds++
  let released = false
  return () => {
    if (released) return
    released = true
    holds--
    // deferred and re-checked so a Strict Mode unmount/remount (release → re-hold in the
    // same commit) doesn't flush the reveals while the cover is still up
    setTimeout(() => {
      if (holds > 0) return
      listeners.forEach((cb) => cb())
      listeners.clear()
    }, 0)
  }
}

/** Runs `cb` once no cover is up, right away if none is. Returns an unsubscribe. */
export function onRevealsReady(cb: () => void) {
  if (holds === 0) {
    cb()
    return () => {}
  }
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
