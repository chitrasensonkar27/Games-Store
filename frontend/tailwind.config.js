/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cupcake", "dracula"],   // ← Best light + dark mixed
    darkTheme: "dracula",             // Default starts in dark mode (most users prefer)
  },
}