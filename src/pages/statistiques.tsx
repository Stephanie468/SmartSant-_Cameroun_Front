import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { TrendingUp, TrendingDown, AlertTriangle, Loader2 } from "lucide-react";
import { adminApi, type AdminStats } from "../types/admin";

function StatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function chargerStats() {
      try {
        const { data, erreur: err } = await adminApi.getStats();
        if (err) {
          setErreur(err);
        } else if (data) {
          setStats(data);
        }
      } catch (e) {
        setErreur("Une erreur est survenue lors de la communication avec le serveur.");
      } finally {
        setChargement(false);
      }
    }
    chargerStats();
  }, []);

  if (chargement) {
    return (
      <div className="min-h-screen bg-background md:pl-64 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-semibold">Chargement des données épidémiologiques...</p>
        </div>
      </div>
    );
  }

  if (erreur || !stats) {
    return (
      <div className="min-h-screen bg-background md:pl-64">
        <SiteNav variant="admin" />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-destructive">Erreur de chargement</h3>
            <p className="mt-2 text-sm text-destructive-foreground">{erreur || "Impossible de récupérer les statistiques."}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Calcul du max de cas pour mettre à l'échelle le graphe
  const maxCases = Math.max(...stats.regionsCases.map((r) => r.cases), 1);

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="admin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Espace Administrateur"
          title="Tableau de bord national"
          description="Données agrégées issues des diagnostics IA et consultations médecin · Temps réel"
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              l: "Diagnostics IA",
              v: stats.kpis.consultationsCount.toLocaleString("fr-FR"),
              d: "+24%",
              up: true,
            },
            {
              l: "Médecins inscrits",
              v: stats.kpis.medecinsCount.toLocaleString("fr-FR"),
              d: "+18%",
              up: true,
            },
            {
              l: "Patients inscrits",
              v: stats.kpis.patientsCount.toLocaleString("fr-FR"),
              d: "+42%",
              up: true,
            },
            {
              l: "Alertes sanitaires",
              v: stats.kpis.alertesCount.toLocaleString("fr-FR"),
              d: stats.kpis.alertesCount > 0 ? "Actives" : "Aucune",
              up: false,
              alert: stats.kpis.alertesCount > 0,
            },
          ].map((k) => (
            <PanelCard key={k.l}>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {k.l}
              </p>
              <p className="mt-3 font-display text-3xl font-bold">{k.v}</p>
              <p
                className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${
                  k.alert
                    ? "text-destructive font-bold animate-pulse"
                    : k.up
                      ? "text-success"
                      : "text-muted-foreground"
                }`}
              >
                {k.alert ? (
                  <AlertTriangle className="size-3 text-destructive" />
                ) : k.up ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {k.d}
              </p>
            </PanelCard>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Pathologies */}
          <PanelCard className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold">Répartition des pathologies</h2>
            <p className="text-xs text-muted-foreground">Pré-diagnostics IA enregistrés</p>
            <div className="mt-6 space-y-4">
              {stats.pathologiesBreakdown.map((p) => (
                <div key={p.n}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{p.n}</span>
                    <span className="text-muted-foreground">{p.v}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${p.v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          {/* Alerts */}
          <PanelCard>
            <h2 className="font-display text-lg font-bold">Alertes sanitaires</h2>
            <div className="mt-4 space-y-3">
              {stats.alertesSanitaires.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Aucune alerte sanitaire active.
                </p>
              ) : (
                stats.alertesSanitaires.map((a) => {
                  const tone =
                    a.statut === "ACTIVE"
                      ? "bg-destructive/15 text-destructive border-destructive/40"
                      : a.statut === "RESOLUE"
                        ? "bg-success/15 text-success border-success/40"
                        : "bg-muted text-muted-foreground border-border";

                  return (
                    <div key={a.id} className={`rounded-xl border p-3 ${tone}`}>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-70 flex justify-between">
                        <span>{a.zone}</span>
                        <span className="font-semibold text-[10px]">{a.statut}</span>
                      </p>
                      <p className="mt-1 font-semibold">{a.pathologie?.nom || "Inconnue"}</p>
                      <p className="text-xs">Variation : +{a.variationPct}% (Seuil : {a.seuil})</p>
                    </div>
                  );
                })
              )}
            </div>
          </PanelCard>
        </div>

        {/* Regional breakdown */}
        <PanelCard className="mt-8">
          <h2 className="font-display text-lg font-bold">Cas par région</h2>
          <p className="text-xs text-muted-foreground">Volume de consultations enregistrées</p>
          <div className="mt-8 flex h-56 items-end gap-3 overflow-x-auto pb-2">
            {stats.regionsCases.map((r) => (
              <div key={r.name} className="flex flex-1 min-w-[60px] flex-col items-center gap-2">
                <span className="text-xs font-bold">{r.cases.toLocaleString("fr-FR")}</span>
                <div
                  className={`w-full rounded-t-lg ${r.color} transition-all duration-500`}
                  style={{ height: `${(r.cases / maxCases) * 100}%` }}
                />
                <span className="text-[11px] font-semibold text-muted-foreground text-center truncate w-full">
                  {r.name}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    r.delta > 0 ? "text-destructive" : "text-success"
                  }`}
                >
                  {r.delta > 0 ? "+" : ""}
                  {r.delta}%
                </span>
              </div>
            ))}
          </div>
        </PanelCard>
      </main>
    </div>
  );
}

export default StatsPage;