import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Localizacion.css'

gsap.registerPlugin(ScrollTrigger)

const horarios = [
  { dia: 'Lunes', horas: 'Cerrado' },
  { dia: 'Martes', horas: '12:00 - 16:00 / 19:30 - 23:00' },
  { dia: 'Miercoles', horas: '12:00 - 16:00 / 19:30 - 23:00' },
  { dia: 'Jueves', horas: '12:00 - 16:00 / 19:30 - 23:00' },
  { dia: 'Viernes', horas: '12:00 - 16:00 / 19:30 - 00:00' },
  { dia: 'Sabado', horas: '12:00 - 00:00' },
  { dia: 'Domingo', horas: '12:00 - 17:00' },
]

export default function Localizacion() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.loc-hero-content > *', {
        y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2,
      })
      gsap.from('.loc-info-card', {
        y: 50, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.loc-info-grid', start: 'top 80%' },
      })
      gsap.from('.horario-row', {
        x: -30, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.horarios-list', start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="page">
      <section className="loc-hero">
        <div className="loc-hero-content">
          <span className="section-tag">Encuentranos</span>
          <h1 className="section-title"><span className="gradient-text">Ven a visitarnos</span></h1>
          <p className="section-subtitle">
            Te esperamos para que vivas la experiencia Xpace en persona
          </p>
        </div>
      </section>

      <section className="loc-info">
        <div className="loc-info-grid">
          <div className="loc-info-card">
            <div className="loc-info-icon">📍</div>
            <h3 className="loc-info-title">Direccion</h3>
            <p className="loc-info-text">
              Calle Espacial 42<br />
              28001 Madrid, Spain
            </p>
            <a
              href="https://maps.google.com/?q=Madrid+Spain"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline"
            >
              Ver en Maps
            </a>
          </div>
          <div className="loc-info-card">
            <div className="loc-info-icon">📞</div>
            <h3 className="loc-info-title">Telefono</h3>
            <p className="loc-info-text">
              +34 600 000 000<br />
              Reservas y pedidos
            </p>
            <a href="tel:+34600000000" className="btn btn-sm btn-outline">Llamar</a>
          </div>
          <div className="loc-info-card">
            <div className="loc-info-icon">📸</div>
            <h3 className="loc-info-title">Redes Sociales</h3>
            <p className="loc-info-text">
              @xpace_burger<br />
              Siguenos para novedades
            </p>
            <a
              href="https://instagram.com/xpace_burger"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="loc-map-section">
        <div className="loc-map-container">
          <div className="loc-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97169.10842120917!2d-3.7037902!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1357df29!2sMadrid%2C%20Spain!5e0!3m2!1ses!2ses!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '20px', filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
              allowFullScreen=""
              loading="lazy"
              title="Mapa Xpace Burger"
            />
          </div>
        </div>
      </section>

      <section className="loc-horarios">
        <div className="horarios-container">
          <div className="section-header">
            <span className="section-tag">Horario</span>
            <h2 className="section-title"><span className="gradient-text">Cuando puedes venir</span></h2>
          </div>
          <div className="horarios-list">
            {horarios.map((h, i) => (
              <div className={`horario-row ${h.horas === 'Cerrado' ? 'closed' : ''}`} key={i}>
                <span className="horario-dia">{h.dia}</span>
                <span className="horario-line" />
                <span className="horario-horas">{h.horas}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-content">
          <h2 className="cta-title">&#127756; Te esperamos!</h2>
          <p className="cta-sub">Reserva tu mesa y vive la experiencia Xpace</p>
          <div className="cta-buttons">
            <a href="tel:+34600000000" className="btn btn-primary">Reservar Mesa</a>
            <Link to="/carta" className="btn btn-outline">Ver Carta</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
