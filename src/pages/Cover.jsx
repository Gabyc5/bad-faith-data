import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Cover.css'

function Cover() {
  return (
    <div className="cover">
      <div className="cover-grain" />

      <motion.div
        className="cover-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="cover-masthead">
          <span className="cover-issue-label">A DATA ZINE</span>
          <span className="cover-dot">&#9679;</span>
          <span className="cover-issue-label">VOL. 1</span>
          <span className="cover-dot">&#9679;</span>
          <span className="cover-issue-label">2026</span>
        </div>

        <motion.h1
          className="cover-title"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          BAD<br/>
          FAITH<br/>
          DATA
        </motion.h1>

        <motion.p
          className="cover-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          What the numbers say when you stop<br/>
          asking them politely.
        </motion.p>

        <motion.div
          className="cover-blurb"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="cover-blurb-text">
            Every month, the government publishes consumer spending data
            that says the economy is fine. Every month, people are doing
            math in the grocery aisle. This zine is about the second
            number.
          </p>
        </motion.div>

        <motion.div
          className="cover-issues"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link to="/issue/01" className="issue-card issue-card-01">
            <span className="issue-number">01</span>
            <span className="issue-card-title">The Cart You Left Behind</span>
            <span className="issue-card-desc">
              Grocery stores as manipulation machines.
              What happens to the tricks when the economy breaks.
            </span>
            <span className="issue-card-cta">Read this issue &#8594;</span>
          </Link>

          <div className="issue-card issue-card-02 issue-card-locked">
            <span className="issue-number">02</span>
            <span className="issue-card-title">Disclosure Season</span>
            <span className="issue-card-desc">
              UAP disclosure dates vs. defense contractor stock prices.
              The conspiracy that they are not UFOs at all.
            </span>
            <span className="issue-card-cta issue-locked-label">Coming soon</span>
          </div>
        </motion.div>

        <motion.div
          className="cover-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span className="cover-credit">
            built by <a href="https://gabyhernandez.dev" target="_blank" rel="noopener">gaby hernandez</a>
          </span>
          <span className="cover-credit">
            <a href="https://github.com/Gabyc5/bad-faith-data" target="_blank" rel="noopener">source</a>
          </span>
        </motion.div>
      </motion.div>

      <div className="cover-edge-stamp">
        <span>UNVERIFIED</span>
      </div>
    </div>
  )
}

export default Cover
