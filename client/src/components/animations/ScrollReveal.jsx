import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/* ────────────────────────────────────────────
   ScrollReveal — lightweight float-up reveal
   Uses Framer Motion instead of GSAP/ScrollTrigger
   ──────────────────────────────────────────── */

const ScrollReveal = ({
  children,
  className = '',
  direction = 'up',    // 'up' | 'down' | 'left' | 'right'
  distance = 50,
  duration = 0.6,
  delay = 0,
  once = false,
  viewportAmount = 0.3,
  scale = 1,
  rotate = 0,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: viewportAmount })
  const reduceMotion = useReducedMotion()

  const directionMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }

  const offset = directionMap[direction] || directionMap.up

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: scale !== 1 ? scale : 1,
        rotate,
      }}
      animate={isInView ? {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      } : {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: scale !== 1 ? scale : 1,
        rotate,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
