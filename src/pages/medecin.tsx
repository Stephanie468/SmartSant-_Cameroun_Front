import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard } from "@/components/Card";
import { Users, Activity, Video, Clock, ArrowRight, AlertCircle, Loader2, AlertTriangle } from "lucide-react";
import { useMedecinDashboard } from "../hooks/useMedecin";

/**
 * Composant principal de l'Espace Médecin - Tableau de bord.
 * Affiche les statistiques clés (KPIs), la file d'attente des fiches IA, et le planning du jour.
 */
function MedecinDashboard() {
  // Appel du hook pour récupérer les données dynamiques du backend
  const { data, chargement, erreur, rafraichir } = useMedecinDashboard();

  // État de chargement initial
  if (chargement) {
    return (
      <div className="min-h-screen bg-background md:pl-64 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-semibold">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur en cas de problème de connexion ou d'authentification
  if (erreur || !data) {
    return (
      <div className="min-h-screen bg-background md:pl-64">
        <SiteNav variant="medecin" />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-destructive">Erreur de chargement</h3>
            <p className="mt-2 text-sm text-destructive-foreground">{erreur || "Impossible de récupérer les statistiques."}</p>
            <button
              onClick={rafraichir}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { medecin, kpis, fileAttente, planningJour } = data;

  return (
    <div className="min-h-screen bg-background md:pl-64">
      {/* Barre latérale de navigation pour médecin */}
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              Espace professionnel
            </span>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              Bienvenue Dr. {medecin.prenom} {medecin.nom}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {medecin.structure} · {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <Link
              to="/medecin/planning"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card hover:bg-surface-soft"
            >
              Mon planning
            </Link>
            <Link
              to="/medecin/teleconsultation"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-card hover:scale-[1.02]"
            >
              <Video className="size-4" /> Démarrer téléconsultation
            </Link>
          </div>
        </div>

        {/* Ligne des KPIs de performance et volume */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Fiches en attente", value: kpis.fichesEnAttente, sub: "Triage IA à valider", tone: "text-destructive", icon: AlertCircle },
            { label: "Téléconsultations", value: kpis.teleconsultations, sub: "Aujourd'hui", tone: "text-secondary", icon: Video },
            { label: "Patients ce mois", value: kpis.patientsCeMois, sub: "Suivis actifs", tone: "text-success", icon: Users },
            { label: "Temps moyen", value: kpis.tempsMoyen, sub: "Par consultation", tone: "text-primary", icon: Clock },
          ].map((s) => (
            <PanelCard key={s.label}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
                <s.icon className={`size-4 ${s.tone}`} />
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </PanelCard>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* File d'attente des patients triés par l'IA */}
          <PanelCard className="lg:col-span-2 p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-surface-soft px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="size-2 animate-pulse rounded-full bg-primary" />
                <h2 className="font-display text-lg font-bold">File d'attente · Fiches IA entrantes</h2>
              </div>
              <Link to="/medecin/patients" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Toutes les fiches <ArrowRight className="size-3" />
              </Link>
            </div>
            {fileAttente.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Aucune fiche IA en attente d'évaluation dans votre établissement.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-soft/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Pré-diagnostic IA</th>
                    <th className="px-6 py-3">Urgence</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fileAttente.map((p) => {
                    const urgenceLabel = p.niveauUrgence === 'ROUGE' ? 'Élevée' : p.niveauUrgence === 'ORANGE' ? 'Moyenne' : 'Faible';
                    const tone = p.niveauUrgence === 'ROUGE'
                      ? "bg-destructive/15 text-destructive"
                      : p.niveauUrgence === 'ORANGE'
                        ? "bg-warning/20 text-warning-foreground"
                        : "bg-success/15 text-success";

                    return (
                      <tr key={p.id} className="hover:bg-surface-soft">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                              {p.patient.utilisateur.nom[0]}{p.patient.utilisateur.prenom[0]}
                            </div>
                            <div>
                              <p className="font-medium">{p.patient.utilisateur.prenom} {p.patient.utilisateur.nom}</p>
                              <p className="text-[11px] text-muted-foreground">{p.patient.ville || "Yaoundé"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground italic">
                          {p.preDiagnostic}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${tone}`}>
                            {urgenceLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to="/medecin/patients"
                            state={{ selectedId: p.id }}
                            className="rounded-lg bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary hover:bg-secondary/20 transition-colors"
                          >
                            Ouvrir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </PanelCard>

          {/* Calendrier / Planning du jour */}
          <PanelCard>
            <h2 className="mb-4 font-display text-lg font-bold">Planning du jour</h2>
            {planningJour.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Aucun rendez-vous planifié aujourd'hui.
              </div>
            ) : (
              <div className="space-y-3">
                {planningJour.map((s) => {
                  const formatHeure = new Date(s.dateHeure).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isTele = s.motif?.toLowerCase().includes('télé') || s.motif?.toLowerCase().includes('tele');

                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface-soft p-3 hover:shadow-sm transition-shadow"
                    >
                      <span className="font-display font-bold text-primary">{formatHeure}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {s.patient.utilisateur.prenom} {s.patient.utilisateur.nom}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                          {isTele ? "Téléconsultation" : "Présentiel"}
                        </p>
                      </div>
                      {isTele && (
                        <Video className="size-4 text-secondary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </PanelCard>
        </div>
      </main>
    </div>
  );
}

export default MedecinDashboard;