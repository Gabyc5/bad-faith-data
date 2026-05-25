import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Cover from './pages/Cover'
import Issue01 from './pages/Issue01'
import Issue02 from './pages/Issue02'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/issue/01" element={<Issue01 />} />
        <Route path="/issue/02" element={<Issue02 />} />
      </Routes>
    </>
  )
}

export default App
