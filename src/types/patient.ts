import { client } from '../api/client'
import type { ApiResponse } from '../api/client'

export interface PatientProfil {
  id: string
  nom: string
  prenom: string
  telephone: string
  ville?: string | null
  region?: string | null
  groupeSanguin?: string | null
  antecedents?: string | null
  allergies?: string | null
  langue?: string
}

export interface Pathologie {
  id: string
  nom: string
  code: string
  categorie: string
  description?: string | null
}

export interface ConsultationPathologie {
  consultationId: string
  pathologieId: string
  probabilite?: number | null
  pathologie: Pathologie
}

export interface ConsultationIA {
  id: string
  patientId: string
  conversationId?: string | null
  symptomes: string
  preDiagnostic: string
  niveauUrgence: 'VERT' | 'ORANGE' | 'ROUGE'
  scoreConfiance?: number | null
  recommandations?: string | null
  ficheUrl?: string | null
  suiviDateRelance?: string | null
  suiviReponse?: string | null
  suiviEffectue: boolean
  dateConsultation: string
  pathologies: ConsultationPathologie[]
}

export interface Creneau {
  id: string
  medecinId: string
  jourSemaine: string
  heureDebut: string
  heureFin: string
  disponible: boolean
}

export interface FormationSanitaire {
  id: string
  nom: string
  type: string
  adresse: string
  region: string
  ville: string
  latitude: number
  longitude: number
  telephone?: string | null
  horaires?: string | null
}

// ⚠️ MedecinInfo mis à jour — creneaux ajoutés (retournés par getMedecinsDisponibles)
export interface MedecinInfo {
  id: string
  utilisateur: {
    id: string
    nom: string
    prenom: string
    telephone: string
    email?: string | null
  }
  specialite: string
  tarifConsultation: number
  statutCertification: string
  bio?: string | null
  formationSanitaire?: FormationSanitaire | null
  creneaux: Creneau[]   // ← ajouté
}

export interface RendezVous {
  id: string
  patientId: string
  medecinId: string
  creneauId?: string | null
  dateHeure: string
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'TERMINE'
  motif?: string | null
  medecin: MedecinInfo
  creneau?: Creneau | null
}

export interface Ordonnance {
  id: string
  patientId: string
  medecinId: string
  rendezVousId?: string | null
  contenu: string
  dateEmission: string
  envoyeeWhatsApp: boolean
  cheminFichier?: string | null
  medecin: {
    utilisateur: {
      nom: string
      prenom: string
    }
    formationSanitaire?: FormationSanitaire | null
  }
}

export interface PatientDashboardData {
  patient: PatientProfil
  constantes: {
    temperature: string
    rythmeCardiaque: string
    tension: string
    glycemie: string
  }
  consultationsIA: ConsultationIA[]
  prochainRdv: RendezVous | null
  ordonnances: Ordonnance[]
  structuresProches: FormationSanitaire[]
}

export interface BookingData {
  medecinId: string
  creneauId?: string | null
  dateHeure: string
  motif?: string
}

// ─────────────────────────────────────────────────────────────
// API PATIENT
// ─────────────────────────────────────────────────────────────
export const patientApi = {
  getDashboard: (): Promise<ApiResponse<PatientDashboardData>> =>
    client.authGet('/patients/dashboard'),

  getConsultations: (): Promise<ApiResponse<ConsultationIA[]>> =>
    client.authGet('/patients/consultations'),

  getOrdonnances: (): Promise<ApiResponse<Ordonnance[]>> =>
    client.authGet('/patients/ordonnances'),

  getRendezVous: (): Promise<ApiResponse<RendezVous[]>> =>
    client.authGet('/patients/rendez-vous'),

  creerRendezVous: (
    data: BookingData
  ): Promise<ApiResponse<{ message: string; rendezVous: RendezVous }>> =>
    client.authPost('/patients/rendez-vous', data),

  modifierProfil: (
    data: Partial<PatientProfil>
  ): Promise<ApiResponse<{ message: string; patient: PatientProfil }>> =>
    client.authPut('/patients/profil', data),

  getMedecins: (): Promise<ApiResponse<MedecinInfo[]>> =>
    client.authGet('/patients/medecins'),

  getStructures: (): Promise<ApiResponse<FormationSanitaire[]>> =>
    client.authGet('/patients/structures'),
}