export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      colors: {
        neutral: {
          950: "#05070c",
          925: "#090d14",
          900: "#0d1117",
          875: "#131a24",
          850: "#18202b",
          800: "#1f2937",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f8fafc"
        },
        accent: {
          50: "#f5f7ff",
          100: "#e9eeff",
          200: "#cfd9ff",
          300: "#aabfff",
          400: "#7f9bff",
          500: "#5c7cff",
          600: "#4762f0",
          700: "#364bcf",
          800: "#2a39a2",
          900: "#1f2a78"
        }
      },
      boxShadow: {
        "soft-glow": "0 0 0 1px rgba(148,163,184,0.10), 0 18px 60px rgba(2,6,23,0.48)",
        subtle: "0 10px 30px rgba(2,6,23,0.18)",
        "sm-glow": "0 0 0 1px rgba(148,163,184,0.08)",
        panel: "0 24px 80px rgba(2,6,23,0.45)"
      },
      backgroundImage: {
        "subtle-grid":
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(circle at top, rgba(92,124,255,0.22), transparent 38%), radial-gradient(circle at 85% 10%, rgba(14,165,233,0.12), transparent 30%)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" }
        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
