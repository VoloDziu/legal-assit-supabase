/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/app/*.{html,ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "night"],
    darkTheme: "night",
  },
};
