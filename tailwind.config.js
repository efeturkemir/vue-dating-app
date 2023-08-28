/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/views/*", "./src/components/*" ],
  theme: {
    extend: {
      colors: {
        crimson: '#DC143C', // Replace this with the desired shade of crimson red
      },
    },
  },
  plugins: [],
}

