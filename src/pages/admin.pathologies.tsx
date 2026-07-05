import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import {
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Search,
  BookOpen
} from "lucide-react";
import { adminApi } from "../types/admin";
import type { Pathologie } from "../types/patient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function AdminPathologiesPage() {
  const [pathologies, setPathologies] = useState<Pathologie[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");

  // États Modal
  const [modalOuvert, setModalOuvert] = useState(false);
  const [editionId, setEditionId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Omit<Pathologie, "id">>({
    nom: "",
    code: "",
    categorie: "Infectieuse",
    description: ""
  });
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

  useEffect(() => {
    chargerPathologies();
  }, []);

  async function chargerPathologies() {
    setChargement(true);
    try {
      const { data, erreur: err } = await adminApi.getPathologies();
      if (err) {
        setErreur(err);
      } else if (data) {
        setPathologies(data);
      }
    } catch (e) {
      setErreur("Une erreur est survenue lors de la récupération des pathologies.");
    } finally {
      setChargement(false);
    }
  }

  function ouvrirNouveauModal() {
    setEditionId(null);
    setFormValues({
      nom: "",
      code: "",
      categorie: "Infectieuse",
      description: ""
    });
    setModalOuvert(true);
  }

  function ouvrirModifierModal(patho: Pathologie) {
    setEditionId(patho.id);
    setFormValues({
      nom: patho.nom,
      code: patho.code,
      categorie: patho.categorie,
      description: patho.description || ""
    });
    setModalOuvert(true);
  }

  async function handleSoumettreForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formValues.nom.trim() || !formValues.code.trim() || !formValues.categorie.trim()) {
      alert("Veuillez remplir les champs obligatoires (Nom, Code, Catégorie)");
      return;
    }

    setSauvegardeEnCours(true);
    try {
      if (editionId) {
        const { data, erreur: err } = await adminApi.modifierPathologie(editionId, formValues);
        if (err) {
          alert(err);
        } else if (data) {
          setPathologies((prev) => prev.map((p) => (p.id === editionId ? data : p)));
          setModalOuvert(false);
        }
      } else {
        const { data, erreur: err } = await adminApi.creerPathologie(formValues);
        if (err) {
          alert(err);
        } else if (data) {
          setPathologies((prev) => [...prev, data]);
          setModalOuvert(false);
        }
      }
    } catch (e) {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSauvegardeEnCours(false);
    }
  }

  async function handleSupprimer(id: string, nom: string) {
    if (!confirm(`Voulez-vous vraiment supprimer la pathologie "${nom}" ? Cela impactera les liaisons existantes.`)) return;

    try {
      const { erreur: err } = await adminApi.deletePathologie(id);
      if (err) {
        alert(err);
      } else {
        setPathologies((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Erreur lors de la suppression.");
    }
  }

  const pathologiesFiltrées = pathologies.filter((p) => {
    return (
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.code.toLowerCase().includes(recherche.toLowerCase()) ||
      p.categorie.toLowerCase().includes(recherche.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="admin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Référentiel Médical"
          title="Pathologies Cibles"
          description="Gérez la liste des pathologies reconnues et triées par le chatbot d'intelligence artificielle."
          action={
            <button
              onClick={ouvrirNouveauModal}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
            >
              <Plus className="size-4" /> Nouvelle pathologie
            </button>
          }
        />

        {/* Barre de recherche */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, code, catégorie..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {chargement ? (
          <div className="py-20 text-center">
            <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Chargement des pathologies...</p>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive-foreground">{erreur}</p>
            <button onClick={chargerPathologies} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Réessayer
            </button>
          </div>
        ) : pathologiesFiltrées.length === 0 ? (
          <PanelCard className="py-16 text-center">
            <ClipboardList className="size-12 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground">Aucune pathologie</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Aucune pathologie ne correspond à vos critères de recherche.
            </p>
          </PanelCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pathologiesFiltrées.map((p) => (
              <PanelCard key={p.id} className="flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex rounded-lg bg-secondary/10 px-2.5 py-1 text-xs font-mono font-bold text-secondary">
                      {p.code}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => ouvrirModifierModal(p)}
                        className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleSupprimer(p.id, p.nom)}
                        className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-foreground">{p.nom}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">Catégorie : {p.categorie}</p>
                  <p className="mt-2.5 text-sm text-muted-foreground line-clamp-3">{p.description || "Aucune description fournie."}</p>
                </div>
                <div className="mt-5 border-t border-border pt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="size-3.5" strokeWidth={2.5} /> Référentiel IA actif
                </div>
              </PanelCard>
            ))}
          </div>
        )}
      </main>

      {/* Modal Ajout/Modification */}
      <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editionId ? "Modifier la pathologie" : "Créer une pathologie"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSoumettreForm} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Nom de la maladie *</label>
              <input
                type="text"
                required
                value={formValues.nom}
                onChange={(e) => setFormValues((v) => ({ ...v, nom: e.target.value }))}
                placeholder="Paludisme simple"
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Code Unique *</label>
                <input
                  type="text"
                  required
                  disabled={!!editionId} // Code non modifiable en édition pour préserver l'IA
                  value={formValues.code}
                  onChange={(e) => setFormValues((v) => ({ ...v, code: e.target.value }))}
                  placeholder="PALU"
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm uppercase font-mono focus:outline-none focus:border-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Catégorie *</label>
                <input
                  type="text"
                  required
                  value={formValues.categorie}
                  onChange={(e) => setFormValues((v) => ({ ...v, categorie: e.target.value }))}
                  placeholder="Infectieuse"
                  className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Description médicale</label>
              <textarea
                rows={4}
                value={formValues.description || ""}
                onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))}
                placeholder="Description des symptômes principaux, modes de transmission..."
                className="mt-1.5 w-full bg-card rounded-xl border border-input px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
              />
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

export default AdminPathologiesPage;
