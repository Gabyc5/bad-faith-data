import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import * as d3 from 'd3'
import GeometricDistortion from '../components/GeometricDistortion'
import GlitchText from '../components/GlitchText'
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

// Real gas price data (EIA weekly averages, USD/gallon regular)
const gasData = [
  { date: '2025-01', price: 3.08 }, { date: '2025-03', price: 3.15 },
  { date: '2025-06', price: 3.42 }, { date: '2025-09', price: 3.22 },
  { date: '2025-12', price: 3.14 }, { date: '2026-01', price: 3.02 },
  { date: '2026-02', price: 2.98 }, { date: '2026-03', price: 3.64 },
  { date: '2026-04', price: 4.10 }, { date: '2026-05', price: 4.55 },
]

// USDA food category inflation forecasts 2026 (% YoY)
const foodInflation = [
  { category: 'Beef & veal', pct: 9.4, high: 16.6, color: '#FF3B30' },
  { category: 'Sugar & sweets', pct: 6.7, high: 10.2, color: '#FF6D00' },
  { category: 'Non-alc. beverages', pct: 5.2, high: 8.8, color: '#FF6D00' },
  { category: 'Other meats', pct: 3.8, high: 7.1, color: '#C45A00' },
  { category: 'Fats & oils', pct: 3.5, high: 6.9, color: '#C45A00' },
  { category: 'Cereals & bakery', pct: 1.1, high: 5.5, color: '#8A8A82' },
  { category: 'Fresh vegetables', pct: 1.4, high: 4.2, color: '#8A8A82' },
  { category: 'Eggs', pct: -22.2, high: 1.1, color: '#00C853' },
]

// Federal workforce cuts (OPM data)
const fedCuts = [
  { agency: 'USDA (total)', lost: 24000, total: 106000 },
  { agency: 'FDA', lost: 4332, total: 16602 },
  { agency: 'CDC', lost: 2889, total: 9769 },
  { agency: 'FSIS (food safety)', lost: 913, total: 7526 },
  { agency: 'FNS (SNAP/nutrition)', lost: 564, total: 1224 },
]

function GasPriceChart() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (!inView || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 30, right: 50, bottom: 40, left: 50 }
    const width = 640 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom
    const g = svg.attr('viewBox', '0 0 640 300')
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const parseDate = d3.timeParse('%Y-%m')
    const data = gasData.map(d => ({ date: parseDate(d.date), price: d.price }))

    const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width])
    const y = d3.scaleLinear().domain([2.5, 5.0]).range([height, 0])

    // War zone shading
    const warStart = parseDate('2026-02')
    g.append('rect')
      .attr('x', x(warStart)).attr('y', 0)
      .attr('width', width - x(warStart)).attr('height', height)
      .attr('fill', 'rgba(255,59,48,0.06)')

    g.append('text')
      .attr('x', x(warStart) + 8).attr('y', 14)
      .attr('font-family', "'IBM Plex Mono', monospace")
      .attr('font-size', '10px').attr('fill', '#FF3B30').attr('font-weight', '700')
      .text('WAR BEGINS FEB 28')

    // Hormuz annotation
    const hormuzDate = parseDate('2026-03')
    g.append('line')
      .attr('x1', x(hormuzDate)).attr('x2', x(hormuzDate))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#1A1A18').attr('stroke-width', 1).attr('stroke-dasharray', '3,3')

    g.append('text')
      .attr('x', x(hormuzDate) + 6).attr('y', 30)
      .attr('font-family', "'IBM Plex Mono', monospace")
      .attr('font-size', '9px').attr('fill', '#FF6D00')
      .text('Strait of Hormuz closed')

    // Grid
    g.selectAll('.grid').data(y.ticks(5)).enter().append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#D0C9BD').attr('stroke-width', 0.5)

    // Area
    g.append('path').datum(data)
      .attr('d', d3.area().x(d => x(d.date)).y0(height).y1(d => y(d.price)).curve(d3.curveMonotoneX))
      .attr('fill', 'rgba(255,59,48,0.1)')

    // Line
    g.append('path').datum(data)
      .attr('d', d3.line().x(d => x(d.date)).y(d => y(d.price)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', '#FF3B30').attr('stroke-width', 2.5)

    // Price labels on key points
    const labels = [
      { date: '2026-02', label: '$2.98' },
      { date: '2026-05', label: '$4.55' },
    ]
    labels.forEach(l => {
      const d = data.find(dd => dd.date.getTime() === parseDate(l.date).getTime())
      if (!d) return
      g.append('circle').attr('cx', x(d.date)).attr('cy', y(d.price)).attr('r', 4).attr('fill', '#FF3B30')
      g.append('text')
        .attr('x', x(d.date)).attr('y', y(d.price) - 10)
        .attr('text-anchor', 'middle')
        .attr('font-family', "'IBM Plex Mono', monospace")
        .attr('font-size', '12px').attr('font-weight', '700').attr('fill', '#1A1A18')
        .text(l.label)
    })

    // Axes
    g.append('g').attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%b '%y")))
      .call(g => g.select('.domain').attr('stroke', '#B0A99D'))
      .call(g => g.selectAll('.tick text').attr('font-family', "'IBM Plex Mono'").attr('font-size', '10px').attr('fill', '#8A8A82'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#B0A99D'))

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => '$' + d.toFixed(2)))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text').attr('font-family', "'IBM Plex Mono'").attr('font-size', '10px').attr('fill', '#8A8A82'))
      .call(g => g.selectAll('.tick line').remove())

  }, [inView])

  return <div ref={containerRef} className="chart-container"><svg ref={svgRef} width="100%" /></div>
}

function FoodInflationChart() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (!inView || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 10, right: 60, bottom: 20, left: 130 }
    const width = 640 - margin.left - margin.right
    const height = 320 - margin.top - margin.bottom
    const g = svg.attr('viewBox', '0 0 640 320')
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3.scaleBand().domain(foodInflation.map(d => d.category)).range([0, height]).padding(0.25)
    const x = d3.scaleLinear().domain([-25, 18]).range([0, width])

    // Zero line
    g.append('line')
      .attr('x1', x(0)).attr('x2', x(0))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#1A1A18').attr('stroke-width', 1)

    // Bars
    foodInflation.forEach(d => {
      const barStart = d.pct >= 0 ? x(0) : x(d.pct)
      const barWidth = Math.abs(x(d.pct) - x(0))

      g.append('rect')
        .attr('x', barStart).attr('y', y(d.category))
        .attr('width', barWidth).attr('height', y.bandwidth())
        .attr('fill', d.color).attr('opacity', 0.85)

      // Worst-case range indicator
      if (d.high > d.pct) {
        g.append('line')
          .attr('x1', x(d.pct)).attr('x2', x(d.high))
          .attr('y1', y(d.category) + y.bandwidth() / 2)
          .attr('y2', y(d.category) + y.bandwidth() / 2)
          .attr('stroke', d.color).attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3,2').attr('opacity', 0.5)

        g.append('line')
          .attr('x1', x(d.high)).attr('x2', x(d.high))
          .attr('y1', y(d.category) + y.bandwidth() * 0.2)
          .attr('y2', y(d.category) + y.bandwidth() * 0.8)
          .attr('stroke', d.color).attr('stroke-width', 1).attr('opacity', 0.5)
      }

      // Value label
      const labelX = d.pct >= 0 ? x(d.pct) + 6 : x(d.pct) - 6
      g.append('text')
        .attr('x', labelX)
        .attr('y', y(d.category) + y.bandwidth() / 2 + 4)
        .attr('text-anchor', d.pct >= 0 ? 'start' : 'end')
        .attr('font-family', "'IBM Plex Mono'").attr('font-size', '11px')
        .attr('font-weight', '700').attr('fill', '#1A1A18')
        .text((d.pct >= 0 ? '+' : '') + d.pct + '%')
    })

    // Category labels
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('font-family', "'IBM Plex Mono'").attr('font-size', '11px').attr('fill', '#4A4A45'))

  }, [inView])

  return <div ref={containerRef} className="chart-container"><svg ref={svgRef} width="100%" /></div>
}

function Issue01() {
  return (
    <div className="issue">
      <div className="issue-nav">
        <Link to="/" className="issue-nav-back">&#8592; Cover</Link>
        <span className="issue-nav-label">ISSUE 01</span>
      </div>

      <header className="issue-header">
        <div className="issue-header-bg">
          <GeometricDistortion density={8} speed={0.00006} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <span className="issue-header-number">01</span>
          <h1 className="issue-headline">
            <GlitchText text="THE CART YOU LEFT BEHIND" tag="span" duration={800} />
          </h1>
          <p className="issue-deck">
            On February 28, 2026, the United States went to war with Iran.
            On March 4, Iran closed the Strait of Hormuz. Gas went from
            $2.98 to $4.55 in three months. This is what that looks like
            from the grocery aisle.
          </p>
        </motion.div>
      </header>

      <Section>
        <div className="issue-lede">
          <p>
            Every grocery store in America is a manipulation machine. The produce
            goes at the entrance because green and wet things make you feel like
            a healthy person making healthy choices. The dairy is in the back
            because you need milk and you will walk past fifty things to get it.
            The bakery pumps scent through the HVAC. The checkout lane is
            engineered around the fact that your willpower was spent fifteen
            minutes ago deciding between two pasta sauces.
          </p>
          <p>
            These tricks work when the economy is stable. When gas costs $4.55 a
            gallon just to drive to the store, when beef is projected to climb
            9.4% this year and could hit 16.6%, when the agencies that inspect
            your food have lost a quarter of their staff. The tricks stop working.
            People start doing math.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">The price of getting there</h2>
        <p className="section-intro">
          US average retail gasoline, regular unleaded. The shaded zone is the
          war period. The one-month jump from February to March 2026 was the
          sharpest gas price spike in decades. Larger than Katrina. Larger than
          Russia invading Ukraine.
        </p>
        <div className="chart-wrapper">
          <div className="chart-label">
            <span className="chart-label-title">US avg. gas price ($/gallon)</span>
            <span className="chart-label-source">source: EIA, AAA, May 2026</span>
          </div>
          <GasPriceChart />
        </div>
        <p className="section-body">
          $4.55 per gallon. For a 15-gallon tank that is $68 to fill up. A year
          ago it was $47. That is $21 more every fill-up. For someone who fills
          up twice a month, that is $500 a year that used to be grocery money.
        </p>
      </Section>

      <Section>
        <div className="callout-box">
          <span className="callout-label">THE PIPELINE</span>
          <p className="callout-text">
            Oil does not just move cars. It is the raw material for fertilizer
            (nitrogen-based, derived from natural gas). It is the diesel in
            every truck that moves food from farm to warehouse to store. It is
            the natural gas that heats greenhouses, the petroleum in plastic
            packaging, the fuel for refrigerated transport. When Brent crude
            goes past $120 a barrel, it does not stay at the gas station.
            It walks into the grocery store behind you.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">What is actually getting more expensive</h2>
        <p className="section-intro">
          USDA 2026 price forecasts by category. The bar is the midpoint estimate.
          The dashed line is the upper bound of the forecast range. Beef could
          hit +16.6%. Eggs are the only category expected to fall, and even that
          range extends to +1.1%.
        </p>
        <div className="chart-wrapper">
          <div className="chart-label">
            <span className="chart-label-title">2026 food price forecast (% change YoY)</span>
            <span className="chart-label-source">source: USDA ERS Food Price Outlook, May 2026</span>
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#FF3B30' }}></span>
              Midpoint estimate
            </span>
            <span className="legend-item">
              <span className="legend-swatch legend-swatch-dashed"></span>
              Upper bound (worst case)
            </span>
          </div>
          <FoodInflationChart />
        </div>
        <p className="section-body">
          The USDA forecast range for overall grocery inflation in 2026 spans
          from -2.3% to +6.0%. That width is not normal. It reflects what
          economists are calling "deep uncertainty" driven by energy costs,
          tariffs, fertilizer prices, and the ongoing Hormuz crisis. The
          midpoint is 1.7%. The April data already came in at 2.9% year over year.
        </p>
      </Section>

      <Section className="section-dark">
        <h2 className="section-head">The floor plan is not neutral</h2>
        <p className="section-intro">
          Before the macro shocks, there is the micro manipulation. Every zone
          of a grocery store is optimized for a different cognitive exploit.
        </p>
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
            <span className="zone-note">Candy, magazines, batteries. You are standing still. You are bored. Your willpower was spent 15 minutes ago.</span>
          </div>
        </div>
        <p className="annotation" style={{ marginTop: '12px', textAlign: 'right' }}>
          ^ source: literally any retail psychology textbook, circa 1975
        </p>
      </Section>

      <Section>
        <h2 className="section-head">Meanwhile, the people who watch the food</h2>
        <p className="section-intro">
          While food prices climb, the federal agencies responsible for food safety
          and nutrition programs have been gutted. DOGE-driven buyouts removed
          over 24,000 USDA employees in 2025. The FDA lost nearly 4,000. Food
          safety inspectors, SNAP administrators, the people who test milk quality.
          SNAP work requirements were expanded to cover adults up to age 64.
          School nutrition funding was cut by $1 billion.
        </p>
        <div className="cuts-grid">
          {fedCuts.map(d => (
            <div key={d.agency} className="cut-card">
              <span className="cut-agency">{d.agency}</span>
              <span className="cut-number">-{d.lost.toLocaleString()}</span>
              <div className="cut-bar-track">
                <div className="cut-bar-fill" style={{ width: `${(d.lost / d.total) * 100}%` }} />
              </div>
              <span className="cut-pct">{Math.round((d.lost / d.total) * 100)}% of workforce</span>
            </div>
          ))}
        </div>
        <p className="section-body">
          The USDA Food Safety and Inspection Service lost 913 staff. They are
          the people who stand in slaughterhouses and processing plants. The Food
          and Nutrition Service, which administers SNAP, lost 564 of 1,224
          employees. That is 46% of the agency that feeds 42 million Americans.
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
        <h2 className="section-head">The cart you left behind</h2>
        <div className="issue-lede">
          <p>
            Consumer spending data captures the transaction. It does not capture
            the three items you put back. It does not capture the drive to the
            cheaper store across town that now costs $8 more in gas. It does
            not capture the person who switched from beef to chicken in March,
            or the parent who started skipping the organic produce their kid
            used to eat.
          </p>
          <p>
            The Consumer Confidence Index says things are holding. Google search
            volume for "grocery budget" is at post-COVID highs. Reddit threads
            on r/Frugal and r/povertyfinance are spiking. The official metric
            and the behavioral signal are diverging, and the gap is getting
            wider.
          </p>
          <p>
            The grocery store is still running its manipulation playbook from
            1975. The economy around it moved to a different century sometime
            in March.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">Methodology</h2>
        <div className="method-note">
          <p>
            Gas price data from the US Energy Information Administration (EIA)
            and AAA weekly surveys. Food price forecasts from the USDA Economic
            Research Service Food Price Outlook (updated May 2026). Federal
            workforce data from the Office of Personnel Management (OPM).
            DOGE impact figures from Reuters, AgWeb, and KCUR reporting on
            USDA staff departures. SNAP and school nutrition cuts from
            Congressional budget documents and Harvard GSAS analysis.
          </p>
          <p>
            This is not a peer-reviewed publication. It is a data zine. The
            numbers are sourced. The framing is mine.
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
