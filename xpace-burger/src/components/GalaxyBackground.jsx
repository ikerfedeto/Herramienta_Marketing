import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GalaxyBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 3

    const count = 2500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = Math.random() * 5
      const spin = radius * 2
      const branch = ((i % 4) / 4) * Math.PI * 2
      const rx = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 2
      const ry = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 0.8
      const rz = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 2
      positions[i3] = Math.cos(branch + spin) * radius + rx
      positions[i3 + 1] = ry
      positions[i3 + 2] = Math.sin(branch + spin) * radius + rz
      const inside = new THREE.Color('#331122')
      const mid = new THREE.Color('#1a0a2e')
      const outside = new THREE.Color('#0a1628')
      const mixed = new THREE.Color()
      if (radius < 2) mixed.lerpColors(inside, mid, radius / 2)
      else mixed.lerpColors(mid, outside, (radius - 2) / 3)
      colors[i3] = mixed.r
      colors[i3 + 1] = mixed.g
      colors[i3 + 2] = mixed.b
      sizes[i] = Math.random() * 1.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (220.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float a = 1.0 - smoothstep(0.15, 0.5, d);
          gl_FragColor = vec4(vColor, a * 0.35);
        }
      `,
      transparent: true, vertexColors: true,
      depthWrite: false, blending: THREE.AdditiveBlending
    })

    const galaxy = new THREE.Points(geo, mat)
    scene.add(galaxy)

    const glowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.12 })
    )
    scene.add(glowMesh)

    let mx = 0, my = 0
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.4
      my = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    document.addEventListener('mousemove', onMove)

    let running = true
    const animate = () => {
      if (!running) return
      requestAnimationFrame(animate)
      galaxy.rotation.y += 0.0002
      galaxy.rotation.x += 0.00005
      glowMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.15)
      camera.position.x += (mx - camera.position.x) * 0.008
      camera.position.y += (-my - camera.position.y) * 0.008
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      running = false
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
