import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../types/auth.js'

export function useVerification() {
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  // ── Vérifie le code OTP saisi par l'utilisateur ───────────
  async function verifierCode(telephone: string, code: string) {
    setErreur('')
    setChargement(true)

    const { data, erreur: err } = await authApi.verifierOTP({ telephone, code })

    setChargement(false)

    if (err) {
      // Affiche l'erreur retournée par le backend
      // Ex: "Code incorrect" ou "Code expiré"
      setErreur(err)
      return
    }

    if (data) {
      // ✅ Succès — sauvegarde le token JWT pour les futures requêtes
      localStorage.setItem('smartsante.token', data.token)

      // Sauvegarde les infos utilisateur pour affichage
      localStorage.setItem('smartsante.user', JSON.stringify(data.utilisateur))

      // Nettoie le sessionStorage utilisé pendant l'inscription
      sessionStorage.removeItem('smartsante.otp')

      // Redirige selon le rôle de l'utilisateur
      switch (data.utilisateur.role) {
        case 'PATIENT':
          navigate('/patient')
          break
        case 'MEDECIN':
          navigate('/medecin')
          break
        case 'ADMIN':
          navigate('/statistiques')
          break
        default:
          navigate('/')
      }
    }
  }

  // ── Renvoie un nouveau code OTP ───────────────────────────
  async function renvoyerCode(telephone: string) {
    setErreur('')
    setChargement(true)

    const { erreur: err } = await authApi.renvoyerOTP(telephone)

    setChargement(false)

    if (err) setErreur(err)
  }

  return { verifierCode, renvoyerCode, chargement, erreur, setErreur }
}