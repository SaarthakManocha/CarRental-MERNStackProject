import { motion, useReducedMotion } from 'framer-motion'
import BackgroundAccents from '../animations/BackgroundAccents'

const PageWrapper = ({ children, className = '', showAccents = true }) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.main
      className={`page-shell ${className}`.trim()}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {showAccents && <BackgroundAccents />}
      {children}
    </motion.main>
  )
}

export default PageWrapper
