import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A0F1E",
          2: "#0F1629",
          3: "#151E38",
        },
        brand: {
          blue: "#2563EB",
          cyan: "#00D4FF",
          cyan2: "#00AACF",
        },
        slate: {
          custom: "#94A3B8",
          2: "#64748B",
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 32px rgba(0,212,255,0.15)",
        "glow-sm": "0 0 16px rgba(0,212,255,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
