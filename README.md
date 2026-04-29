# MarketFlow AI

**Plataforma SaaS de Marketing Intelligence impulsada por IA.**

Analiza dominios, genera contenido creativo, predice ROI y descubre oportunidades de crecimiento — todo en segundos.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Express.js (Node.js) + Vite dev server |
| IA | Google Gemini (gemini-3-flash-preview) |
| Auth & DB | Firebase Auth + Firestore |
| Charts | Recharts |
| Deploy | Vercel (frontend) / Node.js (servidor) |

## Requisitos Previos

- **Node.js** >= 20.x
- **Cuenta de Google AI Studio** con API key de Gemini
- **Proyecto Firebase** configurado (Auth + Firestore)

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/ikerfedeto/Herramienta_Marketing.git
cd Herramienta_Marketing

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu GEMINI_API_KEY
```

## Desarrollo

```bash
npm run dev
```

La app se ejecuta en `http://localhost:3000` con HMR habilitado.

## Build para Producción

```bash
npm run build
npm run preview   # Preview local del build
```

## Scripts Disponibles

| Script | Descripción |
|--------|------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (Vite) |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Type-check con TypeScript |
| `npm run clean` | Limpia directorio dist/ |

## Arquitectura

```
├── server.ts              # Express server + API routes (Gemini proxy)
├── src/
│   ├── App.tsx            # Root component con routing
│   ├── main.tsx           # Entry point + Error Boundary
│   ├── types/index.ts     # Tipos TypeScript centralizados
│   ├── components/
│   │   ├── LandingPage.tsx    # Página de aterrizaje
│   │   ├── Auth.tsx           # Autenticación (email + Google)
│   │   ├── Layout.tsx         # Layout principal con sidebar
│   │   ├── Dashboard.tsx      # Panel de métricas
│   │   ├── Analyzer.tsx       # Deep Scraper con IA
│   │   ├── CreativeStudio.tsx # Generador de contenido
│   │   ├── ROICalculator.tsx  # Predictor de ROI
│   │   └── ErrorBoundary.tsx  # Error boundary global
│   ├── services/
│   │   └── geminiService.ts   # Cliente API (proxy al servidor)
│   └── lib/
│       └── firebase.ts        # Configuración Firebase
├── firestore.rules        # Reglas de seguridad Firestore
└── vercel.json            # Configuración de deploy
```

## Seguridad

- **API Key protegida**: Las llamadas a Gemini se realizan exclusivamente desde el servidor. La API key nunca se expone al cliente.
- **Rate limiting**: 30 peticiones/minuto por IP en los endpoints de IA.
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy.
- **Firestore rules**: Validación estricta de datos con reglas granulares por colección.
- **Input validation**: Validación en servidor antes de procesar cualquier petición.

## Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `GEMINI_API_KEY` | Sí | API key de Google Gemini |
| `PORT` | No | Puerto del servidor (default: 3000) |
| `NODE_ENV` | No | Entorno de ejecución |

## Licencia

Proyecto privado. Todos los derechos reservados.
