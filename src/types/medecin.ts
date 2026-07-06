import { client } from '../api/client'
import type { ApiResponse } from '../api/client'
import type { ConsultationIA, RendezVous, Creneau } from './patient'

// ─── TYPES POUR LE MÉDECIN ────────────────────────────────────

export interface MedecinDashboardKPIs {
  fichesEnAttente: number
  teleconsultations: number
  patientsCeMois: number
  tempsMoyen: string
}

export interface MedecinDashboardData {
  medecin: {
    nom: string
    prenom: string
    specialite: string
    structure: string
  }
  kpis: MedecinDashboardKPIs
  fileAttente: ConsultationIA[]
  planningJour: RendezVous[]
}

export interface PlanningData {
  creneaux: Creneau[]
  rendezVous: RendezVous[]
}

export interface PrescriptionPayload {
  consultationId: string
  patientId: string
  contenu: string
  rendezVousId?: string
}

// ─── API MÉDECIN ──────────────────────────────────────────────
export const medecinApi = {
  // Récupère les données du tableau de bord médecin
  getDashboard: (): Promise<ApiResponse<MedecinDashboardData>> =>
    client.authGet('/medecin/dashboard'),

  // Récupère l'ensemble des fiches patients (consultations IA)
  getPatients: (): Promise<ApiResponse<ConsultationIA[]>> =>
    client.authGet('/medecin/patients'),

  // Valide une fiche et soumet une prescription
  creerPrescription: (data: PrescriptionPayload): Promise<ApiResponse<{ message: string; ordonnance: any }>> =>
    client.authPost('/medecin/prescription', data),

  // Charge le planning (créneaux et rendez-vous hebdomadaires)
  getPlanning: (): Promise<ApiResponse<PlanningData>> =>
    client.authGet('/medecin/planning'),

  // Ajoute un créneau de disponibilité
  creerCreneau: (data: {
    jourSemaine: string
    heureDebut: string
    heureFin: string
  }): Promise<ApiResponse<{ message: string; creneau: Creneau }>> =>
    client.authPost('/medecin/planning/creneau', data),
}
