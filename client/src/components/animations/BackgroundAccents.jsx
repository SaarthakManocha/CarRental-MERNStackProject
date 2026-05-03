import { motion, useReducedMotion } from 'framer-motion'

const BackgroundAccents = () => {
  const reduceMotion = useReducedMotion()

  return (
    <div className="bg-accents" aria-hidden>
      <motion.div
        className="bg-aurora"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7 }}
      />
      <motion.div
        className="bg-beams"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.08, duration: 0.7 }}
      />
      <motion.div
        className="bg-noise"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.14, duration: 0.7 }}
      />
    </div>
  )
}

export default BackgroundAccents
