/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0f0f11",
        surface: "#18181b",
        border: "#27272a",
        accent: "#6366f1",
        "accent-hover": "#4f46e5",
        muted: "#a1a1aa",
        danger: "#f87171",
        success: "#4ade80",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
