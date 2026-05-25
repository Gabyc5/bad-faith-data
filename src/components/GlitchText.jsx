import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789'

export default function GlitchText({ text, tag = 'span', className = '', duration = 600 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(text)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView || done) return

    let frame = 0
    const totalFrames = Math.floor(duration / 30)
    const chars = text.split('')

    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const revealed = Math.floor(progress * chars.length)

      const result = chars.map((char, i) => {
        if (i < revealed) return char
        if (char === ' ') return ' '
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }).join('')

      setDisplay(result)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplay(text)
        setDone(true)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [inView, text, duration, done])

  const Tag = tag
  return <Tag ref={ref} className={className}>{display}</Tag>
}
