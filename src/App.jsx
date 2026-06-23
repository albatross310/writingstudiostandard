import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Standard from './pages/Standard'
import Documents from './pages/Documents'
import Architecture from './pages/Architecture'
import Examples from './pages/Examples'
import FAQ from './pages/FAQ'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/standard"    element={<Standard />} />
        <Route path="/documents"   element={<Documents />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/examples"    element={<Examples />} />
        <Route path="/faq"         element={<FAQ />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
