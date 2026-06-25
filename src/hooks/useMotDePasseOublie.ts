import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../types/auth'

type Etape = 'saisie' | 'code' | 'nouveau'

export function useMotDePasseOublie(type: 'patient' | 'medecin') {
  const navigate  = useNavigate()
  const [etape, setEtape]             = useState<Etape>('saisie')
  const [chargement, setChargement]   = useState(false)
  const [erreur, setErreur]           = useState('')
  const [tokenReset, setTokenReset]   = useState('')
  const [contact, setContact]         = useState('') // tel ou email

  // Étape 1 — Demande le code
  async function demanderCode(valeur: string) {
    setErreur('')
    setChargement(true)
    setContact(valeur)

    const { data, erreur: err } = type === 'patient'
      ? await authApi.oubliPatient({ telephone: valeur })
      : await authApi.oubliMedecin({ email: valeur })

    setChargement(false)
    if (err) { setErreur(err); return }
    if (data?.message === 'CODE_ENVOYE') setEtape('code')
  }

  // Étape 2 — Vérifie le code
  async function verifierCode(code: string) {
    setErreur('')
    setChargement(true)

    const payload = type === 'patient'
      ? { telephone: contact, code }
      : { email: contact, code }

    const { data, erreur: err } = await authApi.verifierCodeReset(payload)
    setChargement(false)
    if (err) { setErreur(err); return }
    if (data?.message === 'CODE_VALIDE') {
      setTokenReset(data.tokenReset)
      setEtape('nouveau')
    }
  }

  // Étape 3 — Nouveau mot de passe
  async function definirNouveauMotDePasse(mdp: string) {
    setErreur('')
    setChargement(true)

    const { data, erreur: err } = await authApi.reinitialiserMotDePasse({
      tokenReset,
      nouveauMotDePasse: mdp
    })

    setChargement(false)
    if (err) { setErreur(err); return }

    if (data?.token) {
      localStorage.setItem('smartsante.token', data.token)
      localStorage.setItem('smartsante.user', JSON.stringify(data.utilisateur))
      const role = data.utilisateur.role
      navigate(role === 'PATIENT' ? '/patient' : role === 'MEDECIN' ? '/medecin' : '/statistiques')
    }
  }

  return {
    etape, chargement, erreur, contact,
    demanderCode, verifierCode, definirNouveauMotDePasse,
    setErreur
  }
}