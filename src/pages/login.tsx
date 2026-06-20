import { Link } from "react-router-dom"
import { useState } from "react"
import {
  Stethoscope, MessageCircle, ArrowRight,
  Phone, User, Mail, Lock, Loader2
} from "lucide-react"
import { useConnexion } from "../hooks/useConnexion"
import type {
  FormulaireConnexionPatient,
  FormulaireConnexionMedecin
} from "../types/auth"

function LoginPage() {
  const [tab, setTab] = useState<"patient" | "medecin">("patient")
  const { connecterPatient, connecterMedecin, chargement, erreur, setErreur } = useConnexion()

  // ── État formulaire patient ───────────────────────────────
  const [patient, setPatient] = useState<FormulaireConnexionPatient>({
    nom: "",
    telephone: "",
  })

  // ── État formulaire médecin ───────────────────────────────
  const [medecin, setMedecin] = useState<FormulaireConnexionMedecin>({
    email: "",
    motDePasse: "",
  })

  const switchTab = (t: "patient" | "medecin") => {
    setTab(t)
    setErreur("")
  }

  // ── Soumission patient ────────────────────────────────────
  const handlePatient = (e: React.FormEvent) => {
    e.preventDefault()
    const tel = patient.telephone.replace(/\s+/g, "")
    if (patient.nom.trim().length < 2)
      return setErreur("Veuillez renseigner votre nom complet.")
    if (!/^\+?\d{8,15}$/.test(tel))
      return setErreur("Numéro invalide. Format : +237 6XX XXX XXX")
    connecterPatient({ ...patient, telephone: tel })
  }

  // ── Soumission médecin ────────────────────────────────────
  const handleMedecin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(medecin.email))
      return setErreur("Adresse e-mail invalide.")
    if (medecin.motDePasse.length < 8)
      return setErreur("Mot de passe trop court (8 caractères minimum).")
    connecterMedecin(medecin)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* ── Panneau gauche — branding ── */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-secondary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Stethoscope className="size-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight">
              SmartSanté Cameroun
            </span>
          </Link>

          <div className="relative z-10 max-w-md">
            {tab === "patient" ? (
              <>
                <h1 className="font-display text-4xl font-extrabold leading-tight">
                  Votre santé, à portée de message.
                </h1>
                <p className="mt-4 text-white/85">
                  Connectez-vous pour suivre vos diagnostics, vos rendez-vous et vos
                  prescriptions. Pas encore de compte ? Vous pouvez utiliser le chatbot
                  WhatsApp sans inscription.
                </p>
                <a
                  href="https://wa.me/237600000000"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="size-5" /> Tester le chatbot sans compte
                </a>
              </>
            ) : (
              <>
                <h1 className="font-display text-4xl font-extrabold leading-tight">
                  Espace professionnel des médecins partenaires.
                </h1>
                <p className="mt-4 text-white/85">
                  Accédez à vos fiches patients pré-diagnostiquées par l'IA, gérez votre
                  planning de consultations et lancez vos téléconsultations sécurisées.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/85">
                  <li>• File d'attente intelligente priorisée par urgence</li>
                  <li>• Téléconsultation vidéo HD et ordonnances numériques</li>
                  <li>• Données épidémiologiques en temps réel</li>
                </ul>
              </>
            )}
          </div>

          <p className="text-xs text-white/70">
            © 2026 SmartSanté Cameroun · Au service de la santé pour tous.
          </p>
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* ── Panneau droit — formulaire ── */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Logo mobile uniquement */}
            <div className="mb-6 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Stethoscope className="size-5" strokeWidth={2.5} />
                </div>
                <span className="font-display text-base font-extrabold text-primary">
                  SmartSanté <span className="text-secondary">Cameroun</span>
                </span>
              </Link>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight">Connexion</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Accédez à votre espace personnalisé.
            </p>

            {/* Sélecteur patient / médecin */}
            <div className="mt-8 inline-flex rounded-xl border border-border bg-card p-1">
              {(["patient", "medecin"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t === "patient" ? "Patient" : "Médecin"}
                </button>
              ))}
            </div>

            {/* ── Formulaire Patient ── */}
            {tab === "patient" ? (
              <form onSubmit={handlePatient} className="mt-6 space-y-4">
                <Field icon={User} label="Nom complet">
                  <input
                    value={patient.nom}
                    onChange={e => setPatient(f => ({ ...f, nom: e.target.value }))}
                    placeholder="Jean-Paul Ekanga"
                    disabled={chargement}
                    className="w-full bg-transparent outline-none disabled:opacity-50"
                  />
                </Field>
                <Field icon={Phone} label="Numéro WhatsApp">
                  <input
                    type="tel"
                    value={patient.telephone}
                    onChange={e => setPatient(f => ({ ...f, telephone: e.target.value }))}
                    placeholder="+237 6XX XXX XXX"
                    disabled={chargement}
                    className="w-full bg-transparent outline-none disabled:opacity-50"
                  />
                </Field>
                <p className="text-xs text-muted-foreground">
                  Un code de vérification à 6 chiffres vous sera envoyé via WhatsApp.
                </p>
                {erreur && <ErrorMsg>{erreur}</ErrorMsg>}
                <button
                  type="submit"
                  disabled={chargement}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {chargement
                    ? <><Loader2 className="size-4 animate-spin" /> Envoi du code...</>
                    : <><ArrowRight className="size-4" /> Recevoir le code WhatsApp</>
                  }
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Première visite ?{" "}
                  <Link to="/inscription" className="font-semibold text-primary hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </form>
            ) : (
              /* ── Formulaire Médecin ── */
              <form onSubmit={handleMedecin} className="mt-6 space-y-4">
                <Field icon={Mail} label="E-mail professionnel">
                  <input
                    type="email"
                    value={medecin.email}
                    onChange={e => setMedecin(f => ({ ...f, email: e.target.value }))}
                    placeholder="dr.nguemo@hopital.cm"
                    disabled={chargement}
                    className="w-full bg-transparent outline-none disabled:opacity-50"
                  />
                </Field>
                <Field icon={Lock} label="Mot de passe">
                  <input
                    type="password"
                    value={medecin.motDePasse}
                    onChange={e => setMedecin(f => ({ ...f, motDePasse: e.target.value }))}
                    placeholder="••••••••"
                    disabled={chargement}
                    className="w-full bg-transparent outline-none disabled:opacity-50"
                  />
                </Field>

                {/* Message informatif sur le statut EN_ATTENTE */}
                <p className="rounded-xl bg-accent px-4 py-3 text-xs text-accent-foreground">
                  Si votre dossier est en cours de vérification, vous serez automatiquement
                  redirigé vers la page d'attente.
                </p>

                {erreur && <ErrorMsg>{erreur}</ErrorMsg>}
                <button
                  type="submit"
                  disabled={chargement}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {chargement
                    ? <><Loader2 className="size-4 animate-spin" /> Connexion...</>
                    : <><ArrowRight className="size-4" /> Accéder au dashboard</>
                  }
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Pas encore partenaire ?{" "}
                  <Link to="/inscription" className="font-semibold text-primary hover:underline">
                    Demander un accès
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Composants utilitaires ────────────────────────────────────
function Field({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-input bg-card px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
        <Icon className="size-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  )
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{children}</p>
  )
}

export default LoginPage