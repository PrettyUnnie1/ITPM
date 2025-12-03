/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-purple": "#6366F1",
        "brand-indigo": "#818CF8",
        "neutral-dark": "#1F2937",
        "neutral-medium": "#6B7280",
        "neutral-light": "#F3F4F6",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
