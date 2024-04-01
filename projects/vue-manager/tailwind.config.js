/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,json}"],
  theme: {
    extend: {
      backgroundColor: {
        base: "var(--bg-base)",
        secondary: "var(--bg-secondary)",
      },
      textColor: {
        base: "var(--text-base)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
