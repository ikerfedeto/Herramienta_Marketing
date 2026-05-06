import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Nosotros.css'

gsap.registerPlugin(ScrollTrigger)

const valores = [
  { icon: '🥩', title: 'Ingredientes Premium', desc: 'Solo los mejores cortes de Black Angus y productos de primera calidad' },
  { icon: '🔥', title: 'Tecnica Smash', desc: 'Dominamos la tecnica smash: maxima costra, maximo sabor en cada bocado' },
  { icon: '🌍', title: 'Producto Local', desc: 'Colaboramos con productores locales para ofrecer lo mas fresco' },
  { icon: '💫', title: 'Innovacion', desc: 'Cada mes una nueva creacion que desafia los limites del sabor' },
  { icon: '🤝', title: 'Comunidad', desc: 'Mas que un restaurante, somos una familia de amantes de las burgers' },
  { icon: '♻️', title: 'Sostenibilidad', desc: 'Comprometidos con el medio ambiente, packaging eco-friendly' },
]

const team = [
  { name: 'Alex', role: 'Fundador & Chef', emoji: '👨‍🍳' },
  { name: 'Luna', role: 'Co-fundadora & Operaciones', emoji: '👩‍💼' },
  { name: 'Marco', role: 'Head Chef', emoji: '👨‍🍳' },
  { name: 'Sara', role: 'Marketing & RRSS', emoji: '📱' },
]

export default function Nosotros() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nosotros-hero-content > *', {
        y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2,
      })
      gsap.from('.story-block', {
        y: 60, opacity: 0, stagger: 0.2, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.nosotros-story', start: 'top 80%' },
      })
      gsap.from('.valor-card', {
        y: 50, opacity: 0, scale: 0.95, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.valores-grid', start: 'top 80%' },
      })
      gsap.from('.team-member', {
        y: 40, opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.team-grid', start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="page">
      <section className="nosotros-hero">
        <div className="nosotros-hero-content">
          <span className="section-tag">Nuestra Historia</span>
          <h1 className="section-title"><span className="gradient-text">De un sueno a<br />otro planeta</span></h1>
          <p className="section-subtitle">
            Nacimos con una mision clara: crear las mejores smash burgers que hayas probado jamas
          </p>
        </div>
      </section>

      <section className="nosotros-story">
        <div className="story-container">
          <div className="story-block">
            <div className="story-year">2023</div>
            <h3 className="story-title">El Despegue</h3>
            <p className="story-text">
              Todo comenzo con una pasion compartida: dos amigos obsesionados con la hamburguesa perfecta.
              Despues de cientos de pruebas, recetas y fracasos, encontramos la formula que nos definiria.
              La tecnica smash, ingredientes premium y un toque de locura espacial.
            </p>
          </div>
          <div className="story-block">
            <div className="story-year">2024</div>
            <h3 className="story-title">La Expansion</h3>
            <p className="story-text">
              Lo que empezo como un food truck se convirtio en nuestro primer local.
              La respuesta de la gente fue increible: colas en la puerta, reseñas de 5 estrellas
              y una comunidad creciendo cada dia. Xpace habia aterrizado.
            </p>
          </div>
          <div className="story-block">
            <div className="story-year">2025</div>
            <h3 className="story-title">Orbita Actual</h3>
            <p className="story-text">
              Hoy somos mas que un restaurante. Somos una experiencia. Con mas de 5.000 burgers vendidas,
              colaboraciones con marcas locales y una carta que se reinventa cada mes.
              Y esto es solo el principio del viaje.
            </p>
          </div>
        </div>
      </section>

      <section className="nosotros-valores">
        <div className="section-header">
          <span className="section-tag">Valores</span>
          <h2 className="section-title"><span className="gradient-text">Lo que nos define</span></h2>
        </div>
        <div className="valores-grid">
          {valores.map((v, i) => (
            <div className="valor-card" key={i}>
              <div className="valor-icon">{v.icon}</div>
              <h3 className="valor-title">{v.title}</h3>
              <p className="valor-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="nosotros-team">
        <div className="section-header">
          <span className="section-tag">Equipo</span>
          <h2 className="section-title"><span className="gradient-text">La Tripulacion</span></h2>
          <p className="section-subtitle">Los astronautas detras de cada burger</p>
        </div>
        <div className="team-grid">
          {team.map((t, i) => (
            <div className="team-member" key={i}>
              <div className="team-avatar">{t.emoji}</div>
              <h4 className="team-name">{t.name}</h4>
              <p className="team-role">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
