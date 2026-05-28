import {  Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Stethoscope,
  User,
  Phone,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  Briefcase,
  Building2,
} from "lucide-react";



const SPECIALITES = [
  "Médecine générale",
  "Pédiatrie",
  "Gynécologie",
  "Cardiologie",
  "Dermatologie",
  "Infectiologie",
  "Pneumologie",
  "Autre",
];

function SignupPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"patient" | "medecin">("patient");
  const [error, setError] = useState("");

  // Patient state
  const [patient, setPatient] = useState({
    name: "",
    phone: "",
    birthdate: "",
    city: "Douala",
    consent: false,
  });
  // Médecin state
  const [medecin, setMedecin] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    speciality: SPECIALITES[0],
    hospital: "",
    consent: false,
  });

  const updP = <K extends keyof typeof patient>(k: K, v: (typeof patient)[K]) =>
    setPatient((f) => ({ ...f, [k]: v }));
  const updM = <K extends keyof typeof medecin>(k: K, v: (typeof medecin)[K]) =>
    setMedecin((f) => ({ ...f, [k]: v }));

  const switchTab = (t: "patient" | "medecin") => {
    setTab(t);
    setError("");
  };

  const submitPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = patient.phone.replace(/\s+/g, "");
    if (patient.name.trim().length < 2) return setError("Veuillez renseigner votre nom complet.");
    if (!/^\+?\d{8,15}$/.test(cleaned)) return setError("Numéro WhatsApp invalide.");
    if (!patient.birthdate) return setError("Date de naissance requise.");
    if (!patient.consent) return setError("Vous devez accepter la politique de confidentialité.");

    sessionStorage.setItem(
      "smartsante.otp",
      JSON.stringify({ phone: cleaned, name: patient.name.trim(), newAccount: true }),
    );
    navigate( "/verification" );
  };

  const submitMedecin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = medecin.phone.replace(/\s+/g, "");
    if (medecin.name.trim().length < 2) return setError("Veuillez renseigner votre nom complet.");
    if (!/^\+?\d{8,15}$/.test(cleaned)) return setError("Numéro de téléphone invalide.");
    if (!/^\S+@\S+\.\S+$/.test(medecin.email)) return setError("Adresse e-mail invalide.");
    if (medecin.password.length < 8)
      return setError("Mot de passe trop court (8 caractères minimum).");
    if (medecin.hospital.trim().length < 2)
      return setError("Veuillez renseigner votre établissement de rattachement.");
    if (!medecin.consent)
      return setError("Vous devez accepter la charte des médecins partenaires.");
    navigate("/medecin" );
  };

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
            {tab === "patient"
              ? "Rejoignez SmartSanté Cameroun"
              : "Devenir médecin partenaire"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tab === "patient"
              ? "Gratuit · Vos données médicales restent confidentielles et hébergées au Cameroun."
              : "Réservé aux professionnels de santé certifiés. Votre profil sera vérifié sous 48h."}
          </p>

          <div className="mt-6 inline-flex rounded-xl border border-border bg-card p-1">
            {(["patient", "medecin"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "patient" ? "Je suis patient" : "Je suis médecin"}
              </button>
            ))}
          </div>

          {tab === "patient" ? (
            <form onSubmit={submitPatient} className="mt-8 space-y-4">
              <Field icon={User} label="Nom complet">
                <input
                  value={patient.name}
                  onChange={(e) => updP("name", e.target.value)}
                  placeholder="Jean-Paul Ekanga"
                  className="w-full bg-transparent outline-none"
                />
              </Field>
              <Field icon={Phone} label="Numéro WhatsApp">
                <input
                  type="tel"
                  value={patient.phone}
                  onChange={(e) => updP("phone", e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full bg-transparent outline-none"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={Calendar} label="Date de naissance">
                  <input
                    type="date"
                    value={patient.birthdate}
                    onChange={(e) => updP("birthdate", e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
                <Field icon={MapPin} label="Ville">
                  <select
                    value={patient.city}
                    onChange={(e) => updP("city", e.target.value)}
                    className="w-full bg-transparent outline-none"
                  >
                    {["Douala", "Yaoundé", "Bafoussam", "Garoua", "Bamenda", "Maroua", "Autre"].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </Field>
              </div>

              <Consent
                checked={patient.consent}
                onChange={(v) => updP("consent", v)}
                label={
                  <>
                    J'accepte que SmartSanté Cameroun traite mes données de santé conformément à la{" "}
                    <a href="#" className="font-semibold text-primary hover:underline">
                      politique de confidentialité
                    </a>
                    .
                  </>
                }
              />

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
              >
                Créer mon compte et recevoir le code <ArrowRight className="size-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={submitMedecin} className="mt-8 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={User} label="Nom complet">
                  <input
                    value={medecin.name}
                    onChange={(e) => updM("name", e.target.value)}
                    placeholder="Dr. Nguemo Marie"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
                <Field icon={Phone} label="Téléphone">
                  <input
                    type="tel"
                    value={medecin.phone}
                    onChange={(e) => updM("phone", e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
              </div>
              <Field icon={Mail} label="E-mail professionnel">
                <input
                  type="email"
                  value={medecin.email}
                  onChange={(e) => updM("email", e.target.value)}
                  placeholder="dr.nguemo@hopital.cm"
                  className="w-full bg-transparent outline-none"
                />
              </Field>
              <Field icon={Lock} label="Mot de passe">
                <input
                  type="password"
                  value={medecin.password}
                  onChange={(e) => updM("password", e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full bg-transparent outline-none"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={Briefcase} label="Spécialité">
                  <select
                    value={medecin.speciality}
                    onChange={(e) => updM("speciality", e.target.value)}
                    className="w-full bg-transparent outline-none"
                  >
                    {SPECIALITES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field icon={Building2} label="Hôpital / Clinique">
                  <input
                    value={medecin.hospital}
                    onChange={(e) => updM("hospital", e.target.value)}
                    placeholder="Hôpital Laquintinie, Douala"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
              </div>

              <Consent
                checked={medecin.consent}
                onChange={(v) => updM("consent", v)}
                label={
                  <>
                    Je certifie l'exactitude de mes informations et j'accepte la{" "}
                    <a href="#" className="font-semibold text-primary hover:underline">
                      charte des médecins partenaires
                    </a>
                    .
                  </>
                }
              />

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
              >
                Soumettre ma candidature <ArrowRight className="size-4" />
              </button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <ShieldCheck className="size-7 text-primary" />
            {tab === "patient" ? (
              <>
                <h3 className="mt-4 font-display text-lg font-bold">Pourquoi un compte&nbsp;?</h3>
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
                <h3 className="mt-4 font-display text-lg font-bold">
                  Avantages médecin partenaire
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>• Fiches patients pré-remplies par l'IA diagnostique</li>
                  <li>• Téléconsultation vidéo intégrée et sécurisée</li>
                  <li>• Agenda intelligent synchronisé avec WhatsApp</li>
                  <li>• Statistiques épidémiologiques de votre zone</li>
                </ul>
                <p className="mt-6 rounded-xl bg-accent p-4 text-xs text-accent-foreground">
                  Votre numéro d'ordre des médecins du Cameroun vous sera demandé lors de la
                  vérification de votre dossier.
                </p>
              </>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
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
  );
}

function Consent({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-primary"
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </label>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{children}</p>
  );
}
export default SignupPage