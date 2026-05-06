import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon">XB</div>
              <span className="nav-logo-text">XPACE <span>BURGER</span></span>
            </Link>
            <p>Hamburguesas artesanales con un toque espacial. Cada bocado es un viaje a otro planeta.</p>
            <div className="footer-social">
              <a href="https://instagram.com/xpace_burger" target="_blank" rel="noreferrer" title="Instagram">&#9737;</a>
              <a href="#" title="TikTok">&#9830;</a>
              <a href="#" title="Google Maps">&#9872;</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Carta</h4>
            <ul>
              <li><Link to="/carta">Burgers</Link></li>
              <li><Link to="/carta">Entrantes</Link></li>
              <li><Link to="/carta">Postres</Link></li>
              <li><Link to="/burger-del-mes">Del Mes</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <ul>
              <li><Link to="/nosotros">Sobre Nosotros</Link></li>
              <li><Link to="/localizacion">Ubicacion</Link></li>
              <li><a href="#">Alergenos</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><Link to="/localizacion">&#128205; Encuentranos</Link></li>
              <li><a href="https://instagram.com/xpace_burger" target="_blank" rel="noreferrer">&#128247; @xpace_burger</a></li>
              <li><a href="tel:+34600000000">&#128222; +34 600 000 000</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Xpace Burger. Todos los derechos reservados.</p>
          <p>Hecho con &#10084;&#65039; desde otro planeta</p>
        </div>
      </div>
    </footer>
  )
}
