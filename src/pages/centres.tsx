import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { MapPin, Phone, Clock, Search } from "lucide-react";
import mapDouala from "@/assets/map-douala.png";

const centres = [
  { name: "Hôpital Laquintinie", type: "Hôpital public", dist: "1.2 km", city: "Douala · Akwa", tel: "+237 233 42 01 33", open: "24/7" },
  { name: "Hôpital Général de Yaoundé", type: "Hôpital public", dist: "3.8 km", city: "Yaoundé · Ngousso", tel: "+237 222 21 30 00", open: "24/7" },
  { name: "Centre Médical de Bastos", type: "Clinique privée", dist: "2.4 km", city: "Yaoundé · Bastos", tel: "+237 222 20 18 44", open: "07h - 22h" },
  { name: "CHU de Yaoundé", type: "Hôpital universitaire", dist: "5.1 km", city: "Yaoundé · Melen", tel: "+237 222 31 49 90", open: "24/7" },
  { name: "Polyclinique Bonanjo", type: "Polyclinique", dist: "1.9 km", city: "Douala · Bonanjo", tel: "+237 233 42 86 41", open: "06h - 23h" },
];

function CentresPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Géolocalisation"
          title="Formations sanitaires à proximité"
          description="Trouvez la structure de soin la plus proche, ouverte et adaptée à votre besoin."
        />

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
                placeholder="Rechercher un centre, une ville, une spécialité…"
              />
            </div>
            <div className="space-y-3">
              {centres.map((c) => (
                <PanelCard
                  key={c.name}
                  className="cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-xs text-muted-foreground">{c.type} · {c.city}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="size-3" /> {c.tel}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" /> {c.open}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-extrabold text-primary">{c.dist}</p>
                      <button className="mt-2 rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                        Itinéraire
                      </button>
                    </div>
                  </div>
                </PanelCard>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default  CentresPage
