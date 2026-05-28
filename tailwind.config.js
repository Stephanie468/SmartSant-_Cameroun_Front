/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background:  "var(--background)",
        foreground:  "var(--foreground)",
        surface:     "var(--surface)",
        "surface-soft": "var(--surface-soft)",
        whatsapp:    "var(--whatsapp)",
        border:      "var(--border)",
        input:       "var(--input)",
        ring:        "var(--ring)",
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT:    "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT:    "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
      },
      borderRadius: {
        sm:    "calc(var(--radius) - 4px)",
        md:    "calc(var(--radius) - 2px)",
        lg:    "var(--radius)",
        xl:    "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 oklch(0 0 0 / 0.04), 0 1px 3px 0 oklch(0 0 0 / 0.04)",
        lift: "0 10px 30px -10px oklch(0 0 0 / 0.12)",
      },
    },
  },
  plugins: [],
}