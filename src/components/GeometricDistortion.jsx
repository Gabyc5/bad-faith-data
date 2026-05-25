import { useEffect, useRef } from 'react'

export default function GeometricDistortion({ color = 'rgba(255,59,48,0.35)', density = 12, speed = 0.0008 }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let time = 0

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      time += speed

      for (let i = 0; i < density; i++) {
        const col = i % 4
        const row = Math.floor(i / 4)
        const baseX = (w / 4) * col + w / 8
        const baseY = (h / Math.ceil(density / 4)) * row + h / (Math.ceil(density / 4) * 2)
        const wobbleX = Math.sin(time * 800 + i * 1.7) * 25
        const wobbleY = Math.cos(time * 600 + i * 2.3) * 30
        const size = 30 + Math.sin(time * 400 + i) * 15
        const rotation = time * 200 + i * (Math.PI / 3)

        ctx.save()
        ctx.translate(baseX + wobbleX, baseY + wobbleY)
        ctx.rotate(rotation)
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5

        const sides = 3 + (i % 5)
        ctx.beginPath()
        for (let s = 0; s <= sides; s++) {
          const angle = (s / sides) * Math.PI * 2
          const warp = 1 + Math.sin(time * 500 + s + i) * 0.3
          const px = Math.cos(angle) * size * warp
          const py = Math.sin(angle) * size * warp
          if (s === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()

        if (i % 3 === 0) {
          ctx.beginPath()
          const innerSize = size * (0.3 + Math.sin(time * 300 + i) * 0.15)
          ctx.arc(0, 0, innerSize, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.restore()
      }
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [color, density, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 1,
      }}
    />
  )
}
