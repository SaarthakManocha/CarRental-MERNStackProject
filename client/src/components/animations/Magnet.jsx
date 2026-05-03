import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const Magnet = ({ className = '', children, strength = 0.2 }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const reduceMotion = useReducedMotion()

  const springX = useSpring(x, { stiffness: 220, damping: 20 })
  const springY = useSpring(y, { stiffness: 220, damping: 20 })

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - rect.left - rect.width / 2
    const py = event.clientY - rect.top - rect.height / 2

    x.set(px * strength)
    y.set(py * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (reduceMotion) {
    return <div className={`magnet-wrap ${className}`.trim()}>{children}</div>
  }

  return (
    <motion.div
      className={`magnet-wrap ${className}`.trim()}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}

export default Magnet
