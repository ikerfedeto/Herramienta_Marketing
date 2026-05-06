import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GalaxyBackground from './components/GalaxyBackground'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Carta from './pages/Carta'
import BurgerDelMes from './pages/BurgerDelMes'
import Nosotros from './pages/Nosotros'
import Localizacion from './pages/Localizacion'

export default function App() {
  const location = useLocation()
  const progressRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return
      const h = document.documentElement.scrollHeight - window.innerHeight
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0
      progressRef.current.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="scroll-progress" ref={progressRef} />
      <div className="noise-overlay" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      <GalaxyBackground />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/burger-del-mes" element={<BurgerDelMes />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/localizacion" element={<Localizacion />} />
      </Routes>
      <Footer />
    </>
  )
}
