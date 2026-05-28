import { NavLink } from "react-router-dom";
import {
  Stethoscope,
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Pill,
  MapPin,
  Users,
  CalendarRange,
  Video,
  LineChart,
  Menu,
  LogOut,
} from "lucide-react";
import { useState, type ComponentType } from "react";

type LinkItem = { to: string; label: string; icon: ComponentType<{ className?: string }> };

const patientLinks: LinkItem[] = [
  { to: "/patient", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/historique", label: "Historique", icon: ClipboardList },
  { to: "/rendez-vous", label: "Rendez-vous", icon: CalendarDays },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/centres", label: "Centres de santé", icon: MapPin },
];

const medecinLinks: LinkItem[] = [
  { to: "/medecin", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/medecin/patients", label: "Fiches patients", icon: Users },
  { to: "/medecin/planning", label: "Planning", icon: CalendarRange },
  { to: "/medecin/teleconsultation", label: "Téléconsultation", icon: Video },
  { to: "/statistiques", label: "Épidémiologie", icon: LineChart },
];

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
        <Stethoscope className="size-5" strokeWidth={2.5} />
      </div>
      <span className="font-display text-base font-extrabold leading-tight tracking-tight text-primary">
        SmartSanté <span className="text-secondary">Cameroun</span>
      </span>
    </NavLink>
  );
}

function SidebarNav({
  links,
  variant,
  onNavigate,
}: {
  links: LinkItem[];
  variant: "patient" | "medecin";
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-5">
        <Brand />
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Espace {variant === "patient" ? "patient" : "médecin"}
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {links.map((l) => (
          <NavLink
              key={l.to}
              to={l.to}
              onClick={onNavigate}
              end
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-primary text-primary-foreground shadow-card"
                  : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              }
            >
              <l.icon className="size-4" />
              {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <NavLink
          to="/login"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Se déconnecter
        </NavLink>
      </div>
    </div>
  );
}

export function SiteNav({ variant = "patient" }: { variant?: "patient" | "medecin" | "public" }) {
  const [open, setOpen] = useState(false);

  if (variant === "public") {
    return (
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Brand />
          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:block"
            >
              Espace médecin
            </NavLink>
            <NavLink
              to="/login"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02]"
            >
              Se connecter
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }

  const links = variant === "medecin" ? medecinLinks : patientLinks;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card md:block">
        <SidebarNav links={links} variant={variant} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md md:hidden">
        <Brand />
        <button
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
          className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-card shadow-lift">
            <SidebarNav links={links} variant={variant} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
