/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",

        primary: "var(--primary)",

        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        muted: "var(--muted)",
      },
    },
  },
  plugins: [],
};
