import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { FileText, Filter } from "lucide-react";



const records = [
  { date: "14 Oct 2026", title: "Suspicion paludisme léger", doc: "Dr. Ndongo", type: "Diagnostic IA", status: "Validé", prob: 85 },
  { date: "02 Sept 2026", title: "Infection respiratoire haute", doc: "Dr. Mbarga", type: "Téléconsultation", status: "Terminé", prob: 78 },
  { date: "18 Août 2026", title: "Contrôle tension", doc: "Dr. Etoa", type: "Consultation", status: "Terminé", prob: 100 },
  { date: "05 Juil 2026", title: "Suspicion typhoïde", doc: "Dr. Ndongo", type: "Diagnostic IA", status: "Confirmé", prob: 91 },
  { date: "12 Juin 2026", title: "Gastro-entérite", doc: "Dr. Fouda", type: "Consultation", status: "Terminé", prob: 100 },
];

function HistoriquePage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Dossier médical"
          title="Historique médical complet"
          description="Tous vos diagnostics IA, consultations et téléconsultations en un seul endroit."
          action={
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card hover:bg-surface-soft">
              <Filter className="size-4" /> Filtrer
            </button>
          }
        />

        <PanelCard className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-soft text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Motif</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Praticien</th>
                  <th className="px-6 py-4">Confiance</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((r) => (
                  <tr key={r.title} className="transition-colors hover:bg-surface-soft">
                    <td className="px-6 py-4 font-medium text-muted-foreground">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <FileText className="size-4 text-primary" /> {r.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground italic">{r.type}</td>
                    <td className="px-6 py-4 text-sm">{r.doc}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary" style={{ width: `${r.prob}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{r.prob}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="rounded-md bg-accent px-2 py-1 text-[10px] font-bold text-accent-foreground">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </main>
    </div>
  );
}

export default  HistoriquePage
