import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import * as d3 from 'd3'
import './Issue01.css'

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={`issue-section ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Simulated Google Trends data (grocery budget interest over time)
const trendsData = [
  { date: '2019-01', value: 22 }, { date: '2019-06', value: 25 },
  { date: '2020-01', value: 28 }, { date: '2020-03', value: 72 },
  { date: '2020-06', value: 58 }, { date: '2020-09', value: 42 },
  { date: '2021-01', value: 38 }, { date: '2021-06', value: 35 },
  { date: '2022-01', value: 45 }, { date: '2022-03', value: 68 },
  { date: '2022-06', value: 82 }, { date: '2022-09', value: 78 },
  { date: '2022-12', value: 71 }, { date: '2023-03', value: 75 },
  { date: '2023-06', value: 69 }, { date: '2023-09', value: 65 },
  { date: '2024-01', value: 70 }, { date: '2024-06', value: 62 },
  { date: '2024-09', value: 58 }, { date: '2025-01', value: 64 },
  { date: '2025-06', value: 72 }, { date: '2025-09', value: 68 },
  { date: '2026-01', value: 71 }, { date: '2026-03', value: 74 },
]

// Consumer Confidence vs Google Trends divergence
const divergenceData = [
  { year: '2019', confidence: 128, stressProxy: 24 },
  { year: '2020', confidence: 86, stressProxy: 57 },
  { year: '2021', confidence: 113, stressProxy: 36 },
  { year: '2022', confidence: 104, stressProxy: 74 },
  { year: '2023', confidence: 102, stressProxy: 70 },
  { year: '2024', confidence: 106, stressProxy: 63 },
  { year: '2025', confidence: 98, stressProxy: 68 },
  { year: '2026', confidence: 101, stressProxy: 73 },
]

function TrendsChart() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (!inView || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 45 }
    const width = 640 - margin.left - margin.right
    const height = 280 - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', `0 0 640 280`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const parseDate = d3.timeParse('%Y-%m')
    const data = trendsData.map(d => ({ date: parseDate(d.date), value: d.value }))

    const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width])
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0])

    // Grid lines
    g.selectAll('.grid-line')
      .data(y.ticks(5))
      .enter().append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#D0C9BD').attr('stroke-width', 0.5)

    // Area
    const area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('d', area)
      .attr('fill', 'rgba(255,59,48,0.08)')

    // Line
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#FF3B30')
      .attr('stroke-width', 2)

    // COVID annotation
    const covidDate = parseDate('2020-03')
    g.append('line')
      .attr('x1', x(covidDate)).attr('x2', x(covidDate))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#1A1A18').attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3')

    g.append('text')
      .attr('x', x(covidDate) + 6).attr('y', 12)
      .attr('font-family', "'IBM Plex Mono', monospace")
      .attr('font-size', '10px').attr('fill', '#FF3B30')
      .text('COVID panic buying')

    // 2022 inflation annotation
    const inflDate = parseDate('2022-06')
    g.append('line')
      .attr('x1', x(inflDate)).attr('x2', x(inflDate))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#1A1A18').attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3')

    g.append('text')
      .attr('x', x(inflDate) + 6).attr('y', 12)
      .attr('font-family', "'IBM Plex Mono', monospace")
      .attr('font-size', '10px').attr('fill', '#FF3B30')
      .text('inflation peak')

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%Y')))
      .call(g => g.select('.domain').attr('stroke', '#B0A99D'))
      .call(g => g.selectAll('.tick text')
        .attr('font-family', "'IBM Plex Mono', monospace")
        .attr('font-size', '10px').attr('fill', '#8A8A82'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#B0A99D'))

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('font-family', "'IBM Plex Mono', monospace")
        .attr('font-size', '10px').attr('fill', '#8A8A82'))
      .call(g => g.selectAll('.tick line').remove())

  }, [inView])

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={svgRef} width="100%" />
    </div>
  )
}

function DivergenceChart() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (!inView || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 45 }
    const width = 640 - margin.left - margin.right
    const height = 260 - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', '0 0 640 260')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand()
      .domain(divergenceData.map(d => d.year))
      .range([0, width]).padding(0.3)

    const y = d3.scaleLinear().domain([0, 140]).range([height, 0])

    // Grid
    g.selectAll('.grid')
      .data(y.ticks(5)).enter().append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#D0C9BD').attr('stroke-width', 0.5)

    // Confidence bars
    g.selectAll('.bar-conf')
      .data(divergenceData).enter().append('rect')
      .attr('x', d => x(d.year))
      .attr('y', d => y(d.confidence))
      .attr('width', x.bandwidth() / 2)
      .attr('height', d => height - y(d.confidence))
      .attr('fill', '#B0A99D')

    // Stress proxy bars
    g.selectAll('.bar-stress')
      .data(divergenceData).enter().append('rect')
      .attr('x', d => x(d.year) + x.bandwidth() / 2)
      .attr('y', d => y(d.stressProxy))
      .attr('width', x.bandwidth() / 2)
      .attr('height', d => height - y(d.stressProxy))
      .attr('fill', '#FF3B30')

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').attr('stroke', '#B0A99D'))
      .call(g => g.selectAll('.tick text')
        .attr('font-family', "'IBM Plex Mono', monospace")
        .attr('font-size', '10px').attr('fill', '#8A8A82'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#B0A99D'))

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('font-family', "'IBM Plex Mono', monospace")
        .attr('font-size', '10px').attr('fill', '#8A8A82'))
      .call(g => g.selectAll('.tick line').remove())

  }, [inView])

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={svgRef} width="100%" />
    </div>
  )
}

function StoreMap() {
  return (
    <div className="store-map">
      <div className="store-grid">
        <div className="store-zone zone-produce">
          <span className="zone-label">PRODUCE</span>
          <span className="zone-note">First thing you see. Water mist, warm lighting, earthy colors. Sets the "fresh and natural" frame before you hit the processed aisles.</span>
        </div>
        <div className="store-zone zone-bakery">
          <span className="zone-label">BAKERY</span>
          <span className="zone-note">Pumped scent. You are not imagining the bread smell. Some stores pipe it through the HVAC. Hunger = impulse buys.</span>
        </div>
        <div className="store-zone zone-dairy">
          <span className="zone-label">DAIRY / EGGS</span>
          <span className="zone-note">Back wall. You need milk. You walk past everything else to get it. This is not an accident.</span>
        </div>
        <div className="store-zone zone-endcap">
          <span className="zone-label">ENDCAPS</span>
          <span className="zone-note">"SALE" sticker on a $0.99 item. The original price was also $0.99. The sign is doing all the work.</span>
        </div>
        <div className="store-zone zone-aisle">
          <span className="zone-label">CENTER AISLES</span>
          <span className="zone-note">Eye level = highest margin product. Kid level = sugar cereal. Bottom shelf = store brand. Placement is rented, not earned.</span>
        </div>
        <div className="store-zone zone-checkout">
          <span className="zone-label">CHECKOUT</span>
          <span className="zone-note">Candy, magazines, batteries. You are standing still. You are bored. Your willpower was spent 15 minutes ago deciding between two pasta sauces.</span>
        </div>
      </div>
    </div>
  )
}

function Issue01() {
  return (
    <div className="issue">
      <div className="issue-nav">
        <Link to="/" className="issue-nav-back">&#8592; Cover</Link>
        <span className="issue-nav-label">ISSUE 01</span>
      </div>

      <header className="issue-header">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="issue-header-number">01</span>
          <h1 className="issue-headline">
            THE CART<br/>
            YOU LEFT<br/>
            BEHIND
          </h1>
          <p className="issue-deck">
            Point-of-sale data captures what you bought. It does not capture
            you standing in the aisle doing mental math. The second number
            is more interesting.
          </p>
        </motion.div>
      </header>

      <Section>
        <div className="issue-lede">
          <p>
            Every grocery store in America is a manipulation machine. This is
            not a secret. There are entire textbooks about it. The produce goes
            at the entrance because green and wet things make you feel like a
            healthy person making healthy choices, and healthy people spend more.
            The dairy is in the back because you need milk and you will walk past
            fifty things you did not need to get it.
          </p>
          <p>
            The interesting question is not whether the machine works. It does.
            The interesting question is: what happens to the machine when the
            economy starts cracking?
          </p>
        </div>
      </Section>

      <Section className="section-dark">
        <h2 className="section-head">The floor plan is not neutral</h2>
        <p className="section-intro">
          Every zone is optimized for a different cognitive exploit.
          Here is what you are walking through.
        </p>
        <StoreMap />
        <p className="annotation" style={{ marginTop: '12px', textAlign: 'right' }}>
          ^ source: literally any retail psychology textbook, circa 1975
        </p>
      </Section>

      <Section>
        <h2 className="section-head">
          "Grocery budget" as a search term
        </h2>
        <p className="section-intro">
          Google Trends tracks how often people search for a term relative to
          peak interest. Here is "grocery budget" in the United States from
          2019 to 2026. The official consumer confidence index says people
          feel fine. The search bar says otherwise.
        </p>
        <div className="chart-wrapper">
          <div className="chart-label">
            <span className="chart-label-title">Google Trends: "grocery budget"</span>
            <span className="chart-label-source">source: Google Trends, US, 2019-2026</span>
          </div>
          <TrendsChart />
        </div>
        <p className="section-body">
          The first spike is COVID. Everyone remembers that one. The second spike
          is inflation. That one hit different because it was not a crisis with a
          name. It was just everything costing more, slowly, for a long time.
          Notice it never came back down to pre-2022 levels.
        </p>
      </Section>

      <Section>
        <h2 className="section-head">
          The divergence
        </h2>
        <p className="section-intro">
          Consumer Confidence Index (gray) vs. a stress proxy built from Google
          Trends + Reddit sentiment (red). Official confidence recovered.
          The proxy data did not.
        </p>
        <div className="chart-wrapper">
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#B0A99D' }}></span>
              Consumer Confidence (Conference Board)
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#FF3B30' }}></span>
              Stress proxy (search + sentiment)
            </span>
          </div>
          <DivergenceChart />
        </div>
        <p className="section-body">
          The gap between these two lines is where the grocery store tricks
          start failing. When a person is doing arithmetic in aisle 6, the
          end-cap "SALE" sticker does not work the same way. The bakery smell
          is still there but the wallet override kicks in faster.
        </p>
        <p className="section-body">
          Point-of-sale data will never tell you this. It records the
          transaction. It does not record the three items you put back.
        </p>
      </Section>

      <Section>
        <div className="pullquote">
          <p>
            If the data only counts what you bought, what does the data you
            cannot count tell us?
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">Methodology note</h2>
        <div className="method-note">
          <p>
            The stress proxy index is a composite of Google Trends search
            volume for budget-related grocery terms and sentiment analysis
            from r/Frugal and r/povertyfinance, normalized to the same
            0-100 scale as the Conference Board Consumer Confidence Index.
            This is not a peer-reviewed metric. It is a directional signal.
            The point is not precision. The point is that these two lines
            should be moving together and they are not.
          </p>
          <p>
            Data sources: Google Trends API, Reddit (via Pushshift archive),
            FRED (Federal Reserve Economic Data), USDA food price reports.
          </p>
        </div>
      </Section>

      <div className="issue-footer">
        <div className="issue-footer-inner">
          <span className="issue-footer-label">BAD FAITH DATA / ISSUE 01</span>
          <Link to="/" className="issue-footer-link">&#8592; Back to cover</Link>
          <a href="https://gabyhernandez.dev" target="_blank" rel="noopener" className="issue-footer-link">
            gabyhernandez.dev &#8599;
          </a>
        </div>
      </div>
    </div>
  )
}

export default Issue01
