import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../types/auth'
import type {
  FormulaireConnexionPatient,
  FormulaireConnexionMedecin,
} from '../types/auth'

export function useConnexion() {
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  // ── Connexion Patient ────────────────────────────────────────
  async function connecterPatient(data: FormulaireConnexionPatient) {
    setErreur('')
    setChargement(true)

    const { data: reponse, erreur: err } = await authApi.connexionPatient(data)

    setChargement(false)

    // Erreur réseau ou serveur
    if (err) {
      setErreur(err)
      return
    }

    if (!reponse) return

    // Backend a généré l'OTP → redirige vers verification
    if (reponse.message === 'OTP_SENT') {
      sessionStorage.setItem(
        'smartsante.otp',
        JSON.stringify({
          telephone: reponse.telephone,
          nom:       reponse.nom,
          nouveauCompte: false,
        })
      )
      navigate('/verification')
    }
  }

  // ── Connexion Médecin ────────────────────────────────────────
  async function connecterMedecin(data: FormulaireConnexionMedecin) {
    setErreur('')
    setChargement(true)

    const { data: reponse, erreur: err } = await authApi.connexionMedecin(data)

    setChargement(false)

    // Erreur HTTP (401, 403, 500...)
    if (err) {
      // Le backend retourne le message dans err quand statut non-OK
      if (err.includes('COMPTE_EN_ATTENTE')) {
        navigate('/attente-validation')
        return
      }
      if (err.includes('COMPTE_SUSPENDU')) {
        setErreur('Votre compte a été suspendu. Contactez support@smartsante.cm')
        return
      }
      setErreur(err)
      return
    }

    if (!reponse) return

    // Vérifications supplémentaires sur le message retourné
    if (reponse.message === 'COMPTE_EN_ATTENTE') {
      navigate('/attente-validation')
      return
    }

    if (reponse.message === 'COMPTE_SUSPENDU') {
      setErreur('Votre compte a été suspendu. Contactez support@smartsante.cm')
      return
    }

    // ✅ Connexion réussie — token disponible
    if ('token' in reponse) {
      localStorage.setItem('smartsante.token', reponse.token)
      localStorage.setItem('smartsante.user', JSON.stringify(reponse.utilisateur))

      switch (reponse.utilisateur.role) {
        case 'MEDECIN': navigate('/medecin'); break
        case 'ADMIN':   navigate('/statistiques'); break
        default:        navigate('/')
      }
    }
  }

  return { connecterPatient, connecterMedecin, chargement, erreur, setErreur }
}