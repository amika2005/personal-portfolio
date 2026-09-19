/**
 * Letters flip up and a copy rolls in from below when the nearest `group` is hovered.
 * Screen readers get the plain text once.
 */
export function RollText({ text, stagger = 0.012 }: { text: string; stagger?: number }) {
  return (
    <span className="inline-flex" aria-label={text}>
      {text.split("").map((char, i) => {
        const c = char === " " ? " " : char
        const delay = { transitionDelay: `${i * stagger}s` }
        return (
          <span key={i} aria-hidden className="relative inline-block overflow-hidden">
            <span
              className="block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full"
              style={delay}
            >
              {c}
            </span>
            <span
              className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-y-0"
              style={delay}
            >
              {c}
            </span>
          </span>
        )
      })}
    </span>
  )
}
