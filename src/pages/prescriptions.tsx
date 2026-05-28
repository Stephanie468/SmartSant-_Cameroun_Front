import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Pill, Download, Calendar } from "lucide-react";



const ordonnances = [
  {
    id: "ORD-2026-0142",
    date: "14 Oct 2026",
    doc: "Dr. Ndongo",
    diag: "Paludisme simple",
    active: true,
    meds: [
      { n: "Artesun 60 mg", d: "1 cp × 2/j", dur: "7 jours", left: 5 },
      { n: "Paracétamol 500 mg", d: "1 cp × 3/j", dur: "5 jours", left: 2 },
    ],
  },
  {
    id: "ORD-2026-0119",
    date: "02 Sept 2026",
    doc: "Dr. Mbarga",
    diag: "Infection respiratoire",
    active: false,
    meds: [
      { n: "Amoxicilline 1 g", d: "1 cp × 2/j", dur: "7 jours", left: 0 },
      { n: "Sirop expectorant", d: "10 ml × 3/j", dur: "5 jours", left: 0 },
    ],
  },
];

function PrescriptionsPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Suivi thérapeutique"
          title="Mes prescriptions"
          description="Toutes vos ordonnances numériques avec le suivi de prise et les rappels."
        />

        <div className="grid grid-cols-1 gap-6">
          {ordonnances.map((o) => (
            <PanelCard key={o.id}>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-bold">{o.diag}</h3>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        o.active
                          ? "bg-success/15 text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {o.active ? "EN COURS" : "TERMINÉ"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.id} · prescrit par {o.doc} ·{" "}
                    <Calendar className="inline size-3" /> {o.date}
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-surface-soft">
                  <Download className="size-4" /> Télécharger
                </button>
              </div>

              <div className="space-y-3">
                {o.meds.map((m) => (
                  <div
                    key={m.n}
                    className="flex flex-wrap items-center gap-4 rounded-xl bg-surface-soft p-4"
                  >
                    <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Pill className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{m.n}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.d} pendant {m.dur}
                      </p>
                    </div>
                    {o.active && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Reste</p>
                        <p className="font-display text-lg font-bold text-primary">
                          {m.left}j
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </PanelCard>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PrescriptionsPage