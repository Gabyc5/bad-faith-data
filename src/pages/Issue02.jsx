import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import * as d3 from 'd3'
import GeometricDistortion from '../components/GeometricDistortion'
import GlitchText from '../components/GlitchText'
import './Issue02.css'

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

// Disclosure timeline with defense stock context
const timeline = [
  { date: 'Jul 2023', event: 'David Grusch testifies to Congress under oath. Claims US has recovered non-human craft and biologics.', type: 'hearing' },
  { date: 'Jan 2024', event: 'UAP Disclosure Act provisions enacted in FY2024 NDAA. Review board stripped by lobbyists.', type: 'legislation' },
  { date: 'Mar 2024', event: 'AARO Vol. 1: "No verifiable evidence" of secret programs involving recovered non-human craft.', type: 'report' },
  { date: 'Nov 2024', event: 'Pentagon annual report: 1,652 cases. Most resolved as drones, balloons, birds. 21 cases merit further analysis. 444 unresolvable.', type: 'report' },
  { date: 'Dec 2024', event: 'New Jersey drone sighting wave. Hundreds of reports over military bases. Trump admin later says "primarily FAA-authorized drones."', type: 'sighting' },
  { date: 'Sep 2025', event: 'House hearing shows MQ-9 Reaper footage of Hellfire missile fired at orb off Yemen coast. Missile appears ineffective. Object continues flight.', type: 'hearing' },
  { date: 'Feb 2026', event: 'Trump signs executive order directing declassification of UAP records. 300-day countdown begins. PURSUE portal announced.', type: 'legislation' },
  { date: 'May 8, 2026', event: 'First PURSUE file drop. Pixelated imagery of metallic spheres, flying discs, glowing orbs. Reports spanning 1985-2025.', type: 'release' },
  { date: 'May 22, 2026', event: 'Second PURSUE release. Additional files. Pentagon missed April 14 deadline for 46 specific video files requested by Rep. Luna.', type: 'release' },
]

// Defense contractor stock performance (approximate, based on reporting)
const stockData = [
  { company: 'Lockheed Martin', ticker: 'LMT', price2024: 460, price2026: 535, pctChange: 16.3, backlog: '$194B' },
  { company: 'Northrop Grumman', ticker: 'NOC', price2024: 480, price2026: 696, pctChange: 45.0, backlog: '$85B' },
  { company: 'RTX (Raytheon)', ticker: 'RTX', price2024: 118, price2026: 198, pctChange: 67.8, backlog: '$268B' },
]

// Credibility matrix for recent incidents
const credibilityMatrix = [
  {
    name: 'Yemen orb (Oct 2024)',
    documented: true, radar: true, nearMilitary: true, nearContractor: false,
    notes: 'MQ-9 Reaper video. Hellfire missile fired. Object appeared undamaged. Shown in congressional hearing.',
  },
  {
    name: 'NJ drone wave (Dec 2024)',
    documented: true, radar: false, nearMilitary: true, nearContractor: true,
    notes: 'Picatinny Arsenal, Naval Weapons Station Earle. Some debunked as Orion constellation and Venus.',
  },
  {
    name: 'F-16 canopy strike (Jan 2023)',
    documented: true, radar: false, nearMilitary: true, nearContractor: false,
    notes: 'Gila Bend AZ. Object struck aircraft. Ruled out bird strike. Classified as drone. Operator never identified.',
  },
  {
    name: 'Eye of Sauron orb (Sep 2023)',
    documented: true, radar: false, nearMilitary: false, nearContractor: false,
    notes: 'Federal employee report. Ellipsoid bronze metallic object. 130-195 feet. Disappeared instantaneously.',
  },
  {
    name: 'PURSUE Release 01 cases',
    documented: true, radar: true, nearMilitary: true, nearContractor: false,
    notes: 'Multiple cases spanning 1985-2025. Diamond-shaped object at 800 km/h (2024). UAE incident (Oct 2023).',
  },
]

function TimelineVis() {
  return (
    <div className="timeline-container">
      {timeline.map((item, i) => (
        <div key={i} className={`timeline-item timeline-${item.type}`}>
          <div className="timeline-marker">
            <span className="timeline-dot" />
            {i < timeline.length - 1 && <span className="timeline-line" />}
          </div>
          <div className="timeline-content">
            <span className="timeline-date">{item.date}</span>
            <span className="timeline-type">{item.type.toUpperCase()}</span>
            <p className="timeline-text">{item.event}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function StockChart() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (!inView || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 80, bottom: 40, left: 50 }
    const width = 640 - margin.left - margin.right
    const height = 240 - margin.top - margin.bottom
    const g = svg.attr('viewBox', '0 0 640 240')
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand()
      .domain(stockData.map(d => d.ticker))
      .range([0, width]).padding(0.4)

    const y = d3.scaleLinear().domain([0, 80]).range([height, 0])

    // Grid
    g.selectAll('.grid').data(y.ticks(4)).enter().append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', 'rgba(168,158,150,0.3)').attr('stroke-width', 0.5)

    // Bars
    stockData.forEach(d => {
      g.append('rect')
        .attr('x', x(d.ticker)).attr('y', y(d.pctChange))
        .attr('width', x.bandwidth()).attr('height', height - y(d.pctChange))
        .attr('fill', '#4A6741').attr('opacity', 0.85)

      // Value label
      g.append('text')
        .attr('x', x(d.ticker) + x.bandwidth() / 2)
        .attr('y', y(d.pctChange) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-family', "'IBM Plex Mono'").attr('font-size', '13px')
        .attr('font-weight', '700').attr('fill', '#E8E0D0')
        .text('+' + d.pctChange + '%')

      // Backlog label
      g.append('text')
        .attr('x', x(d.ticker) + x.bandwidth() / 2)
        .attr('y', y(d.pctChange) - 24)
        .attr('text-anchor', 'middle')
        .attr('font-family', "'IBM Plex Mono'").attr('font-size', '9px')
        .attr('fill', 'rgba(168,158,150,0.7)')
        .text('backlog: ' + d.backlog)
    })

    // X axis
    g.append('g').attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').attr('stroke', 'rgba(168,158,150,0.4)'))
      .call(g => g.selectAll('.tick text')
        .attr('font-family', "'IBM Plex Mono'").attr('font-size', '12px')
        .attr('fill', '#A89E96').attr('font-weight', '700'))
      .call(g => g.selectAll('.tick line').remove())

  }, [inView])

  return <div ref={containerRef} className="chart-container"><svg ref={svgRef} width="100%" /></div>
}

function Issue02() {
  return (
    <div className="issue issue-02-theme">
      <div className="issue-nav">
        <Link to="/" className="issue-nav-back">&#8592; Cover</Link>
        <span className="issue-nav-label">ISSUE 02</span>
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
          <span className="issue-header-number">02</span>
          <h1 className="issue-headline">
            <GlitchText text="DISCLOSURE SEASON" tag="span" duration={1000} />
          </h1>
          <p className="issue-deck">
            In May 2026, the US government began releasing declassified UAP files
            through a portal called PURSUE. Pixelated photos of metallic spheres.
            Reports from 1985. A Hellfire missile that hit an orb and did nothing.
            Meanwhile, defense contractor stocks are at record highs. Coincidence
            is not a data type, but correlation is.
          </p>
        </motion.div>
      </header>

      <Section>
        <div className="issue-lede">
          <p>
            Here is the conspiracy theory: the government is releasing UFO files
            because aliens are real and they have been hiding it for decades.
            Here is the other conspiracy theory: the government is releasing
            UFO files because the defense budget needs justification, disclosure
            creates demand for detection systems, and Raytheon stock is up 68%
            in two years.
          </p>
          <p>
            One of these theories requires aliens. The other requires a line item
            in a procurement contract. I am not here to tell you which one is
            true. I am here to show you the data and let you decide which
            explanation requires fewer assumptions.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">The timeline</h2>
        <p className="section-intro">
          Every major disclosure event from Grusch's testimony to the PURSUE
          file drops. Watch the pattern: hearing, report, legislation, release.
          Each step increases public awareness. Each step creates demand for
          the next step. Each step benefits the same set of contractors.
        </p>
        <TimelineVis />
      </Section>

      <Section className="section-dark-02">
        <h2 className="section-head">Who profits from the unknown</h2>
        <p className="section-intro">
          Defense contractor stock performance since early 2024. RTX (formerly
          Raytheon) is up 68%. Their combined order backlog is over $547 billion.
          Every UAP hearing that says "we need better detection capabilities"
          is a sentence that ends with a purchase order.
        </p>
        <div className="chart-wrapper chart-wrapper-dark">
          <div className="chart-label">
            <span className="chart-label-title">Stock price change, Jan 2024 to May 2026</span>
            <span className="chart-label-source">source: Yahoo Finance, Morningstar</span>
          </div>
          <StockChart />
        </div>
        <p className="section-body">
          Northrop Grumman builds the B-21 Raider stealth bomber. RTX makes
          the radar and sensor systems that detect UAPs. Lockheed Martin runs
          the F-35 program and has the largest defense backlog in history at
          $194 billion. These are the same companies that would build the
          detection grid if Congress funded one. These are the same companies
          whose former employees testify about recovered craft.
        </p>
      </Section>

      <Section>
        <h2 className="section-head">The credibility matrix</h2>
        <p className="section-intro">
          Rate each major incident on four axes: is the source documented,
          is there corroborating sensor data, was it near a military installation,
          was it near a defense contractor facility. The pattern that emerges
          is not aliens. It is a testing corridor.
        </p>
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Incident</th>
                <th>Documented</th>
                <th>Radar/sensor</th>
                <th>Near military</th>
                <th>Near contractor</th>
              </tr>
            </thead>
            <tbody>
              {credibilityMatrix.map((row, i) => (
                <tr key={i}>
                  <td className="matrix-name">{row.name}</td>
                  <td className="matrix-cell">{row.documented ? <span className="matrix-yes">YES</span> : <span className="matrix-no">NO</span>}</td>
                  <td className="matrix-cell">{row.radar ? <span className="matrix-yes">YES</span> : <span className="matrix-no">NO</span>}</td>
                  <td className="matrix-cell">{row.nearMilitary ? <span className="matrix-yes">YES</span> : <span className="matrix-no">NO</span>}</td>
                  <td className="matrix-cell">{row.nearContractor ? <span className="matrix-yes">YES</span> : <span className="matrix-no">NO</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="matrix-notes">
          {credibilityMatrix.map((row, i) => (
            <div key={i} className="matrix-note-item">
              <span className="matrix-note-name">{row.name}</span>
              <span className="matrix-note-text">{row.notes}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="callout-box callout-box-02">
          <span className="callout-label">THE ALTERNATE HYPOTHESIS</span>
          <p className="callout-text">
            The New Jersey drone wave of December 2024 produced hundreds of
            sightings over Picatinny Arsenal and Naval Weapons Station Earle.
            The Trump administration later said they were "primarily FAA-authorized
            drones." Some were debunked as the constellation Orion. Some were
            Venus. But military officials confirmed a "concurrent pattern of
            unauthorized incursions over sensitive defense installations." In
            January 2023, an unidentified object struck an F-16 canopy during
            training in Arizona. The Air Force ruled out a bird strike and
            classified it as a drone. The operator was never identified. The
            most interesting UFO conspiracy might be that they are not UFOs at all.
          </p>
        </div>
      </Section>

      <Section>
        <div className="pullquote pullquote-02">
          <p>
            Is the most interesting UFO conspiracy actually that they are
            not UFOs at all?
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">What PURSUE actually released</h2>
        <div className="issue-lede">
          <p>
            On May 8, 2026, the Pentagon published the first batch of files
            through the Presidential Unsealing and Reporting System for UAP
            Encounters. The files include pixelated images of metallic spheres,
            diamond-shaped objects moving at 800 km/h, an ellipsoid bronze
            object described as materializing out of bright light and measuring
            130 to 195 feet in length. Reports from federal employees, military
            pilots, and embassy staff spanning 1985 to 2025.
          </p>
          <p>
            The research community's response was measured. "Data alone is not
            disclosure," DefenseScoop reported. The files confirm the government
            has been collecting UAP reports for decades. They do not confirm
            what the objects are. They do not release the 46 specific video files
            that Rep. Luna demanded by April 14. The Pentagon missed that
            deadline. Luna said she was prepared to subpoena.
          </p>
          <p>
            Meanwhile, AARO has resolved the majority of its 1,652 cases as
            prosaic objects: balloons, birds, drones, satellites, aircraft.
            Twenty-one cases merit further analysis. Four hundred and forty-four
            lack enough data and sit in an active archive. The unresolved cases
            are the ones that drive the news cycle. The resolved ones, the
            boring ones, are the ones that tell you what is actually in the sky.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">The question this data asks</h2>
        <div className="issue-lede">
          <p>
            Every disclosure event follows the same script. Congress holds a
            hearing. Witnesses describe extraordinary encounters. Media coverage
            spikes. Public interest peaks. Then comes the ask: we need better
            sensors, better detection systems, better tracking infrastructure.
            The companies that build those systems see their stock prices climb
            and their backlogs grow.
          </p>
          <p>
            This is not proof of a conspiracy. It is a correlation. But
            correlation with a procurement pipeline attached to it is worth
            looking at twice. Especially when the same companies that would
            profit from a UAP detection mandate are the ones whose former
            employees are testifying about recovered craft.
          </p>
          <p>
            The data does not tell you whether aliens are real. The data tells
            you who gets paid regardless of the answer.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-head">Methodology</h2>
        <div className="method-note">
          <p>
            Disclosure timeline compiled from AARO public releases, Congress.gov
            hearing records, the PURSUE portal (war.gov/ufo), NDAA legislation
            text, and reporting from DefenseScoop, NBC News, The War Zone, and
            ScienceAlert. Stock prices from Yahoo Finance and Morningstar as of
            May 2026. Backlog figures from company earnings reports (Q4 2025 and
            Q1 2026). Credibility matrix criteria based on AARO case resolution
            categories. New Jersey drone sighting data from FAA, Wikipedia
            sourced from official military confirmations, and Congressional
            testimony transcripts.
          </p>
          <p>
            I am not a ufologist. I am a person who can read a 10-K filing.
          </p>
        </div>
      </Section>

      <div className="issue-footer">
        <div className="issue-footer-inner">
          <span className="issue-footer-label">BAD FAITH DATA / ISSUE 02</span>
          <Link to="/issue/01" className="issue-footer-link">&#8592; Issue 01</Link>
          <Link to="/" className="issue-footer-link">Cover</Link>
          <a href="https://gabyhernandez.dev" target="_blank" rel="noopener" className="issue-footer-link">
            gabyhernandez.dev &#8599;
          </a>
        </div>
      </div>
    </div>
  )
}

export default Issue02
