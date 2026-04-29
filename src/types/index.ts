import type { User as FirebaseUser } from 'firebase/auth';

// ─── Auth & User ──────────────────────────────────────────────

export type AuthView = 'landing' | 'auth' | 'app';
export type AuthMode = 'login' | 'register' | 'forgot';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export function toAppUser(firebaseUser: FirebaseUser): AppUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    emailVerified: firebaseUser.emailVerified,
  };
}

// ─── Business Analysis (Gemini Response) ──────────────────────

export interface BusinessAnalysis {
  empresa: {
    nombre: string;
    sector: string;
    localizacion: string;
    resumen: string;
    identidad_visual?: string;
    cliente_ideal?: string;
  };
  contacto?: {
    email?: string;
    telefono?: string;
    rrss?: string[];
  };
  tecnologia?: {
    cms?: string;
    tracking?: string[];
    marketing_automation?: string;
    velocidad?: string;
    seguridad_ssl?: boolean;
    cumplimiento_gdpr?: string;
  };
  senales_crecimiento?: {
    contratacion_activa?: boolean;
    expansion_geografica?: string;
    actualizacion_reciente?: string;
  };
  marketing_intensity?: {
    seo_score?: number;
    ads_presence?: string;
    content_velocity?: string;
  };
  hipotesis_crecimiento?: {
    problema_raiz?: string;
    solucion_propuesta?: string;
    roi_estimado?: string;
  };
  analisis_oportunidades?: Array<{
    area?: string;
    hallazgo?: string;
    oportunidad?: string;
    prioridad?: string;
    impacto_negocio?: string;
  }>;
  scores?: {
    salud_digital?: number;
    probabilidad_conversion?: number;
    nivel_inversion_estimado?: string;
  };
  outreach_automatizado?: {
    email_asunto?: string;
    email_cuerpo?: string;
    linkedin_invite?: string;
  };
  hot_lead_score?: number;
}

export interface AnalysisHistoryItem extends BusinessAnalysis {
  id: string;
  website?: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

// ─── ROI Calculator ───────────────────────────────────────────

export interface ROIParams {
  investment: number;
  channel: string;
  sector: string;
  location: string;
  avgTicket: number;
  digitalLevel: 'bajo' | 'medio' | 'alto';
}

export interface ROIScenario {
  roi: number;
  revenue: number;
  conversiones: number;
  cpa: number;
}

export interface ROIPrediction {
  escenarios: {
    conservador: ROIScenario;
    base: ROIScenario;
    optimista: ROIScenario;
  };
  analisis_detallado: string;
  recomendaciones: string[];
  score_confianza: number;
  break_even_days: number;
}

// ─── Creative Studio ──────────────────────────────────────────

export type CreativeAssetType = 'slogan' | 'social_post' | 'newsletter' | 'concept_logo';

export interface BusinessInfo {
  name: string;
  valueProposition: string;
  sector: string;
}

// ─── Layout & Navigation ─────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

// ─── Dashboard ────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  icon: React.ComponentType<{ size?: number }>;
  confidence: number;
  origin: string;
  formula: string;
}

export interface ChartDataPoint {
  name: string;
  leads: number;
  predicted: number;
}

export interface FunnelDataPoint {
  value: number;
  name: string;
  fill: string;
}

export interface ChannelDataPoint {
  name: string;
  value: number;
}

// ─── API Responses ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  version: string;
  timestamp: string;
}

// ─── Sector Benchmarks ───────────────────────────────────────

export interface SectorBenchmark {
  ctr: number;
  cr: number;
  cpc: number;
}

export const SECTOR_BENCHMARKS: Record<string, SectorBenchmark> = {
  'SaaS': { ctr: 2.1, cr: 3.5, cpc: 1.5 },
  'E-commerce': { ctr: 1.8, cr: 2.2, cpc: 0.8 },
  'Inmobiliaria': { ctr: 2.5, cr: 1.2, cpc: 2.5 },
  'Salud': { ctr: 3.2, cr: 4.1, cpc: 1.2 },
  'Educación': { ctr: 2.8, cr: 3.0, cpc: 0.9 },
  'General': { ctr: 2.0, cr: 2.0, cpc: 1.0 },
};
