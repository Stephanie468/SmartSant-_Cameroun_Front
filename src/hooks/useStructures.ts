import { useState, useEffect } from 'react'
import { patientApi } from '../types/patient'
import type { FormationSanitaire } from '../types/patient'

export function useStructures() {
  const [structures, setStructures] = useState<FormationSanitaire[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    async function charger() {
      const { data, erreur: err } = await patientApi.getStructures()
      setChargement(false)
      if (err) setErreur(err)
      else if (data) setStructures(data)
    }
    charger()
  }, [])

  return { structures, chargement, erreur }
}