import { client } from '../api/client'
import type { ApiResponse } from '../api/client'

// ─────────────────────────────────────────────────────────────
// ÉNUMÉRATIONS
// ─────────────────────────────────────────────────────────────

export type Role = 'PATIENT' | 'MEDECIN' | 'ADMIN'
export type StatutCompte = 'ACTIF' | 'INACTIF' | 'SUSPENDU'
export type StatutCertification = 'EN_ATTENTE' | 'VALIDE' | 'SUSPENDU' | 'REJETE'
export type Langue = 'FR' | 'EN'

// ─────────────────────────────────────────────────────────────
// ENTITÉS
// ─────────────────────────────────────────────────────────────

export interface Utilisateur {
  id: string
  nom: string
  prenom: string
  telephone?: string
  email?: string
  role: Role
  statut: StatutCompte
}

// ─────────────────────────────────────────────────────────────
// FORMULAIRES INSCRIPTION
// ─────────────────────────────────────────────────────────────

export interface FormulairePatient {
  nom: string
  prenom: string
  telephone: string
  dateNaissance: string
  ville: string
  consentement: boolean
}

export interface FormulaireMedecin {
  nom: string
  prenom: string
  telephone: string
  email: string
  motDePasse: string
  specialite: string
  hopital: string
  consentement: boolean
  numeroOrdre: string
  carteProfessionnelleUrl: string
}

// ─────────────────────────────────────────────────────────────
// FORMULAIRES CONNEXION
// ─────────────────────────────────────────────────────────────

export interface FormulaireConnexionPatient {
  telephone: string
  motDePasse: string
}

export interface FormulaireConnexionMedecin {
  email: string
  motDePasse: string
}

export interface FormulaireOTP {
  telephone: string
  code: string
}

// ─────────────────────────────────────────────────────────────
// RÉPONSES API
// ─────────────────────────────────────────────────────────────

export interface ReponseInscription {
  message: string
  utilisateurId: string
}

// Réponse succès connexion médecin/admin
export interface ReponseConnexion {
  message: 'Connexion réussie.'
  token: string
  utilisateur: Utilisateur
}

// Réponse vérification OTP réussie
export interface ReponseOTP {
  message: 'Compte vérifié avec succès.'
  token: string
  utilisateur: Utilisateur
}

export interface ReponseMessage {
  message: string
}

// Réponse OTP envoyé au patient
export interface ReponseOTPEnvoye {
  message: 'OTP_SENT'
  telephone: string
  nom: string
}

// Réponse médecin en attente de validation
export interface ReponseCompteEnAttente {
  message: 'COMPTE_EN_ATTENTE'
  details: string
}

// Réponse compte suspendu
export interface ReponseCompteSuspendu {
  message: 'COMPTE_SUSPENDU'
  details: string
}

// Union de toutes les réponses possibles de /auth/connexion
export type ReponseConnexionBrute =
  | ReponseOTPEnvoye
  | ReponseCompteEnAttente
  | ReponseCompteSuspendu
  | ReponseConnexion

// ─────────────────────────────────────────────────────────────
// TYPES APIRESPONSE PRÊTS À L'EMPLOI
// ─────────────────────────────────────────────────────────────

export type ApiInscription     = ApiResponse<ReponseInscription>
export type ApiConnexionBrute  = ApiResponse<ReponseConnexionBrute>
export type ApiOTP             = ApiResponse<ReponseOTP>
export type ApiMessage         = ApiResponse<ReponseMessage>
export type ApiUtilisateur     = ApiResponse<Utilisateur>

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

const ROUTES = {
  inscriptionPatient: '/auth/inscription/patient',
  inscriptionMedecin: '/auth/inscription/medecin',
  connexion:          '/auth/connexion',
  verificationOTP:    '/auth/verification/otp',
  renvoyerOTP:        '/auth/otp/renvoyer',
  profil:             '/auth/profil',
  deconnexion:        '/auth/deconnexion',
} as const

// ─────────────────────────────────────────────────────────────
// API AUTH
// ─────────────────────────────────────────────────────────────

export const authApi = {
  // ── Inscription ────────────────────────────────────────────
  inscrirePatient: (
    data: Omit<FormulairePatient, 'consentement'>
  ): Promise<ApiInscription> =>
    client.post(ROUTES.inscriptionPatient, data),

  inscrireMedecin: (
    data: Omit<FormulaireMedecin, 'consentement'>
  ): Promise<ApiInscription> =>
    client.post(ROUTES.inscriptionMedecin, data),

  // ── Connexion — même route, backend détecte via telephone ou email ──
  connexionPatient: (
    data: FormulaireConnexionPatient
  ): Promise<ApiConnexionBrute> =>
    client.post(ROUTES.connexion, data),

  connexionMedecin: (
    data: FormulaireConnexionMedecin
  ): Promise<ApiConnexionBrute> =>
    client.post(ROUTES.connexion, data),

  // ── OTP ────────────────────────────────────────────────────
  verifierOTP: (
    data: FormulaireOTP
  ): Promise<ApiOTP> =>
    client.post(ROUTES.verificationOTP, data),

  renvoyerOTP: (
    telephone: string
  ): Promise<ApiMessage> =>
    client.post(ROUTES.renvoyerOTP, { telephone }),

  // ── Authentifié ────────────────────────────────────────────
  getProfil: (): Promise<ApiUtilisateur> =>
    client.authGet(ROUTES.profil),

  deconnexion: (): Promise<ApiMessage> =>
    client.authPost(ROUTES.deconnexion, {}),
}