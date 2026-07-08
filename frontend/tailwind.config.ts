import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#050505",
          light: "#f5f5f5"
        },
        card: {
          dark: "#111111",
          light: "#ffffff"
        },
        f1: {
          red: "#ff1e1e",
          accent: "#ff4d4d",
          lightRed: "#d90429",
          lightAccent: "#ef233c"
        },
        border: {
          dark: "rgba(255, 255, 255, 0.08)",
          light: "rgba(0, 0, 0, 0.08)"
        },
        text: {
          primaryDark: "#ffffff",
          secondaryDark: "#aaaaaa",
          primaryLight: "#111111",
          secondaryLight: "#555555"
        }
      },
      fontFamily: {
        telemetry: ["var(--font-telemetry)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink-glow": "blinkGlow 1.5s ease-in-out infinite",
        "progress-flow": "progressFlow 2s linear infinite"
      },
      keyframes: {
        blinkGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 10px rgba(255, 30, 30, 0.6)" },
          "50%": { opacity: "0.4", boxShadow: "0 0 2px rgba(255, 30, 30, 0.2)" }
        },
        progressFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      }
    },
  },
  plugins: [],
};

export default config;
