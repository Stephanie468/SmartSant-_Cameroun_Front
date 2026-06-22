import { useState, useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Pill, Download, Calendar, Loader2, AlertCircle } from "lucide-react";
import { patientApi } from "../api";
import type { Ordonnance } from "../types/patient";

// Helper pour parser le contenu formaté de l'ordonnance
function parseContenuOrdonnance(contenu: string) {
  return contenu.split('\n').filter(Boolean).map(line => {
    const parts = line.split('|');
    if (parts.length >= 3) {
      return {
        name: parts[0].trim(),
        dose: parts[1].trim(),
        dur: parts[2].trim(),
        left: parts[3] ? parseInt(parts[3].trim().replace(/\D/g, '')) || 0 : 3
      };
    } else {
      return {
        name: line.trim(),
        dose: "-",
        dur: "-",
        left: 0
      };
    }
  });
}

function PrescriptionsPage() {
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    async function chargerOrdonnances() {
      try {
        const { data, erreur: err } = await patientApi.getOrdonnances();
        if (err) {
          setErreur(err);
        } else if (data) {
          setOrdonnances(data);
        }
      } catch (e) {
        setErreur("Erreur lors du chargement de vos prescriptions.");
      } finally {
        setChargement(false);
      }
    }
    chargerOrdonnances();
  }, []);

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Suivi thérapeutique"
          title="Mes prescriptions"
          description="Toutes vos ordonnances numériques avec le suivi de prise et les rappels."
        />

        {chargement ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="size-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Chargement des ordonnances...</p>
            </div>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-destructive">Une erreur est survenue</h3>
            <p className="text-xs text-destructive-foreground mt-1">{erreur}</p>
          </div>
        ) : ordonnances.length === 0 ? (
          <PanelCard className="text-center p-10 border border-dashed border-border">
            <Pill className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-base font-bold">Aucune ordonnance</h3>
            <p className="text-xs text-muted-foreground mt-1">Vous n'avez pas encore d'ordonnance prescrite par nos médecins.</p>
          </PanelCard>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {ordonnances.map((o) => {
              const meds = parseContenuOrdonnance(o.contenu);
              // L'ordonnance est considérée active si elle a moins de 7 jours
              const dateEmission = new Date(o.dateEmission);
              const diffTemps = Math.abs(new Date().getTime() - dateEmission.getTime());
              const diffJours = Math.ceil(diffTemps / (1000 * 60 * 60 * 24));
              const active = diffJours <= 7;

              return (
                <PanelCard key={o.id}>
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-lg font-bold">Ordonnance médicale</h3>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            active
                              ? "bg-success/15 text-success-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {active ? "EN COURS" : "EXPIRE"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Réf : {o.id.toUpperCase().slice(0, 8)} · prescrit par Dr. {o.medecin.utilisateur.nom} {o.medecin.utilisateur.prenom} ·{" "}
                        <Calendar className="inline size-3" /> {dateEmission.toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    {o.cheminFichier && (
                      <a
                        href={o.cheminFichier}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-surface-soft"
                      >
                        <Download className="size-4" /> Télécharger PDF
                      </a>
                    )}
                  </div>

                  <div className="space-y-3">
                    {meds.map((m, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center gap-4 rounded-xl bg-surface-soft p-4"
                      >
                        <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Pill className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.dose} pendant {m.dur}
                          </p>
                        </div>
                        {active && m.left > 0 && (
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
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default PrescriptionsPage;