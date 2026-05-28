import {  Link } from "react-router-dom";
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
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard } from "@/components/Card";
import mapDouala from "@/assets/map-douala.png";



function PatientDashboard() {
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
              Bonjour, Jean-Paul Ekanga
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Dernière consultation IA il y a 3 jours · Yaoundé, Centre
            </p>
          </div>
          <a
            href="https://wa.me/237600000000"
            className="hidden items-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02] md:inline-flex"
          >
            <MessageCircle className="size-4" /> Nouveau diagnostic IA
          </a>
        </div>

        {/* Vitals row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Thermometer, label: "Température", value: "37.2°C", tone: "text-success" },
            { icon: HeartPulse, label: "Rythme card.", value: "72 bpm", tone: "text-primary" },
            { icon: Activity, label: "Tension", value: "12/8", tone: "text-secondary" },
            { icon: TrendingUp, label: "Glycémie", value: "0.95 g/L", tone: "text-warning" },
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
              {[
                {
                  id: "882",
                  title: "Suspicion de paludisme léger",
                  doctor: "Dr. Ndongo · 14 Oct 2026",
                  prob: 85,
                  status: "TERMINÉ",
                  tone: "bg-accent text-accent-foreground",
                },
                {
                  id: "881",
                  title: "Analyse symptômes — maux de tête & fièvre",
                  doctor: "Aujourd'hui, 09:12",
                  prob: 62,
                  status: "EN ATTENTE",
                  tone: "bg-warning/20 text-warning-foreground",
                },
                {
                  id: "874",
                  title: "Infection respiratoire haute",
                  doctor: "Dr. Mbarga · 02 Sept 2026",
                  prob: 40,
                  status: "TERMINÉ",
                  tone: "bg-accent text-accent-foreground",
                },
              ].map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-border bg-surface-soft p-4 transition-all hover:bg-card hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">Pré-diagnostic #{d.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{d.title}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">{d.doctor}</p>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${d.tone}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${d.prob}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {d.prob}% confiance
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          {/* Next appointment */}
          <PanelCard className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Prochain rendez-vous
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold">Dr. Samuel Etoa</h3>
            <p className="text-sm text-white/80">Généraliste · Centre Médical de Bastos</p>
            <div className="mt-6 flex items-center gap-2 text-base font-semibold">
              <Calendar className="size-5" /> Demain, 09:30
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Link
                to="/rendez-vous"
                className="rounded-xl bg-white/15 px-3 py-2 text-center text-xs font-semibold backdrop-blur transition-colors hover:bg-white/25"
              >
                Replanifier
              </Link>
              <button className="rounded-xl bg-white px-3 py-2 text-center text-xs font-semibold text-primary shadow-card">
                Itinéraire
              </button>
            </div>
          </PanelCard>
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
                    <th className="px-4 py-3 text-right">Reste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "Artesun 60 mg", dose: "1 cp × 2/j", dur: "7 jours", left: "5j" },
                    { name: "Paracétamol 500 mg", dose: "1 cp × 3/j", dur: "5 jours", left: "2j" },
                    { name: "Doxycycline 100 mg", dose: "1 cp × 1/j", dur: "10 jours", left: "8j" },
                  ].map((p) => (
                    <tr key={p.name} className="hover:bg-surface-soft">
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
                  ))}
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
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-card/95 p-3 backdrop-blur">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-bold">Hôpital Laquintinie</p>
                    <p className="text-[11px] text-muted-foreground">1.2 km · Ouvert 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </PanelCard>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard