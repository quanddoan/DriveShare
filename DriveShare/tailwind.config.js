/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path if your file structure is different
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#EDF6F7'
      },
    },
  },
  plugins: [],
}

