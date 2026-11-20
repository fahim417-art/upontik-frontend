import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F3EBDD",
          light: "#FAF6F0",
          dark: "#E8DECD",
        },
        charcoal: {
          DEFAULT: "#211D1A",
          light: "#35302C",
          muted: "#5A544E",
          deep: "#141110",
        },
        earth: {
          DEFAULT: "#80644B",
          light: "#9B7D60",
          dark: "#654F3A",
        },
        mustard: {
          DEFAULT: "#B87932",
          light: "#CE8C45",
          dark: "#9E6426",
        },
        sand: {
          DEFAULT: "#D7C7AE",
          light: "#E5DAC7",
          dark: "#C3B194",
        },
        night: {
          base: "#0E0C0A",
          surface: "#171411",
          card: "#1E1A16",
          border: "#2C2620",
          text: "#F5EFE8",
          muted: "#A39789",
          gold: "#D49542",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-dmsans)", "DM Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(33, 29, 26, 0.04)",
        luxury: "0 10px 30px -10px rgba(33, 29, 26, 0.08)",
        elevated: "0 20px 40px -15px rgba(33, 29, 26, 0.12)",
        glow: "0 0 25px rgba(184, 121, 50, 0.2)",
      },
      letterSpacing: {
        editorial: "0.08em",
        wideDisplay: "0.18em",
        widestEditorial: "0.25em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
