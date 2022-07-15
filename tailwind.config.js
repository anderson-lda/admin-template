/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', //'media' para dark como default onde estiver desclarado; 'false' para desativar
  theme: {
    extend: {},
  },
  plugins: [],
}
