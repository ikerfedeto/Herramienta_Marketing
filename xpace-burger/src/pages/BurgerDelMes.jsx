import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BurgerDelMes.css'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: '🥩', title: '100% Black Angus', desc: 'Carne premium seleccionada de las mejores ganaderias' },
  { icon: '🍄', title: 'Trufa Negra Real', desc: 'Laminada sobre cada patty, aroma y sabor inigualables' },
  { icon: '🧀', title: 'Queso Brie Fundido', desc: 'Cremosidad francesa que envuelve cada capa de sabor' },
  { icon: '🧅', title: 'Cebolla Caramelizada', desc: 'Lentamente cocida con un toque de bourbon artesanal' },
  { icon: '🔥', title: 'Smash Technique', desc: 'Aplastado en la plancha para maxima costra y sabor' },
  { icon: '🍞', title: 'Brioche Artesanal', desc: 'Pan de brioche horneado cada dia en nuestro obrador' },
]

const timeline = [
  { month: 'Enero', name: 'Supernova Truffle', desc: 'Trufa negra y brie fundido' },
  { month: 'Febrero', name: 'Red Dwarf BBQ', desc: 'BBQ ahumada y bacon crispy' },
  { month: 'Marzo', name: 'Nebula Sriracha', desc: 'Picante explosion con habanero' },
  { month: 'Abril', name: 'Blue Moon Cheese', desc: 'Cuadruple queso artesanal' },
  { month: 'Mayo', name: 'Eclipse Black', desc: 'Pan de carbon y trufa negra' },
]

export default function BurgerDelMes() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bdm-hero-content > *', {
        y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2,
      })
      gsap.from('.bdm-feature', {
        y: 50, opacity: 0, scale: 0.95, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.bdm-features', start: 'top 80%' },
      })
      gsap.from('.timeline-item', {
        x: -50, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.bdm-timeline', start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="page">
      <section className="bdm-hero">
        <div className="bdm-hero-content">
          <span className="section-tag">Edicion Limitada</span>
          <h1 className="bdm-name">SUPERNOVA<br />TRUFFLE</h1>
          <p className="bdm-month">Burger del Mes — Mayo 2026</p>
          <div className="bdm-emoji-big">🍔</div>
          <p className="bdm-desc">
            Doble smash patty de Black Angus con trufa negra real laminada, 
            queso brie fundido, cebolla caramelizada con bourbon 
            y nuestra exclusiva salsa espacial en pan brioche artesanal.
          </p>
          <div className="bdm-price-big">14,90€</div>
          <Link to="/carta" className="btn btn-primary">Ver Carta Completa</Link>
        </div>
      </section>

      <section className="bdm-features">
        <div className="section-header">
          <span className="section-tag">Ingredientes</span>
          <h2 className="section-title"><span className="gradient-text">Lo que la hace unica</span></h2>
        </div>
        <div className="bdm-features-grid">
          {features.map((f, i) => (
            <div className="bdm-feature" key={i}>
              <div className="bdm-feature-icon">{f.icon}</div>
              <h3 className="bdm-feature-title">{f.title}</h3>
              <p className="bdm-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bdm-timeline">
        <div className="section-header">
          <span className="section-tag">Archivo</span>
          <h2 className="section-title"><span className="gradient-text">Creaciones anteriores</span></h2>
          <p className="section-subtitle">Cada mes, una nueva obra maestra del sabor</p>
        </div>
        <div className="timeline-list">
          {timeline.map((t, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-month">{t.month}</div>
              <div className="timeline-dot" />
              <div className="timeline-info">
                <h4 className="timeline-name">{t.name}</h4>
                <p className="timeline-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
