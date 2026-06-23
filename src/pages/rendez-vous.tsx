import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Calendar, Clock, MapPin, Video, Plus, Loader2, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useRendezVous } from "../hooks/useRendezVous"
import type { Creneau } from "../types/patient"

// Traducteur jour de la semaine
const JOURS: Record<string, string> = {
  LUNDI: "Lun",
  MARDI: "Mar",
  MERCREDI: "Mer",
  JEUDI: "Jeu",
  VENDREDI: "Ven",
  SAMEDI: "Sam",
  DIMANCHE: "Dim"
};

const JOURS_SEMAINE: Record<string, number> = {
  DIMANCHE: 0,
  LUNDI: 1,
  MARDI: 2,
  MERCREDI: 3,
  JEUDI: 4,
  VENDREDI: 5,
  SAMEDI: 6,
};

function RdvPage() {
  // Charger les données
  const {
    rendezVous: appointments,
    medecins,
    chargement,
    soumission: soumissionEnCours,
    erreur,
    creerRdv
  } = useRendezVous()

  const [modalOpen, setModalOpen] = useState(false)
  const [medecinSelectionne, setMedecinSelectionne] = useState("")
  const [creneauSelectionne, setCreneauSelectionne] = useState("")
  const [motif, setMotif] = useState("")

  const creneauxDisponibles = medecins.find(m => m.id === medecinSelectionne)?.creneaux || [];

  function getDateForCreneau(creneau: Creneau) {
    const now = new Date()
    const [hour, minute] = creneau.heureDebut.split(":").map(Number)
    const targetDay = JOURS_SEMAINE[creneau.jourSemaine] ?? now.getDay()
    const date = new Date(now)
    date.setHours(hour, minute, 0, 0)

    const currentDay = now.getDay()
    let diff = targetDay - currentDay
    if (diff < 0 || (diff === 0 && date <= now)) {
      diff += 7
    }
    date.setDate(date.getDate() + diff)
    return date
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    const creneau = creneauxDisponibles.find(c => c.id === creneauSelectionne)
    if (!creneau || !medecinSelectionne) {
      return
    }

    const dateRdv = getDateForCreneau(creneau)
    const ok = await creerRdv({
      medecinId: medecinSelectionne,
      creneauId: creneauSelectionne,
      dateHeure: dateRdv.toISOString(),
      motif: motif || undefined
    })

    if (ok) {
      setModalOpen(false)
      setMedecinSelectionne("")
      setCreneauSelectionne("")
      setMotif("")
    }
  }

  // Compter le nombre de créneaux dispos par jour de la semaine (pour affichage stats)
  const creneauxParJour: Record<string, number> = {
    LUNDI: 0, MARDI: 0, MERCREDI: 0, JEUDI: 0, VENDREDI: 0, SAMEDI: 0, DIMANCHE: 0
  };
  medecins.forEach(m => {
    m.creneaux.forEach(c => {
      if (c.disponible) {
        creneauxParJour[c.jourSemaine] = (creneauxParJour[c.jourSemaine] || 0) + 1;
      }
    });
  });

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Planning"
          title="Mes rendez-vous"
          description="Consultez, replanifiez ou prenez un nouveau rendez-vous avec nos médecins partenaires."
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" /> Nouveau RDV
            </button>
          }
        />

        {chargement ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="size-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Chargement de vos rendez-vous...</p>
            </div>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-destructive">Une erreur est survenue</h3>
            <p className="text-xs text-destructive-foreground mt-1">{erreur}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {appointments.length === 0 ? (
              <PanelCard className="text-center p-10 border border-dashed border-border">
                <Calendar className="size-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-display text-base font-bold">Aucun rendez-vous</h3>
                <p className="text-xs text-muted-foreground mt-1">Vous n'avez pas de rendez-vous programmé.</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-card"
                >
                  Prendre mon premier RDV
                </button>
              </PanelCard>
            ) : (
              appointments.map((a) => {
                const dateRdv = new Date(a.dateHeure);
                const formattingDate = dateRdv.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' }).split(' ');
                const day = formattingDate[0];
                const month = formattingDate[1]?.toUpperCase() || "";
                
                const formatTime = dateRdv.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
                const isTeleconsult = !a.medecin.formationSanitaire;
                const location = a.medecin.formationSanitaire?.nom 
                  ? `${a.medecin.formationSanitaire.nom}, ${a.medecin.formationSanitaire.ville}`
                  : "Téléconsultation vidéo";

                return (
                  <PanelCard key={a.id} className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="grid w-20 shrink-0 place-items-center rounded-2xl bg-accent py-3 text-accent-foreground">
                      <span className="font-display text-2xl font-extrabold leading-none">{day}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{month}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-lg font-bold">
                          Dr. {a.medecin.utilisateur.prenom} {a.medecin.utilisateur.nom}
                        </h3>
                        <span className="rounded-md bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          {a.medecin.specialite}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          a.statut === 'CONFIRME' 
                            ? 'bg-success/10 text-success' 
                            : a.statut === 'ANNULE'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {a.statut}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-4 text-primary" /> {formatTime}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          {isTeleconsult ? (
                            <Video className="size-4 text-secondary" />
                          ) : (
                            <MapPin className="size-4 text-primary" />
                          )}
                          {location}
                        </span>
                      </div>
                      {a.motif && <p className="mt-2 text-xs text-muted-foreground italic">Motif : {a.motif}</p>}
                    </div>
                    <div className="flex gap-2">
                      {a.statut === 'EN_ATTENTE' && (
                        <span className="text-xs text-warning font-semibold border border-warning/20 bg-warning/5 rounded-xl px-4 py-2">
                          En attente de confirmation
                        </span>
                      )}
                      {a.statut === 'CONFIRME' && (
                        <button
                          className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-card ${
                            isTeleconsult
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {isTeleconsult ? "Rejoindre l'appel" : "Itinéraire"}
                        </button>
                      )}
                    </div>
                  </PanelCard>
                );
              })
            )}
          </div>
        )}

        {/* Available slots count */}
        <h2 className="mt-12 font-display text-xl font-bold">Créneaux disponibles cette semaine</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {Object.entries(JOURS).map(([cle, val]) => (
            <PanelCard key={cle} className="p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{val}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-primary">
                {creneauxParJour[cle] || 0}
              </p>
              <p className="text-[10px] text-muted-foreground">créneaux</p>
            </PanelCard>
          ))}
        </div>
      </main>

      {/* Booking modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          <PanelCard className="relative z-10 w-full max-w-md shadow-lift animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h2 className="font-display text-lg font-bold">Prendre un rendez-vous</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 hover:bg-surface-soft">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Sélectionner un médecin
                </label>
                <select
                  value={medecinSelectionne}
                  onChange={e => {
                    setMedecinSelectionne(e.target.value);
                    setCreneauSelectionne("");
                  }}
                  required
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-primary outline-none"
                >
                  <option value="">-- Choisir un praticien --</option>
                  {medecins.map(m => (
                    <option key={m.id} value={m.id}>
                      Dr. {m.utilisateur.nom} {m.utilisateur.prenom} ({m.specialite})
                    </option>
                  ))}
                </select>
              </div>

              {medecinSelectionne && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Choisir une disponibilité
                  </label>
                  {creneauxDisponibles.length === 0 ? (
                    <p className="text-xs text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                      Ce médecin n'a aucun créneau disponible pour le moment.
                    </p>
                  ) : (
                    <select
                      value={creneauSelectionne}
                      onChange={e => setCreneauSelectionne(e.target.value)}
                      required
                      className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-primary outline-none"
                    >
                      <option value="">-- Choisir un créneau --</option>
                      {creneauxDisponibles.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.jourSemaine} de {c.heureDebut} à {c.heureFin}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Motif de consultation
                </label>
                <textarea
                  value={motif}
                  onChange={e => setMotif(e.target.value)}
                  placeholder="Ex : Fièvre persistante, maux de tête, suivi paludisme..."
                  className="w-full min-h-20 rounded-xl border border-input bg-card px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={soumissionEnCours || !medecinSelectionne || !creneauSelectionne}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/95 disabled:opacity-60"
              >
                {soumissionEnCours ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Réservation en cours...
                  </>
                ) : (
                  "Confirmer le rendez-vous"
                )}
              </button>
            </form>
          </PanelCard>
        </div>
      )}
    </div>
  );
}

export default RdvPage;