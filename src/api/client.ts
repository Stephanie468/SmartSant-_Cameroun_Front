// ─── Client HTTP générique Smart-Santé ───────────────────────
// Toutes les fonctions API passent par ce fichier
// Usage : client.get('/auth/me') | client.post('/auth/inscription/patient', data)

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ── Récupère le token JWT stocké ─────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('smartsante.token')
}

// ── Construit les headers automatiquement ────────────────────
function buildHeaders(withAuth = false): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (withAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// ── Type générique de réponse API ─────────────────────────────
export interface ApiResponse<T> {
  data: T | null
  erreur: string | null
  statut: number
}

// ── Fonction centrale qui exécute tous les appels ─────────────
async function request<T>(
  methode: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  corps?: unknown,
  avecAuth = false
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: methode,
      headers: buildHeaders(avecAuth),
      body: corps ? JSON.stringify(corps) : undefined,
    })

    // Réponse vide (ex: DELETE 204)
    if (response.status === 204) {
      return { data: null, erreur: null, statut: 204 }
    }

    const json = await response.json()

    if (!response.ok) {
      return {
        data: null,
        erreur: json.message || `Erreur ${response.status}`,
        statut: response.status,
      }
    }

    return { data: json as T, erreur: null, statut: response.status }

  } catch (e) {
    // Erreur réseau (serveur éteint, pas de connexion...)
    return {
      data: null,
      erreur: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
      statut: 0,
    }
  }
}

// ── Méthodes exposées ─────────────────────────────────────────
export const client = {
  // Sans authentification
  get:    <T>(endpoint: string) =>
    request<T>('GET', endpoint),

  post:   <T>(endpoint: string, corps: unknown) =>
    request<T>('POST', endpoint, corps),

  // Avec authentification (token JWT requis)
  authGet:    <T>(endpoint: string) =>
    request<T>('GET', endpoint, undefined, true),

  authPost:   <T>(endpoint: string, corps: unknown) =>
    request<T>('POST', endpoint, corps, true),

  authPut:    <T>(endpoint: string, corps: unknown) =>
    request<T>('PUT', endpoint, corps, true),

  authPatch:  <T>(endpoint: string, corps: unknown) =>
    request<T>('PATCH', endpoint, corps, true),

  authDelete: <T>(endpoint: string) =>
    request<T>('DELETE', endpoint, undefined, true),
}