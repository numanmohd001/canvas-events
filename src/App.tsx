import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { PipelinePage } from './pages/PipelinePage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
