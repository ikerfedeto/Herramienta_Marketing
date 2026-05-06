import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Marquee from '../components/Marquee'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  { emoji: '🍔', title: 'Smash Burgers', desc: 'Doble smash patty con carne 100% Black Angus', link: '/carta' },
  { emoji: '🔥', title: 'Burger del Mes', desc: 'Cada mes una creacion exclusiva de edicion limitada', link: '/burger-del-mes' },
  { emoji: '📍', title: 'Encuentranos', desc: 'Ven a visitarnos y vive la experiencia Xpace', link: '/localizacion' },
  { emoji: '🚀', title: 'Nuestra Historia', desc: 'Descubre como nacio esta aventura espacial', link: '/nosotros' },
]

const stats = [
  { number: '5.000+', label: 'Burgers Vendidas' },
  { number: '12', label: 'Creaciones Unicas' },
  { number: '98%', label: 'Clientes Felices' },
  { number: '∞', label: 'Pasion por el Sabor' },
]

export default function Home() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const highlightsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ delay: 0.3 })
      tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8 })
        .from('.hero-title .line', { opacity: 0, y: 80, rotateX: -40, stagger: 0.15, duration: 1, ease: 'power3.out' }, 0.2)
        .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, 0.8)
        .from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8 }, 1)
        .from('.scroll-indicator', { opacity: 0, duration: 0.8 }, 1.2)

      // Parallax hero
      gsap.to('.hero-content', {
        y: 200, opacity: 0,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
      })

      // Highlights cards
      gsap.from('.highlight-card', {
        y: 80, opacity: 0, scale: 0.95, stagger: 0.12, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.highlights-grid', start: 'top 80%' }
      })

      // Stats
      gsap.from('.stat-item', {
        y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.stats-section', start: 'top 80%' }
      })

      // CTA
      gsap.from('.cta-content > *', {
        y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-badge">&#9733; Smash Burgers Artesanales</div>
          <h1 className="hero-title">
            <span className="line line-1">SABORES DE</span>
            <span className="line line-2">OTRO PLANETA</span>
          </h1>
          <p className="hero-subtitle">Hamburguesas artesanales que desafian la gravedad del sabor</p>
          <div className="hero-buttons">
            <Link to="/carta" className="btn btn-primary">Ver Carta</Link>
            <Link to="/nosotros" className="btn btn-outline">Nuestra Historia</Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* HIGHLIGHTS */}
      <section className="highlights-section">
        <div className="section-header">
          <span className="section-tag">Descubre</span>
          <h2 className="section-title"><span className="gradient-text">Explora Xpace</span></h2>
          <p className="section-subtitle">Todo lo que necesitas saber sobre la mejor hamburgueseria del universo</p>
        </div>
        <div className="highlights-grid" ref={highlightsRef}>
          {highlights.map((h, i) => (
            <Link to={h.link} className="highlight-card" key={i}>
              <div className="highlight-emoji">{h.emoji}</div>
              <h3 className="highlight-title">{h.title}</h3>
              <p className="highlight-desc">{h.desc}</p>
              <span className="highlight-arrow">&#8594;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-content">
          <h2 className="cta-title">&#127756; Preparado para despegar?</h2>
          <p className="cta-sub">Tu proxima burger favorita te espera en Xpace</p>
          <div className="cta-buttons">
            <Link to="/carta" className="btn btn-primary">Ver Carta</Link>
            <Link to="/localizacion" className="btn btn-outline">Como Llegar</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
