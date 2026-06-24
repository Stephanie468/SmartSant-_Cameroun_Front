import { Link, useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import {
  Stethoscope, User, Phone, Calendar,
  MapPin, ArrowRight, ShieldCheck,
  Mail, Lock, Briefcase, Building2,
  Loader2, Award, Upload, CheckCircle2, X
} from "lucide-react"
import { useInscription } from "../hooks/useInscription"
import type { FormulairePatient, FormulaireMedecin } from "../types/auth"

const SPECIALITES = [
  "Médecine générale", "Pédiatrie", "Gynécologie",
  "Cardiologie", "Dermatologie", "Infectiologie",
  "Pneumologie", "Autre"
]

const VILLES = ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Bamenda", "Maroua", "Autre"]

function SignupPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<"patient" | "medecin">("patient")
  const { soumettrePatient, soumettreMedecin, chargement, erreur, setErreur } = useInscription()

  // ── État Patient ─────────────────────────────────────────────
  const [patient, setPatient] = useState<FormulairePatient>({
    nom: "", prenom: "", telephone: "",
    dateNaissance: "", ville: "Douala", motDePasse: "", consentement: false
  })

  // ── État Médecin ─────────────────────────────────────────────
  const [medecin, setMedecin] = useState<FormulaireMedecin>({
    nom: "", prenom: "", telephone: "", email: "",
    motDePasse: "", specialite: SPECIALITES[0],
    numeroOrdre: "", carteProfessionnelleUrl: "",
    hopital: "", consentement: false
  })

  // ── État upload fichier ──────────────────────────────────────
  const [uploading, setUploading] = useState(false)
  const [nomFichier, setNomFichier] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updP = <K extends keyof FormulairePatient>(k: K, v: FormulairePatient[K]) =>
    setPatient(f => ({ ...f, [k]: v }))
  const updM = <K extends keyof FormulaireMedecin>(k: K, v: FormulaireMedecin[K]) =>
    setMedecin(f => ({ ...f, [k]: v }))

  const switchTab = (t: "patient" | "medecin") => { setTab(t); setErreur("") }

  // ── Upload du fichier vers le backend ────────────────────────
  // On envoie le fichier en multipart/form-data
  // Le backend retourne { url: "..." } qu'on stocke dans l'état
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation côté frontend
    const typesAutorises = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    if (!typesAutorises.includes(file.type)) {
      setErreur("Format non accepté. Utilisez JPG, PNG, WEBP ou PDF.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErreur("Fichier trop lourd. Maximum 5 Mo.")
      return
    }

    setUploading(true)
    setErreur("")
    setNomFichier(file.name)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Appel direct fetch — pas d'axios, cohérent avec notre client.ts
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/upload`,
        {
          method: "POST",
          body: formData,
          // NE PAS mettre Content-Type ici — le navigateur le génère avec le boundary
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Échec du téléversement.")
      }

      const data = await response.json()
      // data.url = chemin public vers le fichier (ex: /uploads/carte-12345.jpg)
      updM("carteProfessionnelleUrl", data.url)
    } catch (err: any) {
      setErreur(err.message || "Échec du téléversement. Réessayez.")
      setNomFichier("")
    } finally {
      setUploading(false)
    }
  }

  const supprimerFichier = () => {
    updM("carteProfessionnelleUrl", "")
    setNomFichier("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ── Soumissions ──────────────────────────────────────────────
  const submitPatient = (e: React.FormEvent) => {
    e.preventDefault()
    const tel = patient.telephone.replace(/\s+/g, "")
    if (patient.nom.trim().length < 2) return setErreur("Veuillez renseigner votre nom complet.")
    if (!/^\+?\d{8,15}$/.test(tel)) return setErreur("Numéro WhatsApp invalide.")
    if (!patient.dateNaissance) return setErreur("Date de naissance requise.")
    if (patient.motDePasse.length < 8) return setErreur("Mot de passe trop court (8 caractères minimum).")
    if (!patient.consentement) return setErreur("Vous devez accepter la politique de confidentialité.")
    soumettrePatient(patient)
  }

  const submitMedecin = (e: React.FormEvent) => {
    e.preventDefault()
    const tel = medecin.telephone.replace(/\s+/g, "")
    if (medecin.nom.trim().length < 2) return setErreur("Veuillez renseigner votre nom complet.")
    if (!/^\+?\d{8,15}$/.test(tel)) return setErreur("Numéro de téléphone invalide.")
    if (!/^\S+@\S+\.\S+$/.test(medecin.email)) return setErreur("Adresse e-mail invalide.")
    if (medecin.motDePasse.length < 8) return setErreur("Mot de passe trop court (8 caractères minimum).")
    if (!medecin.numeroOrdre.trim()) return setErreur("Numéro d'ordre professionnel requis.")
    if (!medecin.carteProfessionnelleUrl) return setErreur("Veuillez téléverser votre carte professionnelle.")
    if (medecin.hopital.trim().length < 2) return setErreur("Veuillez renseigner votre établissement.")
    if (!medecin.consentement) return setErreur("Vous devez accepter la charte des médecins partenaires.")
    soumettreMedecin(medecin)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Stethoscope className="size-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-extrabold text-primary">
              SmartSanté <span className="text-secondary">Cameroun</span>
            </span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
            J'ai déjà un compte
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Création de compte
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {tab === "patient" ? "Rejoignez SmartSanté Cameroun" : "Devenir médecin partenaire"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tab === "patient"
              ? "Gratuit · Vos données médicales restent confidentielles et hébergées au Cameroun."
              : "Réservé aux professionnels de santé certifiés. Votre profil sera vérifié sous 48h."}
          </p>

          <div className="mt-6 inline-flex rounded-xl border border-border bg-card p-1">
            {(["patient", "medecin"] as const).map(t => (
              <button key={t} onClick={() => switchTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}>
                {t === "patient" ? "Je suis patient" : "Je suis médecin"}
              </button>
            ))}
          </div>

          {/* ── Formulaire Patient ── */}
          {tab === "patient" ? (
            <form onSubmit={submitPatient} className="mt-8 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={User} label="Nom">
                  <input value={patient.nom} onChange={e => updP("nom", e.target.value)}
                    placeholder="Ekanga" className="w-full bg-transparent outline-none" />
                </Field>
                <Field icon={User} label="Prénom">
                  <input value={patient.prenom} onChange={e => updP("prenom", e.target.value)}
                    placeholder="Jean-Paul" className="w-full bg-transparent outline-none" />
                </Field>
              </div>
              <Field icon={Phone} label="Numéro WhatsApp">
                <input type="tel" value={patient.telephone}
                  onChange={e => updP("telephone", e.target.value)}
                  placeholder="+237 6XX XXX XXX" className="w-full bg-transparent outline-none" />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={Calendar} label="Date de naissance">
                  <input type="date" value={patient.dateNaissance}
                    onChange={e => updP("dateNaissance", e.target.value)}
                    className="w-full bg-transparent outline-none" />
                </Field>
                <Field icon={MapPin} label="Ville">
                  <select value={patient.ville} onChange={e => updP("ville", e.target.value)}
                    className="w-full bg-transparent outline-none">
                    {VILLES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <Field icon={Lock} label="Mot de passe">
                <input type="password" value={patient.motDePasse}
                  onChange={e => updP("motDePasse", e.target.value)}
                  placeholder="Minimum 8 caractères" className="w-full bg-transparent outline-none" />
              </Field>
              <Consent checked={patient.consentement} onChange={v => updP("consentement", v)}
                label={<>J'accepte que SmartSanté Cameroun traite mes données de santé conformément à la{" "}
                  <a href="#" className="font-semibold text-primary hover:underline">politique de confidentialité</a>.</>} />
              {erreur && <ErrorMsg>{erreur}</ErrorMsg>}
              <button type="submit" disabled={chargement}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed">
                {chargement ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                {chargement ? "Création en cours..." : "Créer mon compte et recevoir le code"}
              </button>
            </form>
          ) : (
            /* ── Formulaire Médecin ── */
            <form onSubmit={submitMedecin} className="mt-8 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={User} label="Nom">
                  <input value={medecin.nom} onChange={e => updM("nom", e.target.value)}
                    placeholder="Nguemo" className="w-full bg-transparent outline-none" />
                </Field>
                <Field icon={User} label="Prénom">
                  <input value={medecin.prenom} onChange={e => updM("prenom", e.target.value)}
                    placeholder="Dr. Marie" className="w-full bg-transparent outline-none" />
                </Field>
              </div>
              <Field icon={Phone} label="Téléphone">
                <input type="tel" value={medecin.telephone}
                  onChange={e => updM("telephone", e.target.value)}
                  placeholder="+237 6XX XXX XXX" className="w-full bg-transparent outline-none" />
              </Field>
              <Field icon={Mail} label="E-mail professionnel">
                <input type="email" value={medecin.email}
                  onChange={e => updM("email", e.target.value)}
                  placeholder="dr.nguemo@hopital.cm" className="w-full bg-transparent outline-none" />
              </Field>
              <Field icon={Lock} label="Mot de passe">
                <input type="password" value={medecin.motDePasse}
                  onChange={e => updM("motDePasse", e.target.value)}
                  placeholder="Minimum 8 caractères" className="w-full bg-transparent outline-none" />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={Briefcase} label="Spécialité">
                  <select value={medecin.specialite} onChange={e => updM("specialite", e.target.value)}
                    className="w-full bg-transparent outline-none">
                    {SPECIALITES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field icon={Award} label="Numéro d'ordre (ONMC)">
                  <input value={medecin.numeroOrdre}
                    onChange={e => updM("numeroOrdre", e.target.value)}
                    placeholder="Ex : ONMC-12345" className="w-full bg-transparent outline-none" />
                </Field>
              </div>
              <Field icon={Building2} label="Hôpital / Clinique">
                <input value={medecin.hopital} onChange={e => updM("hopital", e.target.value)}
                  placeholder="Hôpital Laquintinie, Douala" className="w-full bg-transparent outline-none" />
              </Field>

              {/* ── Zone upload carte professionnelle ── */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Carte professionnelle (JPG, PNG, PDF — max 5 Mo)
                </span>

                {/* Fichier déjà uploadé → affiche le nom + bouton supprimer */}
                {medecin.carteProfessionnelleUrl ? (
                  <div className="flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3">
                    <CheckCircle2 className="size-4 shrink-0 text-success" />
                    <span className="flex-1 truncate text-sm text-foreground">{nomFichier}</span>
                    <button type="button" onClick={supprimerFichier}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  /* Zone de dépôt clickable */
                  <label className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors
                    ${uploading
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent/30"}`}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="sr-only"
                    />
                    {uploading ? (
                      <>
                        <Loader2 className="size-6 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Téléversement en cours...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-6 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Cliquez pour sélectionner un fichier
                        </span>
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG, WEBP ou PDF · Max 5 Mo
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>

              <Consent checked={medecin.consentement} onChange={v => updM("consentement", v)}
                label={<>Je certifie l'exactitude de mes informations et j'accepte la{" "}
                  <a href="#" className="font-semibold text-primary hover:underline">charte des médecins partenaires</a>.</>} />
              {erreur && <ErrorMsg>{erreur}</ErrorMsg>}
              <button type="submit" disabled={chargement || uploading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed">
                {chargement ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                {chargement ? "Envoi en cours..." : "Soumettre ma candidature"}
              </button>
            </form>
          )}
        </div>

        {/* ── Aside ── */}
        <aside className="lg:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <ShieldCheck className="size-7 text-primary" />
            {tab === "patient" ? (
              <>
                <h3 className="mt-4 font-display text-lg font-bold">Pourquoi un compte ?</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>• Conservez l'historique de vos diagnostics IA</li>
                  <li>• Prenez rendez-vous avec un médecin partenaire</li>
                  <li>• Recevez vos ordonnances numériques</li>
                  <li>• Suivez vos prescriptions et rappels</li>
                </ul>
                <p className="mt-6 rounded-xl bg-accent p-4 text-xs text-accent-foreground">
                  Pas besoin de compte pour démarrer une conversation avec le chatbot WhatsApp.
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-4 font-display text-lg font-bold">Avantages médecin partenaire</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>• Fiches patients pré-remplies par l'IA diagnostique</li>
                  <li>• Téléconsultation vidéo intégrée et sécurisée</li>
                  <li>• Agenda intelligent synchronisé avec WhatsApp</li>
                  <li>• Statistiques épidémiologiques de votre zone</li>
                </ul>
                <p className="mt-6 rounded-xl bg-accent p-4 text-xs text-accent-foreground">
                  Votre numéro d'ordre ONMC et votre carte professionnelle seront vérifiés sous 48h.
                </p>
              </>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

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

function Consent({ checked, onChange, label }: {
  checked: boolean
  onChange: (v: boolean) => void
  label: React.ReactNode
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-primary" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </label>
  )
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{children}</p>
  )
}

export default SignupPage