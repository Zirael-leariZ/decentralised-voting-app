module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors
        background: '#ffffff', // Default background color
        foreground: '#000000', // Default text color
        brand: '#2563eb',     // Brand color (blue-600)
      },
    },
  },
  plugins: [],
}