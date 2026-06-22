import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { MapPin, Phone, Clock, Search, Loader2, AlertCircle } from "lucide-react";
import mapDouala from "@/assets/map-douala.png";
import { useState, useEffect } from "react";
import { patientApi } from "../api";
import type { FormationSanitaire } from "../types/patient";

function CentresPage() {
  const [structures, setStructures] = useState<FormationSanitaire[]>([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function chargerStructures() {
      try {
        const { data, erreur: err } = await patientApi.getStructures();
        if (err) {
          setErreur(err);
        } else if (data) {
          setStructures(data);
        }
      } catch (e) {
        setErreur("Erreur lors du chargement des formations sanitaires.");
      } finally {
        setChargement(false);
      }
    }
    chargerStructures();
  }, []);

  const structuresFiltrees = structures.filter(s => {
    const term = recherche.toLowerCase();
    return (
      s.nom.toLowerCase().includes(term) ||
      s.ville.toLowerCase().includes(term) ||
      s.region.toLowerCase().includes(term) ||
      s.type.toLowerCase().includes(term) ||
      (s.adresse && s.adresse.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Géolocalisation"
          title="Formations sanitaires à proximité"
          description="Trouvez la structure de soin la plus proche, ouverte et adaptée à votre besoin."
        />

        {chargement ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="size-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Chargement des structures de santé...</p>
            </div>
          </div>
        ) : erreur ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-destructive">Une erreur est survenue</h3>
            <p className="text-xs text-destructive-foreground mt-1">{erreur}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Map */}
            <PanelCard className="overflow-hidden p-0">
              <img
                src={mapDouala}
                alt="Carte des centres de santé"
                loading="lazy"
                width={800}
                height={800}
                className="aspect-square w-full object-cover"
              />
            </PanelCard>

            {/* List */}
            <div>
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-card">
                <Search className="size-4 text-muted-foreground" />
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Rechercher un centre, une ville, une région..."
                  value={recherche}
                  onChange={e => setRecherche(e.target.value)}
                />
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {structuresFiltrees.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10 bg-card rounded-xl border border-border">
                    Aucun établissement ne correspond à votre recherche.
                  </p>
                ) : (
                  structuresFiltrees.map((s) => (
                    <PanelCard
                      key={s.id}
                      className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                            <MapPin className="size-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{s.nom}</h3>
                            <p className="text-xs text-muted-foreground">
                              {s.type.replace('_', ' ')} · {s.ville} ({s.region})
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{s.adresse}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                              {s.telephone && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="size-3" /> {s.telephone}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3" /> {s.horaires || "24/7"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xs text-muted-foreground">Yaoundé/Douala</p>
                          <button className="mt-2 rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-card hover:bg-primary/90">
                            Itinéraire
                          </button>
                        </div>
                      </div>
                    </PanelCard>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CentresPage;
