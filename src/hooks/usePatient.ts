import { useState, useEffect } from 'react'
import { patientApi } from '../types/patient'
import type { PatientDashboardData } from '../types/patient'

export function usePatientDashboard() {
  const [data, setData] = useState<PatientDashboardData | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    async function charger() {
      const { data: reponse, erreur: err } = await patientApi.getDashboard()
      setChargement(false)
      if (err) setErreur(err)
      else if (reponse) setData(reponse)
    }
    charger()
  }, [])

  return { data, chargement, erreur }
}