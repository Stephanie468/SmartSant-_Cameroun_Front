import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";


const regions = [
  { name: "Centre", cases: 4820, delta: 8, color: "bg-primary" },
  { name: "Littoral", cases: 5210, delta: 12, color: "bg-destructive" },
  { name: "Ouest", cases: 2340, delta: -3, color: "bg-success" },
  { name: "Nord", cases: 3110, delta: 5, color: "bg-warning" },
  { name: "Sud", cases: 1480, delta: -1, color: "bg-secondary" },
  { name: "Adamaoua", cases: 920, delta: 2, color: "bg-primary" },
];

const pathologies = [
  { n: "Paludisme", v: 38 },
  { n: "Infections respiratoires", v: 22 },
  { n: "Typhoïde", v: 14 },
  { n: "Diarrhées aiguës", v: 11 },
  { n: "Dermatoses", v: 8 },
  { n: "Autres", v: 7 },
];

function StatsPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Suivi épidémiologique"
          title="Tableau de bord national"
          description="Données agrégées issues des diagnostics IA et consultations médecin · 30 derniers jours"
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { l: "Diagnostics IA", v: "17 890", d: "+24%", up: true },
            { l: "Consultations", v: "8 412", d: "+18%", up: true },
            { l: "Téléconsultations", v: "3 245", d: "+42%", up: true },
            { l: "Alertes sanitaires", v: "3", d: "-1", up: false, alert: true },
          ].map((k) => (
            <PanelCard key={k.l}>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {k.l}
              </p>
              <p className="mt-3 font-display text-3xl font-bold">{k.v}</p>
              <p
                className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${
                  k.alert
                    ? "text-warning-foreground"
                    : k.up
                      ? "text-success"
                      : "text-destructive"
                }`}
              >
                {k.alert ? (
                  <AlertTriangle className="size-3" />
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
            <p className="text-xs text-muted-foreground">Pré-diagnostics IA principaux</p>
            <div className="mt-6 space-y-4">
              {pathologies.map((p) => (
                <div key={p.n}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{p.n}</span>
                    <span className="text-muted-foreground">{p.v}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${p.v * 2.5}%` }}
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
              {[
                { r: "Littoral", p: "Choléra", lvl: "Vigilance", tone: "bg-warning/20 text-warning-foreground border-warning/40" },
                { r: "Nord", p: "Méningite", lvl: "Surveillance", tone: "bg-accent text-accent-foreground border-accent" },
                { r: "Centre", p: "Paludisme", lvl: "Pic saisonnier", tone: "bg-destructive/15 text-destructive border-destructive/40" },
              ].map((a) => (
                <div key={a.r + a.p} className={`rounded-xl border p-3 ${a.tone}`}>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {a.r}
                  </p>
                  <p className="mt-1 font-semibold">{a.p}</p>
                  <p className="text-xs">{a.lvl}</p>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>

        {/* Regional breakdown */}
        <PanelCard className="mt-8">
          <h2 className="font-display text-lg font-bold">Cas par région</h2>
          <p className="text-xs text-muted-foreground">Évolution sur 30 jours</p>
          <div className="mt-8 flex h-56 items-end gap-3">
            {regions.map((r) => (
              <div key={r.name} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold">{r.cases.toLocaleString("fr")}</span>
                <div
                  className={`w-full rounded-t-lg ${r.color} transition-all`}
                  style={{ height: `${(r.cases / 5500) * 100}%` }}
                />
                <span className="text-[11px] font-semibold text-muted-foreground">{r.name}</span>
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
export default StatsPage