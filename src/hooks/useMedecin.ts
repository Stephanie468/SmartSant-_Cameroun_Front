import { useState, useEffect } from 'react'
import { medecinApi } from '../types/medecin'
import type { MedecinDashboardData, PlanningData } from '../types/medecin'
import type { ConsultationIA, Creneau } from '../types/patient'

/**
 * Hook personnalisé pour charger les données du tableau de bord médecin.
 */
export function useMedecinDashboard() {
  const [data, setData] = useState<MedecinDashboardData | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  async function chargerDashboard() {
    setChargement(true)
    setErreur('')
    try {
      const res = await medecinApi.getDashboard()
      if (res.erreur) {
        setErreur(res.erreur)
      } else if (res.data) {
        setData(res.data)
      }
    } catch (e) {
      setErreur('Impossible de charger le tableau de bord.')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    chargerDashboard()
  }, [])

  return { data, chargement, erreur, rafraichir: chargerDashboard }
}

/**
 * Hook personnalisé pour charger la liste des fiches consultations IA.
 */
export function useMedecinPatients() {
  const [consultations, setConsultations] = useState<ConsultationIA[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  async function chargerPatients() {
    setChargement(true)
    setErreur('')
    try {
      const res = await medecinApi.getPatients()
      if (res.erreur) {
        setErreur(res.erreur)
      } else if (res.data) {
        setConsultations(res.data)
      }
    } catch (e) {
      setErreur('Impossible de charger les fiches patients.')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    chargerPatients()
  }, [])

  return { consultations, chargement, erreur, rafraichir: chargerPatients }
}

/**
 * Hook personnalisé pour gérer la validation des diagnostics et ordonnances.
 */
export function useMedecinPrescription() {
  const [soumission, setSoumission] = useState(false)
  const [erreur, setErreur] = useState('')

  async function prescrire(payload: {
    consultationId: string
    patientId: string
    contenu: string
    rendezVousId?: string
  }): Promise<boolean> {
    setSoumission(true)
    setErreur('')
    try {
      const res = await medecinApi.creerPrescription(payload)
      if (res.erreur) {
        setErreur(res.erreur)
        return false
      }
      return true
    } catch (e) {
      setErreur('Une erreur est survenue lors de la création de la prescription.')
      return false
    } finally {
      setSoumission(false)
    }
  }

  return { prescrire, soumission, erreur }
}

/**
 * Hook personnalisé pour charger et modifier le planning de consultation.
 */
export function useMedecinPlanning() {
  const [planning, setPlanning] = useState<PlanningData | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [soumissionCreneau, setSoumissionCreneau] = useState(false)

  async function chargerPlanning() {
    setChargement(true)
    setErreur('')
    try {
      const res = await medecinApi.getPlanning()
      if (res.erreur) {
        setErreur(res.erreur)
      } else if (res.data) {
        setPlanning(res.data)
      }
    } catch (e) {
      setErreur('Impossible de charger le planning.')
    } finally {
      setChargement(false)
    }
  }

  async function ajouterCreneau(data: {
    jourSemaine: string
    heureDebut: string
    heureFin: string
  }): Promise<boolean> {
    setSoumissionCreneau(true)
    setErreur('')
    try {
      const res = await medecinApi.creerCreneau(data)
      if (res.erreur) {
        setErreur(res.erreur)
        return false
      }
      await chargerPlanning()
      return true
    } catch (e) {
      setErreur('Impossible de créer le créneau.')
      return false
    } finally {
      setSoumissionCreneau(false)
    }
  }

  useEffect(() => {
    chargerPlanning()
  }, [])

  return { planning, chargement, erreur, ajouterCreneau, soumissionCreneau, rafraichir: chargerPlanning }
}
