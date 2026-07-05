import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Search,
  Filter,
  X
} from "lucide-react";
import { adminApi } from "../types/admin";
import type { FormationSanitaire } from "../types/patient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function AdminStructuresPage() {
  const [structures, setStructures] = useState<FormationSanitaire[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState<string>("TOUT");

  // États Modal
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Omit<FormationSanitaire, "id">>({
    nom: "",
    type: "HOPITAL",
    adresse: "",
    region: "Centre",
    ville: "",
    latitude: 3.86,
    longitude: 11.52,
    telephone: "",
    horaires: "24h/24, 7j/7"
  });
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

  useEffect(() => {
    chargerStructures();
  }, []);

  async function chargerStructures() {
    setChargement(true);
    try {
      const { data, erreur: err } = await adminApi.getStructures();
      if (err) {
        setErreur(err);
      } else if (data) {
        setStructures(data);
      }
    } catch (e) {
      setErreur("Une erreur est survenue lors du chargement des structures.");
    } finally {
      setChargement(false);
    }
  }

  function ouvrirNouveauModal() {
    setEditionId(null);
    setFormValues({
      nom: "",
      type: "HOPITAL",
      adresse: "",
      region: "Centre",
      ville: "",
      latitude: 3.86,
      longitude: 11.52,
      telephone: "",
      horaires: "24h/24, 7j/7"
    });
    setModalOuvert(true);
  }

  function ouvrirModifierModal(struct: FormationSanitaire) {
    setEditionId(struct.id);
    setFormValues({
      nom: struct.nom,
      type: struct.type,
      adresse: struct.adresse,
      region: struct.region,
      ville: struct.ville,
      latitude: struct.latitude,
      longitude: struct.longitude,
      telephone: struct.telephone || "",
      horaires: struct.horaires || ""
    });
    setModalOuvert(true);
  }

  async function handleSoumettreForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formValues.nom.trim() || !formValues.adresse.trim() || !formValues.ville.trim()) {
      alert("Veuillez remplir les champs obligatoires (Nom, Ville, Adresse)");
      return;
    }

    setSauvegardeEnCours(true);
    try {
      if (editionId) {
        // Mode édition
        const { data, erreur: err } = await adminApi.modifierStructure(editionId, formValues);
        if (err) {
          alert(err);
        } else if (data) {
          setStructures((prev) => prev.map((s) => (s.id === editionId ? data : s)));
          setModalOuvert(false);
        }
      } else {
        // Mode création
        const { data, erreur: err } = await adminApi.creerStructure(formValues);
        if (err) {
          alert(err);
        } else if (data) {
          setStructures((prev) => [...prev, data]);
          setModalOuvert(false);
        }
      }
    } catch (e) {
      alert("Erreur de sauvegarde.");
    } finally {
      setSauvegardeEnCours(false);
    }
  }

  async function handleSupprimer(id: string, nom: string) {
    if (!confirm(`Voulez-vous vraiment supprimer la structure "${nom}" ?`)) return;

    try {
      const { erreur: err } = await adminApi.deleteStructure(id);
      if (err) {
        alert(err);
      } else {
        setStructures((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Erreur lors de la suppression.");
    }
  }

  const structuresFiltrées = structures.filter((s) => {
    const correspondType = filtreType === "TOUT" || s.type === filtreType;
    const correspondRecherche =
      s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      s.ville.toLowerCase().includes(recherche.toLowerCase()) ||
      s.adresse.toLowerCase().includes(recherche.toLowerCase());
    return correspondType && correspondRecherche;
  });

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="admin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Gestion Référentiels"
          title="Structures Sanitaires"
          description="Gérez les hôpitaux, centres de santé, pharmacies et cliniques d'orientation post-triage."
          action={
            <button
              onClick={ouvrirNouveauModal}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
            >
              <Plus className="size-4" /> Ajouter une structure
            </button>
          }
        />

        {/* Recherche et filtres */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville, adresse..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground mr-1" />
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="rounded-xl border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="TOUT">Tous les types</option>
              <option value="HOPITAL">Hôpital</option>
              <option value="CENTRE_SANTE">Centre de santé</option>
              <option value="PHARMACIE">Pharmacie</option>
              <option value="CLINIQUE">Clinique</option>
            </select>
          </div>
        </div>

        {chargement ? (
          <div className="py-20 text-center">
            <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Chargement des structures sanitaires...</p>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive-foreground">{erreur}</p>
            <button onClick={chargerStructures} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Réessayer
            </button>
          </div>
        ) : structuresFiltrées.length === 0 ? (
          <PanelCard className="py-16 text-center">
            <MapPin className="size-12 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground">Aucune structure sanitaire</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Il n'y a actuellement aucune structure correspondant à votre recherche.
            </p>
          </PanelCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {structuresFiltrées.map((s) => (
              <PanelCard key={s.id} className="relative flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary uppercase">
                      {s.type.replace("_", " ")}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => ouvrirModifierModal(s)}
                        className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleSupprimer(s.id, s.nom)}
                        className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-foreground line-clamp-1">{s.nom}</h3>
                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3.5" /> {s.adresse}, {s.ville} ({s.region})
                  </p>
                  {s.telephone && <p className="mt-1 text-xs text-muted-foreground">Tél : {s.telephone}</p>}
                </div>
                <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Coordonnées : {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}</span>
                  <span>{s.horaires}</span>
                </div>
              </PanelCard>
            ))}
          </div>
        )}
      </main>

      {/* Modal Ajout/Modification */}
      <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editionId ? "Modifier la structure" : "Ajouter une structure sanitaire"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSoumettreForm} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Nom officiel *</label>
              <input
                type="text"
                required
                value={formValues.nom}
                onChange={(e) => setFormValues((v) => ({ ...v, nom: e.target.value }))}
                placeholder="Hôpital Central de Yaoundé"
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Type *</label>
                <select
                  value={formValues.type}
                  onChange={(e) => setFormValues((v) => ({ ...v, type: e.target.value as any }))}
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="HOPITAL">Hôpital</option>
                  <option value="CENTRE_SANTE">Centre de santé</option>
                  <option value="PHARMACIE">Pharmacie</option>
                  <option value="CLINIQUE">Clinique</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Région *</label>
                <select
                  value={formValues.region}
                  onChange={(e) => setFormValues((v) => ({ ...v, region: e.target.value }))}
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  {["Centre", "Littoral", "Ouest", "Nord", "Sud", "Adamaoua", "Est", "Extrême-Nord", "Nord-Ouest", "Sud-Ouest"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Ville *</label>
                <input
                  type="text"
                  required
                  value={formValues.ville}
                  onChange={(e) => setFormValues((v) => ({ ...v, ville: e.target.value }))}
                  placeholder="Yaoundé"
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Adresse *</label>
                <input
                  type="text"
                  required
                  value={formValues.adresse}
                  onChange={(e) => setFormValues((v) => ({ ...v, adresse: e.target.value }))}
                  placeholder="Messa, Avenue Mvolyé"
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formValues.latitude}
                  onChange={(e) => setFormValues((v) => ({ ...v, latitude: parseFloat(e.target.value) || 0 }))}
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formValues.longitude}
                  onChange={(e) => setFormValues((v) => ({ ...v, longitude: parseFloat(e.target.value) || 0 }))}
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Téléphone</label>
                <input
                  type="tel"
                  value={formValues.telephone || ""}
                  onChange={(e) => setFormValues((v) => ({ ...v, telephone: e.target.value }))}
                  placeholder="+237 222 333 444"
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Horaires</label>
                <input
                  type="text"
                  value={formValues.horaires || ""}
                  onChange={(e) => setFormValues((v) => ({ ...v, horaires: e.target.value }))}
                  placeholder="24h/24, 7j/7"
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
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90 disabled:opacity-50"
              >
                {sauvegardeEnCours && <Loader2 className="size-4 animate-spin" />}
                {editionId ? "Sauvegarder" : "Créer"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminStructuresPage;
