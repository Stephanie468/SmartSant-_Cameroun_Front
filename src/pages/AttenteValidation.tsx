import { Link } from "react-router-dom"
import { Stethoscope, Clock, CheckCircle2, Mail, ArrowLeft } from "lucide-react"

export default function AttenteValidation() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Header identique aux autres pages ── */}
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
        </div>
      </header>

      {/* ── Contenu principal ── */}
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">

        {/* Icône principale */}
        <div className="grid size-20 place-items-center rounded-2xl bg-warning/10 text-warning">
          <Clock className="size-10" strokeWidth={1.5} />
        </div>

        {/* Titre */}
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Candidature soumise avec succès !
        </h1>

        {/* Sous-titre */}
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Merci pour votre inscription. Afin de garantir la sécurité de nos patients,
          l'administrateur de <strong className="font-semibold text-foreground">Smart-Santé Cameroun</strong> va
          vérifier manuellement votre carte professionnelle.
        </p>

        {/* Carte des étapes */}
        <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 shadow-card text-left">
          <h2 className="font-display text-base font-bold text-foreground">
            Que se passe-t-il maintenant ?
          </h2>

          <ul className="mt-5 space-y-4">
            <EtapeItem
              icone={<CheckCircle2 className="size-5 text-success" />}
              couleur="bg-success/10"
              titre="Candidature reçue"
              description="Vos informations et votre carte professionnelle ont bien été enregistrées."
              fait
            />
            <EtapeItem
              icone={<Clock className="size-5 text-warning" />}
              couleur="bg-warning/10"
              titre="Vérification en cours — 48h"
              description="L'équipe Smart-Santé contrôle l'authenticité de votre numéro ONMC et de votre carte."
              actif
            />
            <EtapeItem
              icone={<Mail className="size-5 text-primary" />}
              couleur="bg-primary/10"
              titre="Notification de validation"
              description="Vous recevrez un e-mail et un message WhatsApp dès que votre compte sera activé."
            />
          </ul>
        </div>

        {/* Note informative */}
        <div className="mt-6 w-full rounded-xl bg-accent p-4 text-left">
          <p className="text-sm text-accent-foreground">
            <strong>Besoin d'aide ?</strong> Contactez-nous à{" "}
            <a
              href="mailto:support@smartsante.cm"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              support@smartsante.cm
            </a>{" "}
            en précisant votre numéro d'ordre ONMC.
          </p>
        </div>

        {/* Bouton retour */}
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
        >
          <ArrowLeft className="size-4" />
          Retour à l'accueil
        </Link>
      </main>
    </div>
  )
}

// ── Composant étape ───────────────────────────────────────────
function EtapeItem({
  icone,
  couleur,
  titre,
  description,
  fait = false,
  actif = false,
}: {
  icone: React.ReactNode
  couleur: string
  titre: string
  description: string
  fait?: boolean
  actif?: boolean
}) {
  return (
    <li className="flex items-start gap-4">
      <div className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${couleur}`}>
        {icone}
      </div>
      <div>
        <p className={`text-sm font-semibold ${
          fait ? "text-success" : actif ? "text-foreground" : "text-muted-foreground"
        }`}>
          {titre}
          {fait && (
            <span className="ml-2 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success">
              Fait
            </span>
          )}
          {actif && (
            <span className="ml-2 rounded-md bg-warning/10 px-1.5 py-0.5 text-xs font-medium text-warning">
              En cours
            </span>
          )}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  )
}