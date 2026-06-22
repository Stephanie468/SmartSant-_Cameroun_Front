import { useState, useEffect } from 'react'
import { patientApi } from '../types/patient'
import type { RendezVous, BookingData, MedecinInfo } from '../types/patient'

export function useRendezVous() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [medecins, setMedecins] = useState<MedecinInfo[]>([])
  const [chargement, setChargement] = useState(true)
  const [soumission, setSoumission] = useState(false)
  const [erreur, setErreur] = useState('')

  // Charge les RDV et les médecins disponibles en parallèle
  async function charger() {
    setChargement(true)
    const [rdvRes, medRes] = await Promise.all([
      patientApi.getRendezVous(),
      patientApi.getMedecins()
    ])
    setChargement(false)
    if (rdvRes.erreur) { setErreur(rdvRes.erreur); return }
    if (medRes.erreur) { setErreur(medRes.erreur); return }
    if (rdvRes.data) setRendezVous(rdvRes.data)
    if (medRes.data) setMedecins(medRes.data)
  }

  useEffect(() => { charger() }, [])

  // Crée un nouveau rendez-vous
  async function creerRdv(data: BookingData): Promise<boolean> {
    setSoumission(true)
    setErreur('')
    const { data: reponse, erreur: err } = await patientApi.creerRendezVous(data)
    setSoumission(false)
    if (err) { setErreur(err); return false }
    // Recharge les RDV après création
    await charger()
    return true
  }

  return { rendezVous, medecins, chargement, soumission, erreur, creerRdv }
}