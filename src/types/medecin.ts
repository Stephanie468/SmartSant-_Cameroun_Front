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

export interface RendezVousDemande extends Omit<RendezVous, 'medecin'> {
  patient: RendezVous['patient']
  creneau?: Creneau | null
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

  // Charge les demandes de rendez-vous en attente
  getDemandesRendezVous: (): Promise<ApiResponse<RendezVousDemande[]>> =>
    client.authGet('/medecin/planning/demandes'),

  // Met à jour le statut d'une demande de rendez-vous
  mettreAJourDemandeRendezVous: (
    id: string,
    data: { statut: 'CONFIRME' | 'ANNULE' }
  ): Promise<ApiResponse<{ message: string; rendezVous: RendezVous }>> =>
    client.authPut(`/medecin/planning/demandes/${id}`, data),

  // Ajoute un créneau de disponibilité
  creerCreneau: (data: {
    jourSemaine: string
    heureDebut: string
    heureFin: string
  }): Promise<ApiResponse<{ message: string; creneau: Creneau }>> =>
    client.authPost('/medecin/planning/creneau', data),
}
