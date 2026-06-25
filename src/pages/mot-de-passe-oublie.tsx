import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Loader2, AlertCircle, ArrowRight, Lock, Mail, Smartphone } from "lucide-react"
import { SiteNav } from "@/components/SiteNav"
import { PanelCard } from "@/components/Card"
import { useMotDePasseOublie } from "../hooks/useMotDePasseOublie"

function MotDePasseOubliePage() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type") === "medecin" ? "medecin" : "patient"
  const typeLabel = type === "medecin" ? "Médecin" : "Patient"

  const {
    etape,
    chargement,
    erreur,
    contact,
    demanderCode,
    verifierCode,
    definirNouveauMotDePasse,
    setErreur,
  } = useMotDePasseOublie(type)

  const [contactValue, setContactValue] = useState("")
  const [code, setCode] = useState("")
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("")
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("")

  useEffect(() => {
    setErreur("")
  }, [type, setErreur])

  const label = type === "medecin" ? "Adresse e-mail" : "Numéro WhatsApp"
  const placeholder = type === "medecin" ? "dr.nom@hopital.cm" : "+237 6XX XXX XXX"
  const Icon = type === "medecin" ? Mail : Smartphone

  async function handleDemanderCode(e: React.FormEvent) {
    e.preventDefault()
    if (!contactValue.trim()) {
      setErreur(`Veuillez saisir ${label.toLowerCase()}.`)
      return
    }
    await demanderCode(contactValue.trim())
  }

  async function handleVerifierCode(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) {
      setErreur("Veuillez saisir le code reçu.")
      return
    }
    await verifierCode(code.trim())
  }

  async function handleNouveauMotDePasse(e: React.FormEvent) {
    e.preventDefault()
    if (!nouveauMotDePasse || !confirmerMotDePasse) {
      setErreur("Veuillez renseigner tous les champs.")
      return
    }
    if (nouveauMotDePasse !== confirmerMotDePasse) {
      setErreur("Les mots de passe ne correspondent pas.")
      return
    }
    await definirNouveauMotDePasse(nouveauMotDePasse)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav variant="public" />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-card">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-primary">
            <Lock className="size-5" />
            Réinitialisation mot de passe
          </div>
          <h1 className="font-display text-3xl font-bold">Mot de passe oublié — {typeLabel}</h1>
          <p className="text-sm text-muted-foreground">
            Suivez les étapes pour générer un code, le valider puis définir un nouveau mot de passe.
          </p>
        </div>

        <PanelCard>
          {etape === "saisie" && (
            <form onSubmit={handleDemanderCode} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                  <Icon className="size-5 text-muted-foreground" />
                  <input
                    type={type === "medecin" ? "email" : "tel"}
                    value={contactValue}
                    onChange={e => setContactValue(e.target.value)}
                    placeholder={placeholder}
                    disabled={chargement}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              {erreur && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{erreur}</p>}
              <button
                type="submit"
                disabled={chargement}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:opacity-60"
              >
                {chargement ? (
                  <><Loader2 className="size-4 animate-spin" /> Envoi du code...</>
                ) : (
                  <><ArrowRight className="size-4" /> Recevoir le code</>
                )}
              </button>
            </form>
          )}

          {etape === "code" && (
            <form onSubmit={handleVerifierCode} className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Un code a été envoyé à :</p>
                <p className="mt-2 rounded-2xl border border-border bg-muted/5 px-4 py-3 text-sm font-medium text-foreground">
                  {contact || placeholder}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Code reçu</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  placeholder="123456"
                  disabled={chargement}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                />
              </div>
              {erreur && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{erreur}</p>}
              <button
                type="submit"
                disabled={chargement}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:opacity-60"
              >
                {chargement ? (
                  <><Loader2 className="size-4 animate-spin" /> Vérification...</>
                ) : (
                  <><ArrowRight className="size-4" /> Valider le code</>
                )}
              </button>
            </form>
          )}

          {etape === "nouveau" && (
            <form onSubmit={handleNouveauMotDePasse} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={nouveauMotDePasse}
                  onChange={e => setNouveauMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  disabled={chargement}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmerMotDePasse}
                  onChange={e => setConfirmerMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  disabled={chargement}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                />
              </div>
              {erreur && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{erreur}</p>}
              <button
                type="submit"
                disabled={chargement}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:opacity-60"
              >
                {chargement ? (
                  <><Loader2 className="size-4 animate-spin" /> Mise à jour...</>
                ) : (
                  <><ArrowRight className="size-4" /> Définir le nouveau mot de passe</>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary hover:underline">Retour à la connexion</Link>
          </div>
        </PanelCard>
      </main>
    </div>
  )
}

export default MotDePasseOubliePage
