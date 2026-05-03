import { Children } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const AnimatedList = ({ className = '', children }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{Children.map(children, (child, index) => <div key={index}>{child}</div>)}</div>
  }

  return (
    <motion.div className={className} variants={container} initial="hidden" animate="visible">
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={item} transition={{ duration: 0.35 }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default AnimatedList
