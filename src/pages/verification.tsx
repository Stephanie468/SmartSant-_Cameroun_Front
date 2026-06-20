import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { MessageCircle, Stethoscope, ArrowRight, RotateCcw, Loader2 } from "lucide-react"
import { useVerification } from "../hooks/useVerification"

function VerificationPage() {
  const navigate = useNavigate()

  // ── Données de session ────────────────────────────────────
  // telephone : numéro récupéré depuis sessionStorage
  // nouveauCompte : true si vient de l'inscription, false si connexion
  const [telephone, setTelephone] = useState("")
  const [nomUtilisateur, setNomUtilisateur] = useState("")

  // ── État du formulaire ────────────────────────────────────
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [seconds, setSeconds] = useState(45)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // ── Hook métier ───────────────────────────────────────────
  // verifierCode → appelle le backend
  // renvoyerCode → demande un nouveau OTP
  // chargement   → true pendant l'appel API
  // erreur       → message d'erreur venant du backend
  const { verifierCode, renvoyerCode, chargement, erreur, setErreur } = useVerification()

  // ── Récupère les données de session au chargement ─────────
  // Si aucune donnée → redirige vers login
  useEffect(() => {
    const raw = sessionStorage.getItem("smartsante.otp")
    if (!raw) {
      navigate("/login")
      return
    }
    try {
      // On récupère telephone et nom stockés par inscription.tsx
      // { telephone: "+237...", nom: "Jean-Paul", nouveauCompte: true }
      const session = JSON.parse(raw)

      // ⚠️ Lovable utilisait "phone" mais notre backend utilise "telephone"
      // On supporte les deux pour compatibilité
      const tel = session.telephone || session.phone || ""
      if (!tel) {
        navigate("/login")
        return
      }
      setTelephone(tel)
      setNomUtilisateur(session.nom || "")
    } catch {
      navigate("/login")
    }
  }, [navigate])

  // ── Compte à rebours avant de pouvoir renvoyer le code ────
  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  // ── Gestion des inputs du code OTP ───────────────────────
  // Chaque case = 1 chiffre, focus automatique sur la case suivante
  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1) // garde seulement le dernier chiffre
    const next = [...code]
    next[i] = digit
    setCode(next)
    setErreur("") // reset erreur à chaque frappe
    if (digit && i < 5) inputs.current[i + 1]?.focus() // focus case suivante
  }

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace sur case vide → focus case précédente
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  // Coller un code copié depuis WhatsApp (ex: "123456")
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (text.length === 6) {
      setCode(text.split(""))
      inputs.current[5]?.focus()
      e.preventDefault()
    }
  }

  // ── Soumission ────────────────────────────────────────────
  // Appelle verifierCode du hook → qui appelle authApi.verifierOTP
  // → qui appelle client.post('/auth/verification/otp', { telephone, code })
  // → backend vérifie en base → retourne token + utilisateur
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = code.join("")
    if (otp.length !== 6) {
      setErreur("Veuillez saisir les 6 chiffres.")
      return
    }
    // Appel réel au backend — plus de mock
    await verifierCode(telephone, otp)
  }

  // ── Renvoyer le code ──────────────────────────────────────
  const handleRenvoyer = async () => {
    setSeconds(45)
    setCode(Array(6).fill(""))
    await renvoyerCode(telephone)
  }

  // ── Masque le numéro pour l'affichage ─────────────────────
  // Ex: +237690123456 → +237690•••••56
  const masqueTelephone = telephone.replace(
    /(\+?\d{3})(\d+)(\d{2})$/,
    (_, a, b, c) => `${a}${"•".repeat(b.length)}${c}`
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Stethoscope className="size-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-extrabold text-primary">
              SmartSanté <span className="text-secondary">Cameroun</span>
            </span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Modifier le numéro
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-whatsapp/10 text-whatsapp">
          <MessageCircle className="size-8" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          Vérification WhatsApp
        </h1>

        {/* Affiche le nom si disponible */}
        {nomUtilisateur && (
          <p className="mt-2 text-sm font-medium text-primary">
            Bonjour {nomUtilisateur} 👋
          </p>
        )}

        <p className="mt-3 text-sm text-muted-foreground">
          Nous avons envoyé un code à 6 chiffres au
          <br />
          <span className="font-semibold text-foreground">
            {masqueTelephone || telephone}
          </span>{" "}
          via WhatsApp.
        </p>

        <form onSubmit={submit} className="mt-10 w-full">
          {/* Cases OTP */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((d, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el }}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKey(i, e)}
                inputMode="numeric"
                maxLength={1}
                disabled={chargement}
                className="size-12 rounded-xl border border-input bg-card text-center font-display text-xl font-bold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 disabled:opacity-50 md:size-14 md:text-2xl"
              />
            ))}
          </div>

          {/* Erreur venant du backend ou validation locale */}
          {erreur && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {erreur}
            </p>
          )}

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={chargement || code.join("").length !== 6}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {chargement
              ? <><Loader2 className="size-4 animate-spin" /> Vérification...</>
              : <><ArrowRight className="size-4" /> Vérifier et continuer</>
            }
          </button>
        </form>

        {/* Renvoyer le code */}
        <button
          disabled={seconds > 0 || chargement}
          onClick={handleRenvoyer}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary disabled:opacity-60"
        >
          <RotateCcw className="size-4" />
          {seconds > 0 ? `Renvoyer dans ${seconds}s` : "Renvoyer le code"}
        </button>

        {/* Message de démo — à retirer en production */}
        {import.meta.env.DEV && (
          <p className="mt-10 rounded-xl bg-accent px-4 py-3 text-xs text-accent-foreground">
            💡 Mode développement — Le code OTP s'affiche dans le terminal du backend.
          </p>
        )}
      </main>
    </div>
  )
}

export default VerificationPage