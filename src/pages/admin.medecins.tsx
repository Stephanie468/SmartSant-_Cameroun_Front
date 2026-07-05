import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import {
  Users,
  Check,
  XCircle,
  AlertTriangle,
  Loader2,
  Eye,
  Search,
  Filter,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { adminApi } from "../types/admin";
import type { MedecinInfo } from "../types/patient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function AdminMedecinsPage() {
  const [medecins, setMedecins] = useState<MedecinInfo[]>([]);
  const [filtre, setFiltre] = useState<"TOUS" | "EN_ATTENTE" | "VALIDE" | "SUSPENDU">("TOUS");
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // État pour afficher la carte pro en grand
  const [selectedCardUrl, setSelectedCardUrl] = useState<string | null>(null);
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);

  useEffect(() => {
    chargerMedecins();
  }, []);

  async function chargerMedecins() {
    setChargement(true);
    try {
      const { data, erreur: err } = await adminApi.getMedecins();
      if (err) {
        setErreur(err);
      } else if (data) {
        setMedecins(data);
      }
    } catch (e) {
      setErreur("Une erreur est survenue lors de la récupération des médecins.");
    } finally {
      setChargement(false);
    }
  }

  async function gererStatutMedecin(id: string, statut: "VALIDE" | "SUSPENDU" | "REJETE") {
    setActionEnCours(id);
    try {
      const { erreur: err } = await adminApi.updateMedecinStatut(id, statut);
      if (err) {
        alert(err);
      } else {
        // Mettre à jour l'état local
        setMedecins((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, statutCertification: statut } : m
          )
        );
      }
    } catch (e) {
      alert("Une erreur est survenue.");
    } finally {
      setActionEnCours(null);
    }
  }

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const medecinsFiltrés = medecins.filter((m) => {
    const correspondFiltre =
      filtre === "TOUS" || m.statutCertification === filtre;
    const nomComplet = `${m.utilisateur.prenom} ${m.utilisateur.nom}`.toLowerCase();
    const correspondRecherche =
      nomComplet.includes(recherche.toLowerCase()) ||
      m.specialite.toLowerCase().includes(recherche.toLowerCase()) ||
      m.numeroOrdre.toLowerCase().includes(recherche.toLowerCase());
    return correspondFiltre && correspondRecherche;
  });

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="admin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Modération & Sécurité"
          title="Validation des médecins"
          description="Vérifiez les cartes professionnelles de l'Ordre National des Médecins du Cameroun (ONMC) pour accorder l'accès."
        />

        {/* Barre d'outils (Recherche + Filtres) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, spécialité, ONMC..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="size-4 text-muted-foreground mr-1" />
            {(["TOUS", "EN_ATTENTE", "VALIDE", "SUSPENDU"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filtre === f
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "TOUS"
                  ? "Tous"
                  : f === "EN_ATTENTE"
                    ? "En attente"
                    : f === "VALIDE"
                      ? "Validés"
                      : "Suspendus"}
              </button>
            ))}
          </div>
        </div>

        {chargement ? (
          <div className="py-20 text-center">
            <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Chargement de la liste des médecins...</p>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive-foreground">{erreur}</p>
            <button onClick={chargerMedecins} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Réessayer
            </button>
          </div>
        ) : medecinsFiltrés.length === 0 ? (
          <PanelCard className="py-16 text-center">
            <Users className="size-12 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground">Aucun médecin trouvé</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Aucun médecin ne correspond à votre filtre de recherche actuel.
            </p>
          </PanelCard>
        ) : (
          <PanelCard className="overflow-x-auto p-0 border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Médecin</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">ONMC / Spécialité</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Hôpital / Bio</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Inscription</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Certification</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {medecinsFiltrés.map((m) => {
                  const certifStatus = m.statutCertification;
                  const dateInscription = m.utilisateur.dateCreation
                    ? new Date(m.utilisateur.dateCreation).toLocaleDateString("fr-FR")
                    : "N/A";

                  return (
                    <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {m.utilisateur.nom.substring(0, 1)}{m.utilisateur.prenom.substring(0, 1)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              Dr. {m.utilisateur.prenom} {m.utilisateur.nom}
                            </p>
                            <p className="text-xs text-muted-foreground">{m.utilisateur.telephone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-foreground">{m.specialite}</p>
                        <p className="text-xs font-mono text-muted-foreground">ONMC : {m.numeroOrdre}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        <p className="text-sm text-foreground">{m.formationSanitaire?.nom || "Indépendant"}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.bio}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{dateInscription}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            certifStatus === "VALIDE"
                              ? "bg-success/10 text-success border-success/20"
                              : certifStatus === "EN_ATTENTE"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {certifStatus === "VALIDE"
                            ? "Certifié"
                            : certifStatus === "EN_ATTENTE"
                              ? "À vérifier"
                              : certifStatus === "SUSPENDU"
                                ? "Suspendu"
                                : "Rejeté"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCardUrl(m.carteProfessionnelleUrl)}
                            title="Voir la carte professionnelle"
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                          >
                            <Eye className="size-4" />
                          </button>

                          {certifStatus !== "VALIDE" && (
                            <button
                              disabled={actionEnCours === m.id}
                              onClick={() => gererStatutMedecin(m.id, "VALIDE")}
                              title="Valider l'inscription"
                              className="inline-flex size-9 items-center justify-center rounded-lg bg-success text-success-foreground hover:opacity-90 shadow-card transition-colors disabled:opacity-50"
                            >
                              {actionEnCours === m.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Check className="size-4" />
                              )}
                            </button>
                          )}

                          {certifStatus === "VALIDE" && (
                            <button
                              disabled={actionEnCours === m.id}
                              onClick={() => gererStatutMedecin(m.id, "SUSPENDU")}
                              title="Suspendre le médecin"
                              className="inline-flex size-9 items-center justify-center rounded-lg border border-warning/40 bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50"
                            >
                              {actionEnCours === m.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <XCircle className="size-4" />
                              )}
                            </button>
                          )}

                          {certifStatus === "EN_ATTENTE" && (
                            <button
                              disabled={actionEnCours === m.id}
                              onClick={() => gererStatutMedecin(m.id, "REJETE")}
                              title="Rejeter la candidature"
                              className="inline-flex size-9 items-center justify-center rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 shadow-card transition-colors disabled:opacity-50"
                            >
                              {actionEnCours === m.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <XCircle className="size-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </PanelCard>
        )}
      </main>

      {/* Modal d'affichage de la carte professionnelle */}
      <Dialog open={!!selectedCardUrl} onOpenChange={() => setSelectedCardUrl(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" /> Carte Professionnelle
            </DialogTitle>
          </DialogHeader>
          {selectedCardUrl && (
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center p-2">
              <img
                src={getImageUrl(selectedCardUrl)}
                alt="Carte professionnelle"
                className="max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/eceff1/90a4ae?text=Erreur+de+chargement+de+l%27image";
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminMedecinsPage;
