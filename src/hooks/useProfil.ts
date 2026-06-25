import { useState, useEffect } from 'react'
import { authApi } from '../types/auth'
import type { ProfilComplet, FormulaireModifierMotDePasse } from '../types/auth'

export function useProfil() {
  const [profil, setProfil]           = useState<ProfilComplet | null>(null)
  const [chargement, setChargement]   = useState(true)
  const [erreur, setErreur]           = useState('')
  const [succes, setSucces]           = useState('')
  const [mdpChargement, setMdpChargement] = useState(false)
  const [mdpErreur, setMdpErreur]     = useState('')
  const [mdpSucces, setMdpSucces]     = useState('')

  useEffect(() => {
    async function charger() {
      const { data, erreur: err } = await authApi.getProfil()
      setChargement(false)
      if (err) setErreur(err)
      else if (data) setProfil(data)
    }
    charger()
  }, [])

  async function modifierMotDePasse(data: FormulaireModifierMotDePasse) {
    if (data.nouveauMotDePasse !== data.confirmerMotDePasse) {
      setMdpErreur('Les mots de passe ne correspondent pas.')
      return false
    }
    setMdpErreur('')
    setMdpChargement(true)

    const { erreur: err } = await authApi.modifierMotDePasse({
      ancienMotDePasse: data.ancienMotDePasse,
      nouveauMotDePasse: data.nouveauMotDePasse
    })

    setMdpChargement(false)
    if (err) { setMdpErreur(err); return false }
    setMdpSucces('Mot de passe modifié avec succès.')
    setTimeout(() => setMdpSucces(''), 3000)
    return true
  }

  return {
    profil, chargement, erreur, succes,
    mdpChargement, mdpErreur, mdpSucces,
    modifierMotDePasse
  }
}