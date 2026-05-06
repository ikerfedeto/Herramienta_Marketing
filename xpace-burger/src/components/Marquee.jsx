import './Marquee.css'

export default function Marquee() {
  const items1 = ['Smash Burgers', 'Ingredientes Premium', 'Sabores Espaciales', 'Artesanal', 'De Otro Planeta', 'Chorreo Galactico']
  const items2 = ['XPACE BURGER']

  const repeat = (arr, n) => Array(n).fill(arr).flat()

  return (
    <div className="marquee-section">
      <div className="marquee-band marquee-band--filled">
        <div className="marquee-track">
          {repeat(items1, 6).map((item, i) => (
            <span className="marquee-item" key={i}>{item} <span className="sep" /></span>
          ))}
        </div>
      </div>
      <div className="marquee-band marquee-band--outline">
        <div className="marquee-track marquee-track--reverse">
          {repeat(items2, 12).map((item, i) => (
            <span className="marquee-item" key={i}>{item} <span className="sep" /></span>
          ))}
        </div>
      </div>
    </div>
  )
}
