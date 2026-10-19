/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--c-ink-muted) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--c-paper) / <alpha-value>)',
          soft: 'rgb(var(--c-paper-soft) / <alpha-value>)',
          sink: 'rgb(var(--c-paper-sink) / <alpha-value>)',
        },
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          hover: 'rgb(var(--c-accent-hover) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-accent-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        // One typeface throughout; `display` is the seam for adding a second face.
        display: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(13 24 48 / 0.06), 0 6px 18px rgb(13 24 48 / 0.07)',
        lift: '0 14px 32px rgb(13 24 48 / 0.14)',
      },
      borderRadius: {
        // A marketplace reads as tidy and exact, so corners stay tight.
        control: '0.5rem',
        panel: '0.75rem',
      },
      letterSpacing: {
        micro: '0.18em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
