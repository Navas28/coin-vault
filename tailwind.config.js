/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
      },
      colors: {
        vault: {
          navy: "#284b5c",
          emerald: "#519892",
          accent: "#aeddd5",
        },
      },
    },
  },
  plugins: [],
};
