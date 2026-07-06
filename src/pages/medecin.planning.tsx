import { Fragment, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Video, CalendarDays, Loader2, AlertTriangle, Plus } from "lucide-react";
import { useMedecinPlanning } from "../hooks/useMedecin";

// Définition des heures de la journée affichées dans la grille
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// Mapping des jours de la semaine pour l'affichage et la correspondance base de données
const daysOfWeek = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/**
 * Composant de la page de gestion du planning médecin.
 * Affiche la grille hebdomadaire des rendez-vous et des disponibilités du médecin.
 * Permet également de déclarer de nouveaux créneaux de consultation.
 */
function PlanningPage() {
  // Récupération des créneaux et des rendez-vous via le hook personnalisé
  const { planning, chargement, erreur, ajouterCreneau, soumissionCreneau } = useMedecinPlanning();

  // États du formulaire d'ajout de créneau
  const [nouveauCreneau, setNouveauCreneau] = useState({
    jourSemaine: "LUNDI",
    heureDebut: "09:00",
    heureFin: "10:00"
  });

  // Soumission du nouveau créneau au backend
  async function handleCreerCreneau(e: React.FormEvent) {
    e.preventDefault();
    const succes = await ajouterCreneau(nouveauCreneau);
    if (succes) {
      alert("Votre créneau de disponibilité a été enregistré.");
    }
  }

  // Helper pour trouver un rendez-vous à un jour et une heure donnés
  const trouverRdv = (dayIndex: number, hourStr: string) => {
    const targetHour = parseInt(hourStr.split(":")[0]);
    return planning?.rendezVous.find((rv) => {
      const d = new Date(rv.dateHeure);
      // Ajustement de l'index du jour (getDay() retourne 0 pour dimanche, 1 pour lundi...)
      const rvDayIndex = (d.getDay() + 6) % 7; 
      const rvHour = d.getHours();
      return rvDayIndex === dayIndex && rvHour === targetHour;
    });
  };

  // Helper pour trouver un créneau de disponibilité à un jour et une heure donnés
  const trouverCreneau = (dayIndex: number, hourStr: string) => {
    const dayName = daysOfWeek[dayIndex];
    const targetHour = parseInt(hourStr.split(":")[0]);
    return planning?.creneaux.find((c) => {
      if (c.jourSemaine !== dayName) return false;
      const cHour = parseInt(c.heureDebut.split(":")[0]);
      return cHour === targetHour;
    });
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-background md:pl-64 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-semibold">Chargement de votre agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background md:pl-64">
      {/* Sidebar de navigation */}
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Agenda"
          title="Mon planning de la semaine"
          description="Visualisez vos rendez-vous et gérez vos créneaux de disponibilité pour les patients."
        />

        {erreur && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center mb-6">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive-foreground">{erreur}</p>
          </div>
        )}

        {/* Section rapide d'ajout de disponibilité */}
        <PanelCard className="mb-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" /> Déclarer une disponibilité
          </h3>
          <form onSubmit={handleCreerCreneau} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Jour</label>
              <select
                value={nouveauCreneau.jourSemaine}
                onChange={(e) => setNouveauCreneau((prev) => ({ ...prev, jourSemaine: e.target.value }))}
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Heure Début</label>
              <select
                value={nouveauCreneau.heureDebut}
                onChange={(e) => setNouveauCreneau((prev) => ({ ...prev, heureDebut: e.target.value }))}
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Heure Fin</label>
              <select
                value={nouveauCreneau.heureFin}
                onChange={(e) => setNouveauCreneau((prev) => ({ ...prev, heureFin: e.target.value }))}
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={soumissionCreneau}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-card hover:opacity-90 disabled:opacity-50"
            >
              {soumissionCreneau ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Ajouter le créneau
            </button>
          </form>
        </PanelCard>

        {/* Grille Hebdomadaire */}
        <PanelCard className="p-0 overflow-hidden">
          <div className="grid overflow-x-auto" style={{ gridTemplateColumns: `80px repeat(${dayLabels.length}, minmax(140px, 1fr))` }}>
            {/* Case vide coin supérieur gauche */}
            <div className="border-b border-r border-border bg-surface-soft sticky left-0 z-10" />
            
            {/* Headers des jours */}
            {dayLabels.map((d) => (
              <div
                key={d}
                className="border-b border-r border-border bg-surface-soft px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground last:border-r-0"
              >
                {d}
              </div>
            ))}

            {/* Lignes par heure */}
            {hours.map((h, hi) => (
              <Fragment key={h}>
                {/* Libellé horaire */}
                <div className="border-b border-r border-border bg-surface-soft px-2 py-3 text-right text-[11px] font-semibold text-muted-foreground sticky left-0 z-10">
                  {h}
                </div>

                {/* Cases journalières */}
                {dayLabels.map((_, di) => {
                  const rdv = trouverRdv(di, h);
                  const creneau = trouverCreneau(di, h);
                  const isTele = rdv?.motif?.toLowerCase().includes("télé") || rdv?.motif?.toLowerCase().includes("tele");

                  return (
                    <div
                      key={`c-${di}-${hi}`}
                      className="relative h-20 border-b border-r border-border last:border-r-0 bg-card hover:bg-surface-soft/20 transition-colors"
                    >
                      {/* Si un rendez-vous est réservé */}
                      {rdv ? (
                        <div
                          className={`absolute inset-1 flex flex-col justify-center gap-0.5 rounded-lg px-2 text-[11px] font-semibold shadow-sm ${
                            isTele
                              ? "bg-secondary/15 text-secondary border-l-2 border-secondary"
                              : "bg-primary/15 text-primary border-l-2 border-primary"
                          }`}
                        >
                          <span className="flex items-center gap-1 truncate">
                            {isTele && <Video className="size-3 shrink-0" />}
                            {rdv.patient.utilisateur.prenom} {rdv.patient.utilisateur.nom}
                          </span>
                          <span className="text-[9px] opacity-70">
                            {isTele ? "Téléconsult." : "Présentiel"}
                          </span>
                        </div>
                      ) : creneau ? (
                        /* Si aucun rendez-vous mais créneau disponible */
                        <div className="absolute inset-1 flex flex-col justify-center items-center rounded-lg px-2 text-[10px] font-bold bg-success/10 text-success border border-success/20">
                          <span>Disponible</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </PanelCard>
      </main>
    </div>
  );
}

export default PlanningPage;