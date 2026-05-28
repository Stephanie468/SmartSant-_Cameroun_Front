import {  Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Stethoscope, MessageCircle, ArrowRight, Phone, User, Mail, Lock } from "lucide-react";



function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"patient" | "medecin">("patient");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePatient = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = phone.replace(/\s+/g, "");
    if (!/^\+?\d{8,15}$/.test(cleaned)) {
      setError("Numéro invalide. Format : +237 6XX XXX XXX");
      return;
    }
    if (name.trim().length < 2) {
      setError("Veuillez renseigner votre nom complet.");
      return;
    }
    sessionStorage.setItem("smartsante.otp", JSON.stringify({ phone: cleaned, name: name.trim() }));
    navigate( "/verification");
  };

  const handleMedecin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Adresse e-mail invalide.");
      return;
    }
    if (password.length < 6) {
      setError("Mot de passe trop court (6 caractères minimum).");
      return;
    }
    navigate("/medecin" );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Brand panel */}
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
                  prescriptions. Pas encore de compte&nbsp;? Vous pouvez utiliser le chatbot
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
                  planning de consultations et lancez vos téléconsultations sécurisées
                  depuis un seul tableau de bord.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/85">
                  <li>• File d'attente intelligente priorisée par urgence</li>
                  <li>• Téléconsultation vidéo HD et ordonnances numériques</li>
                  <li>• Données épidémiologiques en temps réel</li>
                </ul>
              </>
            )}
          </div>

          <p className="text-xs text-white/70">© 2026 SmartSanté Cameroun · Au service de la santé pour tous.</p>
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-96 rounded-full bg-white/10 blur-3xl" />
        </div>


        {/* Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
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

            <div className="mt-8 inline-flex rounded-xl border border-border bg-card p-1">
              {(["patient", "medecin"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setError("");
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t === "patient" ? "Patient" : "Médecin"}
                </button>
              ))}
            </div>

            {tab === "patient" ? (
              <form onSubmit={handlePatient} className="mt-6 space-y-4">
                <Field icon={User} label="Nom complet">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean-Paul Ekanga"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
                <Field icon={Phone} label="Numéro WhatsApp">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
                <p className="text-xs text-muted-foreground">
                  Un code de vérification à 6 chiffres vous sera envoyé via WhatsApp.
                </p>
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <SubmitBtn>
                  Recevoir le code WhatsApp <ArrowRight className="size-4" />
                </SubmitBtn>
                <p className="text-center text-sm text-muted-foreground">
                  Première visite&nbsp;?{" "}
                  <Link to="/inscription" className="font-semibold text-primary hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleMedecin} className="mt-6 space-y-4">
                <Field icon={Mail} label="E-mail professionnel">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.nguemo@hopital.cm"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
                <Field icon={Lock} label="Mot de passe">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none"
                  />
                </Field>
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <SubmitBtn>
                  Accéder au dashboard <ArrowRight className="size-4" />
                </SubmitBtn>
                <p className="text-center text-sm text-muted-foreground">
                  Pas encore partenaire&nbsp;?{" "}
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

function SubmitBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
    >
      {children}
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{children}</p>
  );
}

export default  LoginPage
