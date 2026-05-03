import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

const SpotlightCard = ({ className = '', children, accent, style = {} }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const reduceMotion = useReducedMotion()

  const handleMove = (event) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <motion.article
      className={`spotlight-card ${className}`.trim()}
      style={{ '--spot-x': `${pos.x}%`, '--spot-y': `${pos.y}%`, '--card-accent': accent, ...style }}
      onMouseMove={reduceMotion ? undefined : handleMove}
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.01 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
    >
      {children}
    </motion.article>
  )
}

export default SpotlightCard
