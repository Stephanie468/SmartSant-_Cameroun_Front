// src/components/ModalDiagnostic.tsx
import { useState } from "react"
import { MessageCircle, Copy, Check, X } from "lucide-react"

const TWILIO_SANDBOX_NUMBER = "14155238886"
const MOT_CLE_SANDBOX       = "join choose-real"
const WHATSAPP_URL          = `https://wa.me/${TWILIO_SANDBOX_NUMBER}?text=${encodeURIComponent(MOT_CLE_SANDBOX)}`

export function ModalDiagnostic({ onClose }: { onClose: () => void }) {
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
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-soft">
          <X className="size-5" />
        </button>

        <div className="grid size-14 place-items-center rounded-2xl bg-whatsapp/10 text-whatsapp mx-auto">
          <MessageCircle className="size-7" />
        </div>

        <h2 className="mt-5 text-center font-display text-2xl font-bold">
          Démarrer un diagnostic
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Envoyez ce message sur WhatsApp pour activer le chatbot Smart-Santé :
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface-soft px-4 py-3">
          <code className="flex-1 font-mono text-base font-bold text-foreground">
            {MOT_CLE_SANDBOX}
          </code>
          <button
            onClick={copierMessage}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              copie ? "bg-success/10 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {copie
              ? <><Check className="inline size-3 mr-1" />Copié !</>
              : <><Copy className="inline size-3 mr-1" />Copier</>}
          </button>
        </div>

        <ol className="mt-6 space-y-3">
          {[
            "Copiez le message ci-dessus",
            "Cliquez sur « Ouvrir WhatsApp »",
            "Envoyez le message pour rejoindre le service",
            "Décrivez vos symptômes pour démarrer le diagnostic IA",
          ].map((etape, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {etape}
            </li>
          ))}
        </ol>
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
      </div>
    </div>
  )
}