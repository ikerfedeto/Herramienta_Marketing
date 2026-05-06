import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Carta.css'

gsap.registerPlugin(ScrollTrigger)

const menuData = {
  burgers: [
    { name: 'NEBULA CLASSIC', desc: 'Doble smash patty, cheddar fundido, pepinillos, cebolla, nuestra salsa espacial.', price: '9,90€', tag: 'Best Seller', emoji: '🍔' },
    { name: 'SOLAR FLARE', desc: 'Triple smash, habanero, jalapeños, pepper jack, salsa sriracha cosmica.', price: '12,50€', tag: 'Picante 🌶️', emoji: '🔥' },
    { name: 'BLACK HOLE BBQ', desc: 'Doble smash, bacon ahumado, onion rings, bbq ahumada, cheddar aged.', price: '11,90€', tag: 'Favorita', emoji: '🥓' },
    { name: 'SUPERNOVA TRUFFLE', desc: 'Doble smash, trufa negra rallada, queso brie fundido, cebolla bourbon.', price: '14,90€', tag: 'Del Mes', emoji: '🍄' },
    { name: 'METEOR BACON', desc: 'Triple smash, triple bacon crujiente, queso gouda, salsa teriyaki especial.', price: '13,90€', tag: 'Premium', emoji: '🥓' },
    { name: 'GRAVITY GREEN', desc: 'Smash patty vegetal Beyond Meat, guacamole, lechuga, tomate, mayo vegana.', price: '11,50€', tag: 'Veggie 🌱', emoji: '🥬' },
    { name: 'COSMIC CHICKEN', desc: 'Pollo crispy marinado 24h, coleslaw, pepinillos, salsa ranch espacial.', price: '10,90€', tag: 'Nuevo', emoji: '🍗' },
    { name: 'ANDROMEDA CHEESE', desc: 'Cuadruple queso: cheddar, gouda, brie y mozzarella fundidos. Puro queso.', price: '12,90€', tag: 'Cheesy', emoji: '🧀' },
  ],
  entrantes: [
    { name: 'ASTEROID FRIES', desc: 'Patatas fritas crujientes con salsa espacial y parmesano rallado.', price: '4,90€', tag: 'Clasico', emoji: '🍟' },
    { name: 'ONION RINGS ORBITALES', desc: 'Aros de cebolla rebozados con salsa chipotle ahumada.', price: '5,90€', tag: 'Popular', emoji: '🧅' },
    { name: 'NACHOS GALACTICOS', desc: 'Nachos con cheddar fundido, guacamole, pico de gallo y jalapeños.', price: '7,50€', tag: 'Para Compartir', emoji: '🌮' },
    { name: 'ALITAS SUPERNOVA', desc: 'Alitas marinadas 24h con salsa buffalo espacial y salsa ranch.', price: '8,90€', tag: 'Nuevo', emoji: '🍗' },
    { name: 'LOADED FRIES', desc: 'Patatas con cheddar fundido, bacon, cebollino y sour cream.', price: '6,90€', tag: 'Favorita', emoji: '🍟' },
    { name: 'NUGGETS ESTELARES', desc: '8 nuggets de pollo crispy con 3 salsas a elegir.', price: '7,50€', tag: 'Kids', emoji: '🍗' },
  ],
  postres: [
    { name: 'MILKSHAKE COSMICO', desc: 'Batido artesanal con helado premium. Sabores: Oreo, Nutella, Fresa.', price: '5,90€', tag: 'Estrella', emoji: '🥤' },
    { name: 'BROWNIE METEORITO', desc: 'Brownie caliente con helado de vainilla y salsa de chocolate.', price: '6,50€', tag: 'Dulce', emoji: '🍫' },
    { name: 'CHEESECAKE LUNAR', desc: 'Tarta de queso cremosa con coulis de frutos rojos.', price: '5,50€', tag: 'Artesanal', emoji: '🍰' },
    { name: 'COOKIE PLANET', desc: 'Cookie gigante recien horneada con helado y toppings.', price: '6,90€', tag: 'Nuevo', emoji: '🍪' },
  ],
  bebidas: [
    { name: 'CERVEZA ARTESANAL', desc: 'IPA, Lager o Stout de cerveceras locales. Rotacion mensual.', price: '3,90€', tag: 'Craft', emoji: '🍺' },
    { name: 'LIMONADA NEBULAR', desc: 'Limonada casera con jengibre, menta y un toque de maracuya.', price: '3,50€', tag: 'Fresca', emoji: '🍋' },
    { name: 'REFRESCOS', desc: 'Coca-Cola, Fanta, Sprite, Nestea, agua mineral.', price: '2,50€', tag: 'Clasico', emoji: '🥤' },
    { name: 'SMOOTHIE ESPACIAL', desc: 'Frutas naturales, hielo y un toque de menta. Mango, Fresa o Tropical.', price: '4,50€', tag: 'Healthy', emoji: '🍓' },
  ],
}

const categories = [
  { key: 'burgers', label: 'Burgers' },
  { key: 'entrantes', label: 'Entrantes' },
  { key: 'postres', label: 'Postres' },
  { key: 'bebidas', label: 'Bebidas' },
]

export default function Carta() {
  const [active, setActive] = useState('burgers')
  const gridRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.carta-hero-content > *', {
        y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    gsap.from(gridRef.current.querySelectorAll('.menu-card'), {
      y: 40, opacity: 0, scale: 0.97,
      stagger: 0.06, duration: 0.5, ease: 'power2.out',
      clearProps: 'all',
    })
  }, [active])

  return (
    <div className="page">
      <section className="carta-hero">
        <div className="carta-hero-content">
          <span className="section-tag">Nuestra Carta</span>
          <h1 className="section-title"><span className="gradient-text">Explora el Menu</span></h1>
          <p className="section-subtitle">Cada creacion es un viaje a traves de sabores de otro planeta</p>
        </div>
      </section>

      <section className="carta-body">
        <div className="carta-tabs">
          {categories.map(c => (
            <button
              key={c.key}
              className={`carta-tab ${active === c.key ? 'active' : ''}`}
              onClick={() => setActive(c.key)}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <div className="carta-grid" ref={gridRef}>
          {menuData[active].map((item, i) => (
            <div className="menu-card" key={`${active}-${i}`}>
              <div className="menu-card-visual">{item.emoji}</div>
              <div className="menu-card-body">
                <div className="menu-card-tag">{item.tag}</div>
                <h3 className="menu-card-name">{item.name}</h3>
                <p className="menu-card-desc">{item.desc}</p>
                <div className="menu-card-price">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
