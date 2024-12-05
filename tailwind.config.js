/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", 
            "./app/**/*.{js,jsx,ts,tsx}",
            "./app/(tabs)/**/*.{js,jsx,ts,tsx}",
            ".components/**/*.{js,jsx,ts,tsx}",
          ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        DMSans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

