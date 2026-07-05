import { client } from '../api/client'
import type { ApiResponse } from '../api/client'
import type { FormationSanitaire, Pathologie, MedecinInfo } from './patient'

export interface AlerteEpidemiologique {
  id: string
  zone: string
  pathologieId: string
  seuil: number
  variationPct: number
  dateDetection: string
  statut: 'ACTIVE' | 'RESOLUE' | 'ARCHIVEE'
  pathologie: Pathologie
}

export interface AdminStats {
  kpis: {
    patientsCount: number
    medecinsCount: number
    consultationsCount: number
    alertesCount: number
  }
  regionsCases: { name: string; cases: number; delta: number; color: string }[]
  pathologiesBreakdown: { n: string; v: number }[]
  alertesSanitaires: AlerteEpidemiologique[]
}

export const adminApi = {
  // Statistiques globale et épidémiologique
  getStats: (): Promise<ApiResponse<AdminStats>> =>
    client.authGet('/admin/statistiques'),

  // Modération Médecins
  getMedecins: (): Promise<ApiResponse<MedecinInfo[]>> =>
    client.authGet('/admin/medecins'),

  updateMedecinStatut: (id: string, statut: 'VALIDE' | 'SUSPENDU' | 'REJETE'): Promise<ApiResponse<{ message: string }>> =>
    client.authPut(`/admin/medecins/${id}/statut`, { statut }),

  // CRUD Structures Sanitaires
  getStructures: (): Promise<ApiResponse<FormationSanitaire[]>> =>
    client.authGet('/admin/structures'),

  creerStructure: (data: Omit<FormationSanitaire, 'id'>): Promise<ApiResponse<FormationSanitaire>> =>
    client.authPost('/admin/structures', data),

  modifierStructure: (id: string, data: Partial<FormationSanitaire>): Promise<ApiResponse<FormationSanitaire>> =>
    client.authPut(`/admin/structures/${id}`, data),

  deleteStructure: (id: string): Promise<ApiResponse<void>> =>
    client.authDelete(`/admin/structures/${id}`),

  // CRUD Pathologies
  getPathologies: (): Promise<ApiResponse<Pathologie[]>> =>
    client.authGet('/admin/pathologies'),

  creerPathologie: (data: Omit<Pathologie, 'id'>): Promise<ApiResponse<Pathologie>> =>
    client.authPost('/admin/pathologies', data),

  modifierPathologie: (id: string, data: Partial<Pathologie>): Promise<ApiResponse<Pathologie>> =>
    client.authPut(`/admin/pathologies/${id}`, data),

  deletePathologie: (id: string): Promise<ApiResponse<void>> =>
    client.authDelete(`/admin/pathologies/${id}`),

  // CRUD Alertes
  getAlertes: (): Promise<ApiResponse<AlerteEpidemiologique[]>> =>
    client.authGet('/admin/alertes'),

  creerAlerte: (data: { zone: string; pathologieId: string; seuil: number; variationPct: number }): Promise<ApiResponse<AlerteEpidemiologique>> =>
    client.authPost('/admin/alertes', data),

  updateAlerteStatut: (id: string, statut: 'ACTIVE' | 'RESOLUE' | 'ARCHIVEE'): Promise<ApiResponse<AlerteEpidemiologique>> =>
    client.authPut(`/admin/alertes/${id}/statut`, { statut }),
}
