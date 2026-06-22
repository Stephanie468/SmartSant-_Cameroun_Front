import { useState, useEffect } from 'react'
import { patientApi } from '../types/patient'
import type { Ordonnance } from '../types/patient'

export function useOrdonnances() {
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    async function charger() {
      const { data, erreur: err } = await patientApi.getOrdonnances()
      setChargement(false)
      if (err) setErreur(err)
      else if (data) setOrdonnances(data)
    }
    charger()
  }, [])

  return { ordonnances, chargement, erreur }
}