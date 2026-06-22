import { useState, useEffect } from 'react'
import { patientApi } from '../types/patient'
import type { ConsultationIA } from '../types/patient'

export function useConsultations() {
  const [consultations, setConsultations] = useState<ConsultationIA[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    async function charger() {
      const { data, erreur: err } = await patientApi.getConsultations()
      setChargement(false)
      if (err) setErreur(err)
      else if (data) setConsultations(data)
    }
    charger()
  }, [])

  return { consultations, chargement, erreur }
}