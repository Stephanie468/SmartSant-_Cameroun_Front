import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { FileText, Video, CheckCircle2, FlaskConical, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import { useMedecinPatients, useMedecinPrescription } from "../hooks/useMedecin";

/**
 * Composant de la page Patients - Gestion des Fiches Cliniques de Triage IA.
 * Permet aux médecins de voir les fiches orientées par l'IA et de prendre une décision médicale (prescription).
 */
function PatientsPage() {
  const location = useLocation();
  
  // Utilisation des hooks personnalisés pour interagir avec le backend
  const { consultations, chargement, erreur, rafraichir } = useMedecinPatients();
  const { prescrire, soumission, erreur: erreurPrescrire } = useMedecinPrescription();

  // États locaux de sélection et de saisie
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesCliniques, setNotesCliniques] = useState("");

  // Synchronisation de la sélection avec le state de navigation ou par défaut
  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    } else if (consultations.length > 0 && !selectedId) {
      setSelectedId(consultations[0].id);
    }
  }, [consultations, location.state]);

  // Consultation IA active
  const selectedConsultation = consultations.find((c) => c.id === selectedId) || consultations[0];

  // Soumission de la décision médicale (prescription / ordonnance)
  async function handleValiderPrescrire() {
    if (!selectedConsultation) return;
    if (!notesCliniques.trim()) {
      alert("Veuillez saisir vos conclusions et prescriptions avant de valider.");
      return;
    }

    const succes = await prescrire({
      consultationId: selectedConsultation.id,
      patientId: selectedConsultation.patientId,
      contenu: notesCliniques,
    });

    if (succes) {
      alert("Prescription enregistrée et envoyée au patient par SMS/WhatsApp.");
      setNotesCliniques("");
      await rafraichir();
      
      // Sélection automatique de la prochaine fiche
      if (consultations.length > 1) {
        const index = consultations.findIndex((c) => c.id === selectedConsultation.id);
        const nextIndex = index === consultations.length - 1 ? 0 : index + 1;
        setSelectedId(consultations[nextIndex].id);
      } else {
        setSelectedId(null);
      }
    }
  }

  // Remplissage automatique de suggestions cliniques
  function handleExamensSuggere() {
    setNotesCliniques((prev) => 
      prev ? prev + "\n- Examens recommandés : TDR Paludisme et NFS." : "- Examens recommandés : TDR Paludisme et NFS."
    );
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-background md:pl-64 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-semibold">Chargement des fiches patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background md:pl-64">
      {/* Sidebar de navigation */}
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Fiches patients"
          title={selectedConsultation 
            ? `Fiche patient — ${selectedConsultation.patient.utilisateur.prenom} ${selectedConsultation.patient.utilisateur.nom}` 
            : "Aucune fiche patient en attente"
          }
          description={selectedConsultation 
            ? `Analyse IA générée via WhatsApp le ${new Date(selectedConsultation.dateConsultation).toLocaleDateString('fr-FR')} à ${new Date(selectedConsultation.dateConsultation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
            : "Toutes les fiches cliniques entrantes de votre secteur ont été validées."
          }
        />

        {erreur && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center mb-6">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive-foreground">{erreur}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* File d'attente à gauche */}
          <PanelCard className="p-0">
            <div className="border-b border-border px-4 py-3 bg-surface-soft">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                File d'attente · {consultations.length}
              </h3>
            </div>
            <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
              {consultations.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  File d'attente vide.
                </div>
              ) : (
                consultations.map((p) => {
                  const estSelectionne = selectedConsultation?.id === p.id;
                  const scorePct = p.scoreConfiance ? Math.round(p.scoreConfiance * 100) : 85;

                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedId(p.id);
                        setNotesCliniques("");
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-soft ${
                        estSelectionne ? "bg-accent/40 border-l-4 border-primary" : ""
                      }`}
                    >
                      <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                        {p.patient.utilisateur.nom[0]}{p.patient.utilisateur.prenom[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {p.patient.utilisateur.prenom} {p.patient.utilisateur.nom}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {p.preDiagnostic} · {scorePct}%
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(p.dateConsultation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </PanelCard>

          {/* Détails du patient et de la consultation IA active */}
          {selectedConsultation ? (
            <div className="space-y-6">
              <PanelCard>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-4">
                    <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                      {selectedConsultation.patient.utilisateur.nom[0]}{selectedConsultation.patient.utilisateur.prenom[0]}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">
                        {selectedConsultation.patient.utilisateur.prenom} {selectedConsultation.patient.utilisateur.nom}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConsultation.patient.ville || "Yaoundé"} · Tél. {selectedConsultation.patient.utilisateur.telephone}
                      </p>
                      {selectedConsultation.patient.allergies && (
                        <p className="text-xs text-destructive font-semibold mt-1">
                          Allergies : {selectedConsultation.patient.allergies}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${selectedConsultation.patient.utilisateur.telephone.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-surface-soft"
                    >
                      <MessageSquare className="size-4" /> WhatsApp
                    </a>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground shadow-card hover:opacity-90">
                      <Video className="size-4" /> Téléconsulter
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Symptômes déclarés
                    </p>
                    <div className="mt-3 p-4 rounded-xl bg-surface-soft border border-border text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                      {selectedConsultation.symptomes}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-accent bg-accent/30 p-5 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                        Pré-diagnostic IA suggéré
                      </p>
                      <p className="mt-2 font-display text-xl font-bold text-primary">
                        {selectedConsultation.preDiagnostic}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Confiance : <span className="font-bold text-primary">{Math.round((selectedConsultation.scoreConfiance || 0.85) * 100)}%</span>
                      </p>
                    </div>
                    {selectedConsultation.pathologies.length > 1 && (
                      <p className="mt-3 text-xs text-muted-foreground italic border-t border-accent/25 pt-2">
                        Diagnostics secondaires : {selectedConsultation.pathologies.slice(1).map((p) => `${p.pathologie.nom} (${Math.round((p.probabilite || 0.1) * 100)}%)`).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </PanelCard>

              {/* Bloc de décision du praticien */}
              <PanelCard>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Décision du praticien
                </h4>
                {erreurPrescrire && (
                  <p className="text-xs text-destructive mb-2">{erreurPrescrire}</p>
                )}
                <textarea
                  value={notesCliniques}
                  onChange={(e) => setNotesCliniques(e.target.value)}
                  className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Notes cliniques, diagnostic validé, ordonnance de médicaments, posologie..."
                />
                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                  <button
                    onClick={handleValiderPrescrire}
                    disabled={soumission}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-3 text-sm font-bold text-success-foreground shadow-card hover:opacity-90 disabled:opacity-50"
                  >
                    {soumission ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    Valider & prescrire
                  </button>
                  <button
                    onClick={handleExamensSuggere}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-surface-soft"
                  >
                    <FlaskConical className="size-4 text-primary" /> Demander examens
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-surface-soft">
                    <FileText className="size-4 text-muted-foreground" /> Reporter
                  </button>
                </div>
              </PanelCard>
            </div>
          ) : (
            <div className="py-20 text-center">
              <CheckCircle2 className="size-12 text-success mx-auto mb-4 animate-bounce" />
              <h3 className="font-display text-lg font-bold text-foreground">Tout est validé !</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Aucune fiche de consultation IA n'est en attente de traitement actuellement.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PatientsPage;