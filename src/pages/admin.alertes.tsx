import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import {
  AlertTriangle,
  Plus,
  Loader2,
  CheckCircle,
  Archive,
  Search,
  Filter,
  FlameKindling
} from "lucide-react";
import { adminApi, type AlerteEpidemiologique } from "../types/admin";
import type { Pathologie } from "../types/patient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function AdminAlertesPage() {
  const [alertes, setAlertes] = useState<AlerteEpidemiologique[]>([]);
  const [pathologies, setPathologies] = useState<Pathologie[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("TOUTES");
  const [rechercheZone, setRechercheZone] = useState("");

  // États Modal
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formValues, setFormValues] = useState({
    zone: "Centre",
    pathologieId: "",
    seuil: 50,
    variationPct: 15.0
  });
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [alertesRes, pathologiesRes] = await Promise.all([
        adminApi.getAlertes(),
        adminApi.getPathologies()
      ]);

      if (alertesRes.erreur) {
        setErreur(alertesRes.erreur);
      } else if (pathologiesRes.erreur) {
        setErreur(pathologiesRes.erreur);
      } else {
        setAlertes(alertesRes.data || []);
        const pathList = pathologiesRes.data || [];
        setPathologies(pathList);
        if (pathList.length > 0) {
          setFormValues((v) => ({ ...v, pathologieId: pathList[0].id }));
        }
      }
    } catch (e) {
      setErreur("Une erreur est survenue lors de la communication avec le serveur.");
    } finally {
      setChargement(false);
    }
  }

  function ouvrirModal() {
    setFormValues({
      zone: "Centre",
      pathologieId: pathologies.length > 0 ? pathologies[0].id : "",
      seuil: 50,
      variationPct: 15.0
    });
    setModalOuvert(true);
  }

  async function handleCreerAlerte(e: React.FormEvent) {
    e.preventDefault();
    if (!formValues.zone.trim() || !formValues.pathologieId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSauvegardeEnCours(true);
    try {
      const { data, erreur: err } = await adminApi.creerAlerte(formValues);
      if (err) {
        alert(err);
      } else if (data) {
        setAlertes((prev) => [data, ...prev]);
        setModalOuvert(false);
      }
    } catch (e) {
      alert("Erreur lors du déclenchement de l'alerte.");
    } finally {
      setSauvegardeEnCours(false);
    }
  }

  async function gererStatutAlerte(id: string, statut: "RESOLUE" | "ARCHIVEE") {
    setActionEnCours(id);
    try {
      const { data, erreur: err } = await adminApi.updateAlerteStatut(id, statut);
      if (err) {
        alert(err);
      } else if (data) {
        setAlertes((prev) => prev.map((a) => (a.id === id ? data : a)));
      }
    } catch (e) {
      alert("Erreur de modification du statut.");
    } finally {
      setActionEnCours(null);
    }
  }

  const alertesFiltrées = alertes.filter((a) => {
    const correspondStatut = filtreStatut === "TOUTES" || a.statut === filtreStatut;
    const correspondRecherche =
      a.zone.toLowerCase().includes(rechercheZone.toLowerCase()) ||
      a.pathologie?.nom.toLowerCase().includes(rechercheZone.toLowerCase());
    return correspondStatut && correspondRecherche;
  });

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="admin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Santé Publique"
          title="Alertes Épidémiologiques"
          description="Déclenchez, suivez et résolvez des alertes sanitaires selon les pics de cas observés."
          action={
            <button
              onClick={ouvrirModal}
              disabled={pathologies.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-semibold shadow-card transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              <Plus className="size-4" /> Déclencher une alerte
            </button>
          }
        />

        {/* Barre de recherche et filtre */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filtrer par région ou maladie..."
              value={rechercheZone}
              onChange={(e) => setRechercheZone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground mr-1" />
            {(["TOUTES", "ACTIVE", "RESOLUE", "ARCHIVEE"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFiltreStatut(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filtreStatut === s
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "TOUTES"
                  ? "Toutes"
                  : s === "ACTIVE"
                    ? "Actives"
                    : s === "RESOLUE"
                      ? "Résolues"
                      : "Archivées"}
              </button>
            ))}
          </div>
        </div>

        {chargement ? (
          <div className="py-20 text-center">
            <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Chargement des alertes...</p>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive-foreground">{erreur}</p>
            <button onClick={chargerDonnees} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Réessayer
            </button>
          </div>
        ) : alertesFiltrées.length === 0 ? (
          <PanelCard className="py-16 text-center">
            <AlertTriangle className="size-12 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground">Aucune alerte épidémiologique</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Aucune alerte n'a été déclenchée pour vos critères de recherche actuels.
            </p>
          </PanelCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alertesFiltrées.map((a) => {
              const estActive = a.statut === "ACTIVE";
              const estResolue = a.statut === "RESOLUE";
              const alertStyle =
                a.statut === "ACTIVE"
                  ? "border-destructive bg-destructive/5"
                  : a.statut === "RESOLUE"
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-card";

              return (
                <PanelCard key={a.id} className={`border flex flex-col justify-between ${alertStyle}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Région : {a.zone}
                      </span>
                      <Badge
                        className={
                          a.statut === "ACTIVE"
                            ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
                            : a.statut === "RESOLUE"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {a.statut === "ACTIVE" ? "Active" : a.statut === "RESOLUE" ? "Résolue" : "Archivée"}
                      </Badge>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold text-foreground flex items-center gap-2">
                      <FlameKindling className={`size-5 ${estActive ? "text-destructive" : "text-muted-foreground"}`} />
                      {a.pathologie?.nom || "Pathologie Inconnue"}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      <p>
                        Seuil critique : <strong className="text-foreground">{a.seuil} cas</strong>
                      </p>
                      <p>
                        Hausse constatée : <strong className="text-destructive font-bold">+{a.variationPct}%</strong>
                      </p>
                      <p className="text-xs">
                        Détectée le : {new Date(a.dateDetection).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-4 flex justify-end gap-2">
                    {estActive && (
                      <button
                        disabled={actionEnCours === a.id}
                        onClick={() => gererStatutAlerte(a.id, "RESOLUE")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-success text-success-foreground px-3 py-1.5 text-xs font-semibold shadow-card hover:opacity-90 transition-colors disabled:opacity-50"
                      >
                        {actionEnCours === a.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <CheckCircle className="size-3.5" />
                        )}
                        Résoudre
                      </button>
                    )}

                    {(estActive || estResolue) && (
                      <button
                        disabled={actionEnCours === a.id}
                        onClick={() => gererStatutAlerte(a.id, "ARCHIVEE")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {actionEnCours === a.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Archive className="size-3.5" />
                        )}
                        Archiver
                      </button>
                    )}
                  </div>
                </PanelCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Déclenchement d'Alerte */}
      <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" /> Déclencher une Alerte Épidémiologique
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreerAlerte} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Région touchée *</label>
              <select
                value={formValues.zone}
                onChange={(e) => setFormValues((v) => ({ ...v, zone: e.target.value }))}
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {["Centre", "Littoral", "Ouest", "Nord", "Sud", "Adamaoua", "Est", "Extrême-Nord", "Nord-Ouest", "Sud-Ouest"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Maladie ciblée *</label>
              <select
                value={formValues.pathologieId}
                onChange={(e) => setFormValues((v) => ({ ...v, pathologieId: e.target.value }))}
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {pathologies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Seuil de cas *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formValues.seuil}
                  onChange={(e) => setFormValues((v) => ({ ...v, seuil: parseInt(e.target.value) || 0 }))}
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Variation % *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formValues.variationPct}
                  onChange={(e) => setFormValues((v) => ({ ...v, variationPct: parseFloat(e.target.value) || 0 }))}
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOuvert(false)}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={sauvegardeEnCours}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-semibold shadow-card hover:opacity-90 disabled:opacity-50"
              >
                {sauvegardeEnCours && <Loader2 className="size-4 animate-spin" />}
                Déclencher l'alerte
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminAlertesPage;
