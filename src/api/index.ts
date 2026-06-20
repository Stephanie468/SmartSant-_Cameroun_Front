// Point d'entrée unique
// client.ts reste séparé car utilisé par tous les modules
export { client } from './client'

// Les APIs viennent maintenant directement des types
export { authApi } from '../types/auth.js'

// Tu ajouteras au fur et à mesure :
// export { patientApi }      from '../types/patient.js'
// export { medecinApi }      from '../types/medecin.js'
// export { consultationApi } from '../types/consultation.js'