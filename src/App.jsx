import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Standard from './pages/Standard'
import Architecture from './pages/Architecture'
import Examples from './pages/Examples'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/standard"     element={<Standard />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/examples"     element={<Examples />} />
        <Route path="/faq"          element={<FAQ />} />
        <Route path="/contact"      element={<Contact />} />
        {/* Documents merged into Architecture */}
        <Route path="/documents"    element={<Navigate to="/architecture" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
