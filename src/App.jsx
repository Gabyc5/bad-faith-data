import { Routes, Route } from 'react-router-dom'
import Cover from './pages/Cover'
import Issue01 from './pages/Issue01'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Cover />} />
      <Route path="/issue/01" element={<Issue01 />} />
    </Routes>
  )
}

export default App
