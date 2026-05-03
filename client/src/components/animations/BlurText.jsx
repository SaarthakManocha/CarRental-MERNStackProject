import { motion, useReducedMotion } from 'framer-motion'

const BlurText = ({ text = '', className = '', delay = 0, duration = 0.55 }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  )
}

export default BlurText
