/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hacker: {
          green: '#00ff41',
          cyan: '#00f3ff',
          dark: '#0a0a0a',
        }
      }
    },
  },
  plugins: [],
}
