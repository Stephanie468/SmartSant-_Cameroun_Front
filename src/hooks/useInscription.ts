import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../types/auth'
import type { FormulairePatient, FormulaireMedecin } from '../types/auth'

export function useInscription() {
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  // ── Inscription Patient ──────────────────────────────────────
  // Après inscription → redirige vers /verification pour saisir l'OTP
  async function soumettrePatient(data: FormulairePatient) {
    setErreur('')
    setChargement(true)

    const telephone = data.telephone.replace(/\s+/g, '')

    const { erreur: err } = await authApi.inscrirePatient({
      nom: data.nom,
      prenom: data.prenom,
      telephone,
      dateNaissance: data.dateNaissance,
      ville: data.ville,
      motDePasse: data.motDePasse,
    })

    setChargement(false)

    if (err) {
      setErreur(err)
      return
    }
    
    // Sauvegarde les infos pour la page /verification
    sessionStorage.setItem(
      'smartsante.otp',
      JSON.stringify({ telephone, nom: data.nom, nouveauCompte: true })
    )

    //  Patient → va saisir son OTP WhatsApp
    navigate('/verification')
  }

  // ── Inscription Médecin ──────────────────────────────────────
  // Après inscription → redirige vers /attente-validation
  async function soumettreMedecin(data: FormulaireMedecin) {
    setErreur('')
    setChargement(true)

    const { erreur: err } = await authApi.inscrireMedecin({
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone.replace(/\s+/g, ''),
      email: data.email,
      motDePasse: data.motDePasse,
      specialite: data.specialite,
      hopital: data.hopital,
      numeroOrdre: data.numeroOrdre,
      carteProfessionnelleUrl: data.carteProfessionnelleUrl,
    })

    setChargement(false)

    if (err) {
      setErreur(err)
      return
    }

    // Médecin → attend la validation admin
    navigate('/attente-validation')
  }

  return { soumettrePatient, soumettreMedecin, chargement, erreur, setErreur }
}