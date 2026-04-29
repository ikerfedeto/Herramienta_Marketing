import type {
  BusinessAnalysis,
  BusinessInfo,
  ROIParams,
  ROIPrediction,
  ApiResponse,
} from "../types";
import { auth } from "../lib/firebase";

const API_BASE = "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function apiRequest<T>(
  endpoint: string,
  body: object
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json().catch(() => ({
      success: false,
      error: `Error del servidor (${response.status})`,
    }));
    throw new Error(errorData.error || `Error ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Error desconocido del servidor.");
  }

  return result.data as T;
}

export async function analyzeBusiness(
  url: string,
  description: string,
  searchResults?: string
): Promise<BusinessAnalysis> {
  return apiRequest<BusinessAnalysis>("/analyze-business", {
    url,
    description,
    searchResults,
  });
}

export async function generateMarketingAsset(
  businessInfo: BusinessInfo,
  type: string
): Promise<string> {
  return apiRequest<string>("/generate-content", { businessInfo, type });
}

export async function generateCreativeImage(
  businessInfo: BusinessInfo,
  type: string
): Promise<string | null> {
  return apiRequest<string | null>("/generate-image", { businessInfo, type });
}

export async function predictROI(params: ROIParams): Promise<ROIPrediction> {
  return apiRequest<ROIPrediction>("/predict-roi", params);
}
