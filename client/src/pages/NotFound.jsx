import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import GlitchText from '../components/animations/GlitchText'
import PageWrapper from '../components/layout/PageWrapper'

const NotFound = () => (
  <PageWrapper>
    <section className="not-found">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <GlitchText text="404 // Lost In The Pit Lane" />
      </motion.h2>
      <p>The route you requested does not exist.</p>
      <Link to="/" className="btn solid">
        Return Home
      </Link>
    </section>
  </PageWrapper>
)

export default NotFound
