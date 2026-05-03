import { motion, useReducedMotion } from 'framer-motion'

const SplitText = ({ text = '', className = '', delay = 0, stagger = 0.03 }) => {
  const reduceMotion = useReducedMotion()
  const words = text.split(/\s+/).filter(Boolean)

  if (reduceMotion) {
    return <span className={`split-text ${className}`.trim()}>{text}</span>
  }

  return (
    <motion.span
      className={`split-text ${className}`.trim()}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {words.map((word, wordIndex) => (
        <span className="split-word" key={`${word}-${wordIndex}`}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              className="split-char"
              key={`${wordIndex}-${char}-${charIndex}`}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  )
}

export default SplitText
