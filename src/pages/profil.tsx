import { Link } from "react-router-dom"
import { Loader2, AlertCircle, User, Smartphone, Mail, ShieldCheck, MapPin, Globe2, Briefcase, FileText, Award } from "lucide-react"
import { SiteNav } from "@/components/SiteNav"
import { PanelCard } from "@/components/Card"
import { useProfil } from "../hooks/useProfil"

function ProfilPage() {
  const { profil, chargement, erreur } = useProfil()

  if (chargement) {
    return (
      <div className="min-h-screen bg-background md:pl-64 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-semibold">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (erreur || !profil) {
    return (
      <div className="min-h-screen bg-background md:pl-64">
        <SiteNav variant="patient" />
        <main className="mx-auto max-w-4xl px-6 py-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-10 text-destructive mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-destructive">Impossible de charger le profil</h3>
            <p className="mt-2 text-sm text-destructive-foreground">{erreur || "Votre session a peut-être expiré."}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/login" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Se reconnecter
              </Link>
              <button onClick={() => window.location.reload()} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
                Réessayer
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isMedecin = profil.role === 'MEDECIN'
  const dashboardLink = isMedecin ? '/medecin' : '/patient'
  const resetLink = `/mot-de-passe-oublie?type=${isMedecin ? 'medecin' : 'patient'}`

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <SiteNav variant={isMedecin ? 'medecin' : 'patient'} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Mon profil</span>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Bonjour, {profil.prenom} {profil.nom}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{isMedecin ? 'Espace médecin partenaire' : 'Espace patient SmartSanté'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={dashboardLink} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card">
              Aller au dashboard
            </Link>
            <Link to={resetLink} className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold">
              Réinitialiser le mot de passe
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PanelCard className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Informations générales</p>
                <div className="mt-4 space-y-3 text-sm text-foreground">
                  <p><span className="font-semibold">Nom :</span> {profil.nom} {profil.prenom}</p>
                  <p><span className="font-semibold">Rôle :</span> {profil.role === 'MEDECIN' ? 'Médecin' : 'Patient'}</p>
                  <p><span className="font-semibold">Compte :</span> {profil.statut.toLowerCase()}</p>
                  <p><span className="font-semibold">Créé le :</span> {new Date(profil.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contacts</p>
                <div className="mt-4 space-y-3 text-sm text-foreground">
                  <p><Smartphone className="mr-2 inline-block" /> {profil.telephone}</p>
                  {profil.email && <p><Mail className="mr-2 inline-block" /> {profil.email}</p>}
                </div>
              </div>
            </div>
          </PanelCard>

          <PanelCard>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Raccourcis</p>
            <div className="mt-6 space-y-3">
              <Link to={dashboardLink} className="block rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:bg-surface-soft">
                Voir mon tableau de bord
              </Link>
              <Link to={resetLink} className="block rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:bg-surface-soft">
                Modifier mon mot de passe
              </Link>
            </div>
          </PanelCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {isMedecin ? (
            <PanelCard>
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                <Briefcase className="size-4" /> Détails médecin
              </div>
              <div className="mt-5 space-y-3 text-sm text-foreground">
                <p><span className="font-semibold">Spécialité :</span> {profil.medecin?.specialite || 'Non renseigné'}</p>
                <p><span className="font-semibold">Numéro d'ordre :</span> {profil.medecin?.numeroOrdre || 'Non renseigné'}</p>
                <p><span className="font-semibold">Certification :</span> {profil.medecin?.statutCertification || 'N/A'}</p>
                <p><span className="font-semibold">Tarif :</span> {profil.medecin ? `${profil.medecin.tarifConsultation} FCFA` : 'N/A'}</p>
                {profil.medecin?.bio && <p><span className="font-semibold">Bio :</span> {profil.medecin.bio}</p>}
                {profil.medecin?.carteProfessionnelleUrl && (
                  <p><span className="font-semibold">Carte pro :</span> <a href={profil.medecin.carteProfessionnelleUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Voir</a></p>
                )}
              </div>
            </PanelCard>
          ) : (
            <PanelCard>
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                <Award className="size-4" /> Détails patient
              </div>
              <div className="mt-5 space-y-3 text-sm text-foreground">
                <p><span className="font-semibold">Ville :</span> {profil.patient?.ville || 'Non renseigné'}</p>
                <p><span className="font-semibold">Région :</span> {profil.patient?.region || 'Non renseigné'}</p>
                <p><span className="font-semibold">Groupe sanguin :</span> {profil.patient?.groupeSanguin || 'Non renseigné'}</p>
                <p><span className="font-semibold">Allergies :</span> {profil.patient?.allergies || 'Aucune renseignée'}</p>
                <p><span className="font-semibold">Antécédents :</span> {profil.patient?.antecedents || 'Aucun renseigné'}</p>
                <p><span className="font-semibold">Langue :</span> {profil.patient?.langue || 'FR'}</p>
              </div>
            </PanelCard>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProfilPage
