/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./theme.config.tsx",
  ],
  theme: {
    extend: {
      screens: {
        betterhover: { raw: "(hover: hover)" },
      },
      keyframes: {
        "vert-move": {
          "0%": {
            transform: "translateY(-5px)",
          },
          "50%": {
            transform: "translateY(10px)",
          },
          "100%": {
            transform: "translateY(-5px)",
          },
        },
      },
      animation: {
        "vert-move": "vert-move 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};
