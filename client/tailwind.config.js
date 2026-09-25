/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olympus: {
          bg: "#050811",
          card: "#090F20",
          cardHover: "#0E1833",
          border: "#1E294B",
          borderGlow: "#00F0FF33",
          blue: {
            DEFAULT: "#0066FF",
            glow: "#00D2FF",
            dark: "#003EB3",
            light: "#3385FF",
          },
          cyan: {
            DEFAULT: "#00F0FF",
            muted: "#0891B2",
            accent: "#67E8F9",
          },
          silver: "#94A3B8",
          metallic: "#CBD5E1",
          violet: "#4F46E5",
          danger: "#EF4444",
          success: "#10B981",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        tech: ['Rajdhani', 'Orbitron', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 240, 255, 0.25)',
        'blue-glow': '0 0 30px -5px rgba(0, 102, 255, 0.35)',
        'card-glow': '0 4px 20px -2px rgba(0, 102, 255, 0.15)',
      },
      backgroundImage: {
        'circuit-pattern': "radial-gradient(circle at 50% 50%, rgba(0, 102, 255, 0.08) 0%, transparent 70%)",
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
