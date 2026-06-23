import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { FileText, Filter, Loader2, AlertCircle } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
import type { ConsultationIA } from "../types/patient";

function HistoriquePage() {
  const { consultations, chargement, erreur } = useConsultations()

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

        {chargement ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="size-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Chargement de votre dossier...</p>
            </div>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-destructive">Impossible de charger l'historique</h3>
            <p className="text-xs text-destructive-foreground mt-1">{erreur}</p>
          </div>
        ) : (
          <PanelCard className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-soft text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Motif / Symptômes</th>
                    <th className="px-6 py-4">Canal</th>
                    <th className="px-6 py-4">Diagnostic IA</th>
                    <th className="px-6 py-4">Confiance</th>
                    <th className="px-6 py-4 text-right">Suivi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {consultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                        Aucune consultation IA ou diagnostic enregistré pour le moment.
                      </td>
                    </tr>
                  ) : (
                    consultations.map((c) => {
                      const pathologiesList = c.pathologies.map(p => p.pathologie.nom).join(', ');
                      const title = pathologiesList ? `Suspicion de ${pathologiesList}` : "Consultation IA";
                      const prob = c.pathologies?.[0]?.probabilite ? Math.round(c.pathologies[0].probabilite * 100) : 75;

                      return (
                        <tr key={c.id} className="transition-colors hover:bg-surface-soft">
                          <td className="px-6 py-4 font-medium text-muted-foreground">
                            {new Date(c.dateConsultation).toLocaleDateString("fr-FR", {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate">
                            <span className="inline-flex items-center gap-2 font-semibold">
                              <FileText className="size-4 text-primary shrink-0" /> 
                              <span className="truncate" title={c.symptomes}>{c.symptomes}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-muted-foreground italic">
                            WhatsApp
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {title}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                <div className="h-full bg-primary" style={{ width: `${prob}%` }} />
                              </div>
                              <span className="text-xs font-semibold">{prob}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                              c.suiviEffectue 
                                ? "bg-success/15 text-success-foreground" 
                                : "bg-warning/20 text-warning-foreground"
                            }`}>
                              {c.suiviEffectue ? "Terminé" : "En attente"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </PanelCard>
        )}
      </main>
    </div>
  );
}

export default HistoriquePage;
