import { SiteNav } from "@/components/SiteNav";
import { PanelCard, SectionHeader } from "@/components/Card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, FileText, Send } from "lucide-react";



function TeleconsultationPage() {
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant="medecin" />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <SectionHeader
          eyebrow="En cours"
          title="Téléconsultation · Alice Mbah"
          description="Connexion sécurisée · Chiffrement de bout en bout"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Video stage */}
          <div>
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-lift">
              {/* Patient placeholder */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid size-32 place-items-center rounded-full bg-white/10 text-4xl font-bold text-white backdrop-blur">
                  AM
                </div>
              </div>
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                <span className="size-2 animate-pulse rounded-full bg-white" /> EN DIRECT · 12:34
              </div>
              {/* Self preview */}
              <div className="absolute bottom-4 right-4 aspect-video w-40 overflow-hidden rounded-xl border-2 border-white/20 bg-slate-700 shadow-lift">
                <div className="grid size-full place-items-center text-xs font-bold text-white/70">
                  Vous
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button className="grid size-12 place-items-center rounded-full border border-border bg-card shadow-card hover:bg-surface-soft">
                <Mic className="size-5" />
              </button>
              <button className="grid size-12 place-items-center rounded-full border border-border bg-card shadow-card hover:bg-surface-soft">
                <Video className="size-5" />
              </button>
              <button className="grid size-12 place-items-center rounded-full border border-border bg-card shadow-card hover:bg-surface-soft">
                <MicOff className="size-5" />
              </button>
              <button className="grid size-12 place-items-center rounded-full border border-border bg-card shadow-card hover:bg-surface-soft">
                <VideoOff className="size-5" />
              </button>
              <button className="grid size-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-lift">
                <PhoneOff className="size-6" />
              </button>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <PanelCard>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Contexte patient
              </h3>
              <p className="text-sm font-semibold">Alice Mbah · 32 ans</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pré-diagnostic IA : Paludisme simple (85%)
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Symptômes : fièvre 39,2°C, frissons, céphalées, douleurs articulaires.
              </p>
            </PanelCard>

            <PanelCard className="flex h-80 flex-col p-0">
              <div className="border-b border-border px-4 py-3">
                <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <MessageSquare className="size-4" /> Chat
                </h3>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface-soft p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Alice</p>
                  <p>Bonjour docteur, j'ai très mal à la tête.</p>
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary p-3 text-primary-foreground">
                  <p className="text-xs font-semibold opacity-80">Vous</p>
                  <p>Bonjour Alice, depuis quand exactement ?</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border p-3">
                <input
                  className="flex-1 rounded-lg bg-surface-soft px-3 py-2 text-sm outline-none"
                  placeholder="Message…"
                />
                <button className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Send className="size-4" />
                </button>
              </div>
            </PanelCard>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold shadow-card hover:bg-surface-soft">
              <FileText className="size-4" /> Rédiger l'ordonnance
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeleconsultationPage