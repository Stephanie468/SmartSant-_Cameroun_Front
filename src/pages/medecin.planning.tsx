import { Fragment } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Video } from "lucide-react";



const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const days = ["Lun 13", "Mar 14", "Mer 15", "Jeu 16", "Ven 17", "Sam 18"];

type Slot = { d: number; h: number; n: string; tele?: boolean };
const slots: Slot[] = [
  { d: 0, h: 1, n: "M. Ngo" },
  { d: 0, h: 3, n: "Mme Fouda", tele: true },
  { d: 1, h: 0, n: "M. Ekanga" },
  { d: 1, h: 2, n: "Mme Mbah", tele: true },
  { d: 2, h: 1, n: "Dr. Onana" },
  { d: 2, h: 4, n: "M. Diallo", tele: true },
  { d: 3, h: 2, n: "Mme Bilong" },
  { d: 3, h: 6, n: "M. Tchoumi", tele: true },
  { d: 4, h: 1, n: "Mme Etoundi" },
  { d: 4, h: 5, n: "M. Ngando" },
  { d: 5, h: 2, n: "Mme Eya", tele: true },
];

function PlanningPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Agenda"
          title="Mon planning de la semaine"
          description="Visualisez et gérez l'ensemble de vos consultations en présentiel et en téléconsultation."
        />
        <PanelCard className="p-0 overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
            <div className="border-b border-r border-border bg-surface-soft" />
            {days.map((d) => (
              <div
                key={d}
                className="border-b border-r border-border bg-surface-soft px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground last:border-r-0"
              >
                {d}
              </div>
            ))}
            {hours.map((h, hi) => (
              <Fragment key={h}>
                <div className="border-b border-r border-border bg-surface-soft px-2 py-3 text-right text-[11px] font-semibold text-muted-foreground">
                  {h}
                </div>
                {days.map((_, di) => {
                  const s = slots.find((x) => x.d === di && x.h === hi);
                  return (
                    <div
                      key={`c-${di}-${hi}`}
                      className="relative h-16 border-b border-r border-border last:border-r-0"
                    >
                      {s && (
                        <div
                          className={`absolute inset-1 flex flex-col justify-center gap-0.5 rounded-lg px-2 text-[11px] font-semibold ${
                            s.tele
                              ? "bg-secondary/15 text-secondary border-l-2 border-secondary"
                              : "bg-primary/15 text-primary border-l-2 border-primary"
                          }`}
                        >
                          <span className="flex items-center gap-1 truncate">
                            {s.tele && <Video className="size-3 shrink-0" />} {s.n}
                          </span>
                          <span className="text-[9px] opacity-70">
                            {s.tele ? "Téléconsult." : "Présentiel"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </PanelCard>
      </main>
    </div>
  );
}

export default PlanningPage