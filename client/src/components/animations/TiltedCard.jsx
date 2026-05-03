import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const TiltedCard = ({ className = '', children, accent, style = {} }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const reduceMotion = useReducedMotion()

  const rotateX = useSpring(useTransform(y, [-35, 35], [12, -12]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-35, 35], [-14, 14]), { stiffness: 180, damping: 18 })

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - rect.left - rect.width / 2
    const py = event.clientY - rect.top - rect.height / 2
    x.set(px / 8)
    y.set(py / 8)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const cardStyle = reduceMotion
    ? { '--card-accent': accent, ...style }
    : { rotateX, rotateY, transformPerspective: 1000, '--card-accent': accent, ...style }

  return (
    <motion.article
      className={`tilted-card ${className}`.trim()}
      style={cardStyle}
      onMouseMove={reduceMotion ? undefined : handleMove}
      onMouseLeave={reduceMotion ? undefined : handleLeave}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
    >
      {children}
    </motion.article>
  )
}

export default TiltedCard
