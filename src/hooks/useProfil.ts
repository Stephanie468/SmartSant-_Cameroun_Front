import { useState } from 'react'
import { patientApi } from '../types/patient'
import type { PatientProfil } from '../types/patient'

export function useProfil() {
  const [chargement, setChargement] = useState(false)
  const [succes, setSucces] = useState('')
  const [erreur, setErreur] = useState('')

  async function modifierProfil(data: Partial<PatientProfil>) {
    setChargement(true)
    setErreur('')
    setSucces('')
    const { data: reponse, erreur: err } = await patientApi.modifierProfil(data)
    setChargement(false)
    if (err) { setErreur(err); return false }
    if (reponse) {
      // Met à jour les infos locales
      const userStr = localStorage.getItem('smartsante.user')
      if (userStr) {
        const user = JSON.parse(userStr)
        localStorage.setItem('smartsante.user', JSON.stringify({
          ...user,
          nom: reponse.patient.nom,
          prenom: reponse.patient.prenom
        }))
      }
      setSucces('Profil mis à jour avec succès.')
      return true
    }
    return false
  }

  return { modifierProfil, chargement, succes, erreur }
}