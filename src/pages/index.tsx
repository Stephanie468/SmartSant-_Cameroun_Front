import { Link } from "react-router-dom";
import { useState } from "react";
import {
  MessageCircle, MapPin, Stethoscope, Activity,
  Calendar, ShieldCheck, ArrowRight, Sparkles,
  Copy, Check, X
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

// ── Numéro Twilio Sandbox ─────────────────────────────────────
// Remplace par ton vrai numéro sandbox Twilio
const TWILIO_SANDBOX_NUMBER = "14155238886"
const MOT_CLE_SANDBOX       = "join choose-real" // ton mot-clé Twilio

// ── URL WhatsApp avec message pré-rempli ─────────────────────
const WHATSAPP_URL = `https://wa.me/${TWILIO_SANDBOX_NUMBER}?text=${encodeURIComponent(MOT_CLE_SANDBOX)}`

function ModalDemarrage({ onClose }: { onClose: () => void }) {
  const [copie, setCopie] = useState(false)

  const copierMessage = async () => {
    await navigator.clipboard.writeText(MOT_CLE_SANDBOX)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-soft"
        >
          <X className="size-5" />
        </button>

        {/* Icône */}
        <div className="grid size-14 place-items-center rounded-2xl bg-whatsapp/10 text-whatsapp mx-auto">
          <MessageCircle className="size-7" />
        </div>

        <h2 className="mt-5 text-center font-display text-2xl font-bold">
          Démarrer votre diagnostic
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Pour activer le chatbot Smart-Santé, vous devez d'abord rejoindre notre service WhatsApp en envoyant ce message :
        </p>

        {/* Message à copier */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface-soft px-4 py-3">
          <code className="flex-1 font-mono text-base font-bold text-foreground">
            {MOT_CLE_SANDBOX}
          </code>
          <button
            onClick={copierMessage}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              copie
                ? "bg-success/10 text-success"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {copie
              ? <><Check className="inline size-3 mr-1" />Copié !</>
              : <><Copy className="inline size-3 mr-1" />Copier</>
            }
          </button>
        </div>

        {/* Étapes */}
        <ol className="mt-6 space-y-3">
          {[
            "Copiez le message ci-dessus",
            "Cliquez sur « Ouvrir WhatsApp » ci-dessous",
            "Envoyez le message — vous rejoindrez automatiquement le service",
            "Décrivez ensuite vos symptômes pour démarrer votre diagnostic IA",
          ].map((etape, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {etape}
            </li>
          ))}
        </ol>

        {/* Bouton principal */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 font-semibold text-white shadow-card transition-transform hover:scale-[1.01]"
        >
          <MessageCircle className="size-5" />
          Ouvrir WhatsApp
        </a>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Votre numéro sera utilisé uniquement pour les communications médicales Smart-Santé.
        </p>
      </div>
    </div>
  )
}

function HomePage() {
  const [modalOuvert, setModalOuvert] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <SiteNav variant="public" />

      {/* Modal onboarding WhatsApp */}
      {modalOuvert && <ModalDemarrage onClose={() => setModalOuvert(false)} />}

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-10 text-primary-foreground">
              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                  <Sparkles className="size-3.5" /> Assistant IA WhatsApp
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
                  La santé connectée, partout au Cameroun.
                </h1>
                <p className="mt-5 text-base text-white/85 md:text-lg">
                  Décrivez vos symptômes à notre chatbot sur WhatsApp. Recevez un pré-diagnostic
                  immédiat pour le paludisme, la typhoïde et les pathologies courantes — puis
                  consultez un médecin partenaire en ligne ou à proximité.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {/* ✅ MODIFIÉ : ouvre le modal au lieu d'un lien direct */}
                  <button
                    onClick={() => setModalOuvert(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-5 py-3 font-semibold text-white shadow-lift transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="size-5" /> Démarrer sur WhatsApp
                  </button>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
                  >
                    Espace patient <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-16 -bottom-16 size-72 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -top-10 right-10 size-40 rounded-full bg-white/5 blur-2xl" />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card lg:col-span-4">
            <h3 className="font-display text-lg font-bold">Alerte épidémiologique</h3>
            <p className="mt-1 text-xs text-muted-foreground">Région du Littoral · Temps réel</p>
            <div className="mt-6 space-y-4">
              {[
                { name: "Paludisme", pct: 75, delta: "+12%", color: "bg-destructive" },
                { name: "Typhoïde", pct: 40, delta: "+4%", color: "bg-warning" },
                { name: "Choléra", pct: 8, delta: "Stable", color: "bg-success" },
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{row.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-xs font-bold">{row.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight">Un parcours de soin complet</h2>
          <p className="mt-2 text-muted-foreground">
            Du premier symptôme jusqu'à la prescription, accompagné par l'IA et un médecin de confiance.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageCircle, title: "Chatbot WhatsApp", text: "Analyse de symptômes par IA, pré-diagnostic et orientation immédiate." },
              { icon: Calendar, title: "Rendez-vous en ligne", text: "Réservez avec les médecins partenaires dans toutes les régions." },
              { icon: Stethoscope, title: "Téléconsultation", text: "Consultation vidéo sécurisée avec ordonnance numérique." },
              { icon: MapPin, title: "Centres à proximité", text: "Géolocalisation des formations sanitaires les plus proches." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dual CTA */}
        <section className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link to="/login" className="group rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
            <Activity className="size-7 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">Je suis patient</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Consultez votre historique, suivez vos prescriptions, prenez rendez-vous.
            </p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2">
              Accéder à mon espace <ArrowRight className="size-4 transition-all" />
            </span>
          </Link>
          <Link to="/login" className="group rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
            <ShieldCheck className="size-7 text-secondary" />
            <h3 className="mt-4 font-display text-xl font-bold">Je suis médecin partenaire</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Recevez les fiches patients pré-analysées par l'IA, gérez votre agenda et vos téléconsultations.
            </p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-secondary group-hover:gap-2">
              Accéder au dashboard <ArrowRight className="size-4 transition-all" />
            </span>
          </Link>
        </section>
      </main>

      <footer className="mt-20 border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 SmartSanté Cameroun · Au service de la santé pour tous.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Confidentialité</a>
            <a href="#" className="hover:text-primary">Mentions légales</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage