import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  Pill,
  Activity,
  MapPin,
  MessageCircle,
  ArrowRight,
  Thermometer,
  HeartPulse,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard } from "@/components/Card";
import mapDouala from "@/assets/map-douala.png";
import { patientApi } from "../api";
import type { PatientDashboardData } from "../types/patient";

// Helper pour parser le contenu de l'ordonnance
function parseContenuOrdonnance(contenu: string) {
  return contenu.split('\n').filter(Boolean).map(line => {
    const parts = line.split('|');
    if (parts.length >= 3) {
      return {
        name: parts[0].trim(),
        dose: parts[1].trim(),
        dur: parts[2].trim(),
        left: parts[3] ? parts[3].trim() : "En cours"
      };
    } else {
      return {
        name: line.trim(),
        dose: "-",
        dur: "-",
        left: "En cours"
      };
    }
  });
}

function PatientDashboard() {
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    async function chargerDashboard() {
      try {
        const { data: res, erreur: err } = await patientApi.getDashboard();
        if (err) {
          setErreur(err);
        } else {
          setData(res);
        }
      } catch (e) {
        setErreur("Impossible de charger les données du tableau de bord.");
      } finally {
        setChargement(false);
      }
    }
    chargerDashboard();
  }, []);

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

  if (erreur || !data) {
    return (
      <div className="min-h-screen bg-background md:pl-64">
        <SiteNav variant="patient" />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-10 text-destructive mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-destructive">Une erreur est survenue</h3>
            <p className="mt-2 text-sm text-destructive-foreground">{erreur || "Impossible de récupérer vos informations."}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-white"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { patient, constantes, consultationsIA, prochainRdv, ordonnances, structuresProches } = data;

  // Récupère toutes les lignes de prescriptions de toutes les ordonnances actives
  const prescriptionsActives = ordonnances.slice(0, 1).flatMap(o => parseContenuOrdonnance(o.contenu));

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Tableau de bord
            </span>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              Bonjour, {patient.prenom} {patient.nom}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {consultationsIA.length > 0 ? (
                <>Dernière consultation IA le {new Date(consultationsIA[0].dateConsultation).toLocaleDateString("fr-FR")} · {patient.ville || "Cameroun"}</>
              ) : (
                <>Bienvenue sur SmartSanté · {patient.ville || "Cameroun"}</>
              )}
            </p>
          </div>
          <a
            href="https://wa.me/237683641781"
            className="hidden items-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02] md:inline-flex"
          >
            <MessageCircle className="size-4" /> Nouveau diagnostic IA
          </a>
        </div>

        {/* Vitals row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Thermometer, label: "Température", value: constantes.temperature || "37.2°C", tone: "text-success" },
            { icon: HeartPulse, label: "Rythme card.", value: constantes.rythmeCardiaque || "72 bpm", tone: "text-primary" },
            { icon: Activity, label: "Tension", value: constantes.tension || "12/8", tone: "text-secondary" },
            { icon: TrendingUp, label: "Glycémie", value: constantes.glycemie || "0.95 g/L", tone: "text-warning" },
          ].map((v) => (
            <PanelCard key={v.label} className="p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <v.icon className={`size-4 ${v.tone}`} /> {v.label}
              </div>
              <p className="mt-3 font-display text-2xl font-bold">{v.value}</p>
            </PanelCard>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Diagnostics */}
          <PanelCard className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Historique des diagnostics IA</h2>
              <Link to="/historique" className="text-xs font-semibold text-primary">
                Voir tout
              </Link>
            </div>
            <div className="space-y-3">
              {consultationsIA.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun diagnostic IA enregistré. Utilisez le chatbot WhatsApp pour commencer.</p>
              ) : (
                consultationsIA.map((c) => {
                  const pathologiesList = c.pathologies.map(p => p.pathologie.nom).join(', ');
                  const title = pathologiesList ? `Suspicion de ${pathologiesList}` : "Consultation IA";
                  const prob = c.pathologies?.[0]?.probabilite ? Math.round(c.pathologies[0].probabilite * 100) : 75;
                  
                  return (
                    <div
                      key={c.id}
                      className="rounded-xl border border-border bg-surface-soft p-4 transition-all hover:bg-card hover:shadow-card"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">Pré-diagnostic #{c.id.slice(0, 5).toUpperCase()}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{title}</p>
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            {new Date(c.dateConsultation).toLocaleDateString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          c.suiviEffectue ? "bg-accent text-accent-foreground" : "bg-warning/20 text-warning-foreground"
                        }`}>
                          {c.suiviEffectue ? "TERMINÉ" : "EN ATTENTE"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {prob}% confiance
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </PanelCard>

          {/* Next appointment */}
          {prochainRdv ? (
            <PanelCard className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Prochain rendez-vous
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold">
                Dr. {prochainRdv.medecin.utilisateur.prenom} {prochainRdv.medecin.utilisateur.nom}
              </h3>
              <p className="text-sm text-white/80">
                {prochainRdv.medecin.specialite} · {prochainRdv.medecin.formationSanitaire?.nom || "Consultation en ligne"}
              </p>
              <div className="mt-6 flex items-center gap-2 text-base font-semibold">
                <Calendar className="size-5" /> 
                {new Date(prochainRdv.dateHeure).toLocaleDateString("fr-FR", { 
                  weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Link
                  to="/rendez-vous"
                  className="rounded-xl bg-white/15 px-3 py-2 text-center text-xs font-semibold backdrop-blur transition-colors hover:bg-white/25"
                >
                  Gérer
                </Link>
                <button className="rounded-xl bg-white px-3 py-2 text-center text-xs font-semibold text-primary shadow-card">
                  Itinéraire
                </button>
              </div>
            </PanelCard>
          ) : (
            <PanelCard className="border border-dashed border-border flex flex-col justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Prochain rendez-vous
                </p>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">Aucun rendez-vous prévu</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Vous pouvez planifier une consultation en présentiel ou en ligne avec nos médecins partenaires agréés.
                </p>
              </div>
              <Link
                to="/rendez-vous"
                className="mt-6 block w-full rounded-xl bg-primary text-primary-foreground font-semibold text-xs text-center py-2.5 shadow-card hover:bg-primary/95"
              >
                Planifier un rendez-vous
              </Link>
            </PanelCard>
          )}
        </div>

        {/* Prescriptions + Map */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <PanelCard className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Prescriptions actives</h2>
              <Link to="/prescriptions" className="text-xs font-semibold text-primary">
                Toutes mes ordonnances
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-soft text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Médicament</th>
                    <th className="px-4 py-3">Posologie</th>
                    <th className="px-4 py-3">Durée</th>
                    <th className="px-4 py-3 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prescriptionsActives.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Aucun médicament en cours de traitement.
                      </td>
                    </tr>
                  ) : (
                    prescriptionsActives.map((p, index) => (
                      <tr key={index} className="hover:bg-surface-soft">
                        <td className="px-4 py-3 font-medium">
                          <span className="inline-flex items-center gap-2">
                            <Pill className="size-4 text-primary" /> {p.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.dose}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.dur}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                            {p.left}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </PanelCard>

          <PanelCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Structures proches</h2>
              <Link to="/centres" className="text-xs font-semibold text-primary">
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border">
              <img
                src={mapDouala}
                alt="Carte des centres de santé proches"
                loading="lazy"
                width={800}
                height={800}
                className="size-full object-cover"
              />
              {structuresProches.length > 0 && (
                <div className="absolute inset-x-3 bottom-3 rounded-xl bg-card/95 p-3 backdrop-blur shadow-lift">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-bold">{structuresProches[0].nom}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {structuresProches[0].adresse} · {structuresProches[0].horaires || "Ouvert 24/7"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PanelCard>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;