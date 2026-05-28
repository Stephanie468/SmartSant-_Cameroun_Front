import {  Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard } from "@/components/Card";
import { Users, Activity, Video, Clock, ArrowRight, AlertCircle } from "lucide-react";



function MedecinDashboard() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              Espace professionnel
            </span>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              Bienvenue Dr. Samuel Etoa
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Centre Médical de Bastos · 14 octobre 2026
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card hover:bg-surface-soft">
              Mon planning
            </button>
            <Link
              to="/medecin/teleconsultation"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-card hover:scale-[1.02]"
            >
              <Video className="size-4" /> Démarrer téléconsultation
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Fiches en attente", value: 7, sub: "+3 dans l'heure", tone: "text-destructive", icon: AlertCircle },
            { label: "Téléconsultations", value: 12, sub: "Aujourd'hui", tone: "text-secondary", icon: Video },
            { label: "Patients ce mois", value: 148, sub: "+18% vs mois -1", tone: "text-success", icon: Users },
            { label: "Temps moyen", value: "18 min", sub: "Par consultation", tone: "text-primary", icon: Clock },
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
          {/* Queue */}
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
                {[
                  { name: "Alice Mbah", loc: "Douala", diag: "Paludisme (85%)", urg: "Élevée", tone: "bg-destructive/15 text-destructive" },
                  { name: "Jean-Paul Ekanga", loc: "Yaoundé", diag: "Symptômes grippaux (62%)", urg: "Moyenne", tone: "bg-warning/20 text-warning-foreground" },
                  { name: "Marius Tchoumi", loc: "Bafoussam", diag: "Suspicion typhoïde (74%)", urg: "Élevée", tone: "bg-destructive/15 text-destructive" },
                  { name: "Samuel Ngando", loc: "Douala", diag: "Toux sèche, fatigue (45%)", urg: "Faible", tone: "bg-success/15 text-success" },
                ].map((p) => (
                  <tr key={p.name} className="hover:bg-surface-soft">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                          {p.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">{p.loc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground italic">{p.diag}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${p.tone}`}>
                        {p.urg}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/medecin/patients"
                        className="rounded-lg bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary"
                      >
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PanelCard>

          {/* Today schedule */}
          <PanelCard>
            <h2 className="mb-4 font-display text-lg font-bold">Planning du jour</h2>
            <div className="space-y-3">
              {[
                { t: "09:30", n: "Jean-Paul Ekanga", k: "Présentiel" },
                { t: "10:15", n: "Marie Louise Ngo", k: "Téléconsultation" },
                { t: "11:00", n: "Alice Mbah", k: "Téléconsultation" },
                { t: "14:30", n: "Joseph Onana", k: "Présentiel" },
                { t: "15:15", n: "Fanta Diallo", k: "Téléconsultation" },
              ].map((s) => (
                <div
                  key={s.t}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-soft p-3"
                >
                  <span className="font-display font-bold text-primary">{s.t}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{s.n}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.k}
                    </p>
                  </div>
                  {s.k === "Téléconsultation" && (
                    <Video className="size-4 text-secondary" />
                  )}
                </div>
              ))}
            </div>
          </PanelCard>
        </div>

        {/* Activity snapshot */}
        <PanelCard className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Activité épidémiologique de ma zone</h2>
              <p className="text-xs text-muted-foreground">14 derniers jours · Région Centre</p>
            </div>
            <Activity className="size-5 text-primary" />
          </div>
          <div className="mt-6 flex h-32 items-end gap-2">
            {[40, 55, 48, 62, 70, 65, 78, 82, 75, 88, 92, 85, 95, 90].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-primary/40 to-primary"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </PanelCard>
      </main>
    </div>
  );
}

export default MedecinDashboard