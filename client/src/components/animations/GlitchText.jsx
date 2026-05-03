import { motion, useReducedMotion } from 'framer-motion'

const GlitchText = ({ text = '', className = '' }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <span className={`glitch-text ${className}`.trim()}>{text}</span>
  }

  return (
    <motion.span
      className={`glitch-text ${className}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      data-text={text}
    >
      {text}
    </motion.span>
  )
}

export default GlitchText
