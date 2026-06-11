/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0D0D12', // Deepest background (Obsidian)
          900: '#13131A', // Surface
          800: '#181820', // Border/Elevated
        },
        game: {
          gold: '#FBBF24',
          purple: '#8B5CF6',
          emerald: '#10B981',
          crimson: '#EF4444',
        }
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(to bottom right, #0A0F1C, #111827)',
      }
    },
  },
  plugins: [],
}
