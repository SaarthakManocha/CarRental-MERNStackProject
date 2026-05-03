import { useRef, useCallback, useEffect } from 'react'

/* ────────────────────────────────
   BorderGlow — lightweight version
   Single conic-gradient rotation
   ──────────────────────────────── */

const BorderGlow = ({
  children,
  className = '',
  backgroundColor = '#030508',
  borderRadius = 20,
  glowColors = ['rgba(56, 189, 248, 0.05)', 'rgba(106, 227, 255, 0.6)', 'rgba(14, 165, 233, 0.8)'],
}) => {
  const cardRef = useRef(null)

  /* Rotating glow — throttled to 30fps */
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    card.classList.add('always-glow')

    let angle = 0
    let lastTime = 0
    let raf

    const animate = (now) => {
      raf = requestAnimationFrame(animate)
      if (now - lastTime < 33) return
      lastTime = now
      angle = (angle + 2) % 360
      card.style.setProperty('--cursor-angle', `${angle}deg`)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  /* Intensify on hover */
  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--glow-a', glowColors[0].replace(/[\d.]+\)$/, '0.2)'))
    card.style.setProperty('--glow-b', glowColors[1].replace(/[\d.]+\)$/, '0.9)'))
    card.style.setProperty('--glow-c', glowColors[2].replace(/[\d.]+\)$/, '1)'))
  }, [glowColors])

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--glow-a', glowColors[0])
    card.style.setProperty('--glow-b', glowColors[1])
    card.style.setProperty('--glow-c', glowColors[2])
  }, [glowColors])

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--border-radius': `${borderRadius}px`,
        '--glow-a': glowColors[0],
        '--glow-b': glowColors[1],
        '--glow-c': glowColors[2],
      }}
    >
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  )
}

export default BorderGlow
