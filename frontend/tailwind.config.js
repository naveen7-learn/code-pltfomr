export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "monospace"]
      },
      colors: {
        base: {
          950: "#020617",
          900: "#0f172a",
          800: "#162033"
        },
        accent: {
          500: "#38bdf8",
          400: "#67e8f9",
          300: "#7dd3fc"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,189,248,0.15), 0 24px 80px rgba(14,165,233,0.22)"
      },
      backgroundImage: {
        "grid-overlay":
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
};
