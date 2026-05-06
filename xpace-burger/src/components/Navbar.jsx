import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const links = [
  { path: '/', label: 'Inicio' },
  { path: '/carta', label: 'Carta' },
  { path: '/burger-del-mes', label: 'Del Mes' },
  { path: '/nosotros', label: 'Nosotros' },
  { path: '/localizacion', label: 'Ubicacion' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon">XB</div>
        <span className="nav-logo-text">XPACE <span>BURGER</span></span>
      </Link>

      <ul className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(l => (
          <li key={l.path}>
            <Link
              to={l.path}
              className={location.pathname === l.path ? 'active' : ''}
            >
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/carta" className="nav-cta">Pedir Ahora</Link>
        </li>
      </ul>

      <button
        className={`menu-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
