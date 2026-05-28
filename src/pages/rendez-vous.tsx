import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Calendar, Clock, MapPin, Video, Plus } from "lucide-react";



const upcoming = [
  { day: "15", month: "OCT", time: "09:30", doc: "Dr. Samuel Etoa", spec: "Généraliste", loc: "Centre Médical de Bastos, Yaoundé", mode: "Présentiel" },
  { day: "22", month: "OCT", time: "14:00", doc: "Dr. Aline Fouda", spec: "Pédiatre", loc: "Téléconsultation vidéo", mode: "Téléconsultation" },
  { day: "03", month: "NOV", time: "10:15", doc: "Dr. Joseph Mbarga", spec: "Cardiologue", loc: "Hôpital Général de Douala", mode: "Présentiel" },
];

function RdvPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="patient" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Planning"
          title="Mes rendez-vous"
          description="Consultez, replanifiez ou prenez un nouveau rendez-vous avec nos médecins partenaires."
          action={
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02]">
              <Plus className="size-4" /> Nouveau RDV
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-4">
          {upcoming.map((a) => (
            <PanelCard key={a.doc + a.time} className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="grid w-20 shrink-0 place-items-center rounded-2xl bg-accent py-3 text-accent-foreground">
                <span className="font-display text-2xl font-extrabold leading-none">{a.day}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{a.month}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-lg font-bold">{a.doc}</h3>
                  <span className="rounded-md bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    {a.spec}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" /> {a.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {a.mode === "Téléconsultation" ? (
                      <Video className="size-4 text-secondary" />
                    ) : (
                      <MapPin className="size-4 text-primary" />
                    )}
                    {a.loc}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-soft">
                  Replanifier
                </button>
                <button
                  className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-card ${
                    a.mode === "Téléconsultation"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {a.mode === "Téléconsultation" ? "Rejoindre" : "Itinéraire"}
                </button>
              </div>
            </PanelCard>
          ))}
        </div>

        {/* Available slots */}
        <h2 className="mt-12 font-display text-xl font-bold">Créneaux disponibles cette semaine</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {["Lun 13", "Mar 14", "Mer 15", "Jeu 16", "Ven 17", "Sam 18", "Dim 19"].map((d, i) => (
            <PanelCard key={d} className="p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{d}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-primary">
                {[6, 4, 0, 8, 5, 2, 0][i]}
              </p>
              <p className="text-[10px] text-muted-foreground">créneaux</p>
            </PanelCard>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RdvPage