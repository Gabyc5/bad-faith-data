import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GeometricDistortion from '../components/GeometricDistortion'
import GlitchText from '../components/GlitchText'
import './Cover.css'

function Cover() {
  return (
    <div className="cover">
      <GeometricDistortion density={16} speed={0.0002} />

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
          BAD<br/>FAITH<br/>DATA
        </motion.h1>

        <motion.div
          className="cover-tagline-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="cover-tagline-line" />
          <p className="cover-tagline">
            What the numbers say when you stop asking them politely.
          </p>
        </motion.div>

        <motion.div
          className="cover-blurb"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="cover-blurb-text">
            Gas hit $4.50 a gallon. Grocery inflation is climbing again.
            The government says consumer confidence is holding steady.
            People are doing math in the grocery aisle. This zine is about
            the second number.
          </p>
        </motion.div>

        <motion.div
          className="cover-stat-ticker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <div className="ticker-item">
            <span className="ticker-value">$4.55</span>
            <span className="ticker-label">avg gas / gal</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-item">
            <span className="ticker-value">+43.6%</span>
            <span className="ticker-label">gas YoY</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-item">
            <span className="ticker-value">+9.4%</span>
            <span className="ticker-label">beef forecast</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-item">
            <span className="ticker-value">24,000</span>
            <span className="ticker-label">USDA jobs cut</span>
          </div>
        </motion.div>

        <motion.div
          className="cover-issues"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Link to="/issue/01" className="issue-card issue-card-01">
            <span className="issue-number">01</span>
            <span className="issue-card-title">The Cart You Left Behind</span>
            <span className="issue-card-desc">
              The Iran war closed the Strait of Hormuz. Gas prices doubled.
              Fertilizer costs spiked. The grocery store manipulation machine
              is breaking down. Here is the data the spending reports leave out.
            </span>
            <span className="issue-card-cta">Read this issue &#8594;</span>
          </Link>

          <Link to="/issue/02" className="issue-card issue-card-02">
            <span className="issue-number">02</span>
            <span className="issue-card-title">Disclosure Season</span>
            <span className="issue-card-desc">
              The PURSUE files dropped. Defense stocks are at record highs.
              A Hellfire missile hit an orb and did nothing. The data does not
              tell you if aliens are real. It tells you who gets paid either way.
            </span>
            <span className="issue-card-cta">Read this issue &#8594;</span>
          </Link>
        </motion.div>

        <motion.div
          className="cover-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
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
        <GlitchText text="UNVERIFIED" duration={1200} />
      </div>
    </div>
  )
}

export default Cover
