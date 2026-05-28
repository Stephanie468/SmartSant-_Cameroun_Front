import {  Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Stethoscope, ArrowRight, RotateCcw } from "lucide-react";



function VerificationPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(45);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("smartsante.otp");
    if (!raw) {
      navigate("/login" );
      return;
    }
    try {
      const { phone } = JSON.parse(raw);
      setPhone(phone);
    } catch {
      navigate("/login" );
    }
  }, [navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setCode(text.split(""));
      inputs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otp = code.join("");
    if (otp.length !== 6) return setError("Veuillez saisir les 6 chiffres.");
    // Mock: any 6 digits accepted. (123456 in prod for demo.)
    sessionStorage.removeItem("smartsante.otp");
    sessionStorage.setItem("smartsante.session", JSON.stringify({ phone, ts: Date.now() }));
    navigate("/patient");
  };

  const maskedPhone = phone.replace(/(\+?\d{3})(\d+)(\d{2})/, (_, a, b, c) => `${a}${"•".repeat(b.length)}${c}`);

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
        <p className="mt-3 text-sm text-muted-foreground">
          Nous avons envoyé un code à 6 chiffres au
          <br />
          <span className="font-semibold text-foreground">{maskedPhone || phone}</span> via WhatsApp.
        </p>

        <form onSubmit={submit} className="mt-10 w-full">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                inputMode="numeric"
                maxLength={1}
                className="size-12 rounded-xl border border-input bg-card text-center font-display text-xl font-bold outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 md:size-14 md:text-2xl"
              />
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
          >
            Vérifier et continuer <ArrowRight className="size-4" />
          </button>
        </form>

        <button
          disabled={seconds > 0}
          onClick={() => {
            setSeconds(45);
            setCode(Array(6).fill(""));
          }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary disabled:opacity-60"
        >
          <RotateCcw className="size-4" />
          {seconds > 0 ? `Renvoyer dans ${seconds}s` : "Renvoyer le code"}
        </button>

        <p className="mt-10 text-xs text-muted-foreground">
          Démo : saisissez 6 chiffres au choix pour accéder à l'espace patient.
        </p>
      </main>
    </div>
  );
}

export default VerificationPage
