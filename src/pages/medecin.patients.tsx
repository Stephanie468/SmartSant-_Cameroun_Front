import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { FileText, Video, CheckCircle2, FlaskConical, MessageSquare } from "lucide-react";



function PatientsPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Fiches patients"
          title="Fiche patient #8821 — Alice Mbah"
          description="Analyse IA générée via le chatbot WhatsApp · 14/10/2026 à 10:22"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Queue side */}
          <PanelCard className="p-0">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                File d'attente · 7
              </h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { n: "Alice Mbah", d: "Paludisme · 85%", t: "il y a 12 min", a: true },
                { n: "Marius Tchoumi", d: "Typhoïde · 74%", t: "il y a 25 min" },
                { n: "Jean-Paul Ekanga", d: "Grippe · 62%", t: "il y a 47 min" },
                { n: "Samuel Ngando", d: "Toux · 45%", t: "il y a 1h" },
                { n: "Fanta Diallo", d: "Dermatose · 58%", t: "il y a 2h" },
              ].map((p) => (
                <button
                  key={p.n}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-soft ${
                    p.a ? "bg-accent/40" : ""
                  }`}
                >
                  <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {p.n.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{p.n}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.d}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{p.t}</p>
                </button>
              ))}
            </div>
          </PanelCard>

          {/* Patient detail */}
          <div className="space-y-6">
            <PanelCard>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                    AM
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Alice Mbah</h3>
                    <p className="text-xs text-muted-foreground">
                      32 ans · Femme · Douala · Tél. +237 6XX XXX XXX
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-surface-soft">
                    <MessageSquare className="size-4" /> WhatsApp
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground shadow-card">
                    <Video className="size-4" /> Téléconsulter
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Symptômes déclarés
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    <li>• Température : 39,2°C depuis 48h</li>
                    <li>• Frissons nocturnes</li>
                    <li>• Douleurs articulaires</li>
                    <li>• Céphalées intenses</li>
                    <li>• Pas de récente prise de prophylaxie</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-accent bg-accent/30 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                    Pré-diagnostic IA suggéré
                  </p>
                  <p className="mt-2 font-display text-xl font-bold">Paludisme simple</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confiance : <span className="font-bold text-primary">85%</span> · basé sur 2 340
                    cas similaires (Littoral)
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Diagnostics secondaires : Typhoïde (12%), Dengue (5%)
                  </p>
                </div>
              </div>
            </PanelCard>

            <PanelCard>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Décision du praticien
              </h4>
              <textarea
                className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                placeholder="Notes cliniques, conclusions, recommandations…"
                defaultValue="Tableau clinique cohérent avec un paludisme simple. TDR recommandé avant traitement présomptif."
              />
              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-3 text-sm font-bold text-success-foreground shadow-card">
                  <CheckCircle2 className="size-4" /> Valider & prescrire
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-surface-soft">
                  <FlaskConical className="size-4" /> Demander examens
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-surface-soft">
                  <FileText className="size-4" /> Reporter
                </button>
              </div>
            </PanelCard>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientsPage