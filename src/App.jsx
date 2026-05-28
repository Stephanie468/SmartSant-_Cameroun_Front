import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages patient
import Index from "./pages/index"
import Login from "./pages/login"
import Inscription from "./pages/inscription"
import Verification from "./pages/verification"
import Patient from "./pages/patient"
import Historique from "./pages/historique"
import Centres from "./pages/centres"
import Prescriptions from "./pages/prescriptions"
import RendezVous from "./pages/rendez-vous"

// Pages médecin
import Medecin from "./pages/medecin"
import MedecinPatients from "./pages/medecin.patients"
import MedecinPlanning from "./pages/medecin.planning"
import MedecinTeleconsultation from "./pages/medecin.teleconsultation"

// Pages admin
import Statistiques from "./pages/statistiques"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/verification" element={<Verification />} />

        <Route path="/patient" element={<Patient />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/centres" element={<Centres />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/rendez-vous" element={<RendezVous />} />

        <Route path="/medecin" element={<Medecin />} />
        <Route path="/medecin/patients" element={<MedecinPatients />} />
        <Route path="/medecin/planning" element={<MedecinPlanning />} />
        <Route path="/medecin/teleconsultation" element={<MedecinTeleconsultation />} />

        <Route path="/statistiques" element={<Statistiques />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App