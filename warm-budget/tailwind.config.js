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
          inverse: 'rgb(var(--c-ink-inverse) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--c-paper) / <alpha-value>)',
          soft: 'rgb(var(--c-paper-soft) / <alpha-value>)',
          sink: 'rgb(var(--c-paper-sink) / <alpha-value>)',
          dark: 'rgb(var(--c-paper-dark) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--c-line) / <alpha-value>)',
          soft: 'rgb(var(--c-line-soft) / <alpha-value>)',
          strong: 'rgb(var(--c-line-strong) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          strong: 'rgb(var(--c-accent-strong) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          wash: 'rgb(var(--c-accent-wash) / <alpha-value>)',
          ink: 'rgb(var(--c-accent-ink) / <alpha-value>)',
        },
        highlight: {
          DEFAULT: 'rgb(var(--c-highlight) / <alpha-value>)',
          wash: 'rgb(var(--c-highlight-wash) / <alpha-value>)',
          ink: 'rgb(var(--c-highlight-ink) / <alpha-value>)',
        },
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
      },
      fontFamily: {
        // Two faces, unlike template 03's single grotesk. Poppins is the
        // friendly geometric that carries the headings and the prices;
        // Inter does the reading, because Poppins at body size in long
        // paragraphs is wide and tiring.
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        // Small and soft. On cream a card needs just enough shadow to sit
        // rather than float — the hairline does most of the separating.
        card: '0 1px 2px rgb(26 32 31 / 0.04), 0 4px 12px -6px rgb(26 32 31 / 0.10)',
        'card-hover': '0 2px 4px rgb(26 32 31 / 0.05), 0 10px 24px -12px rgb(26 32 31 / 0.18)',
        bar: '0 8px 24px -16px rgb(26 32 31 / 0.35)',
      },
      borderRadius: {
        // The inverse of template 03: everything is generously rounded,
        // and every button is a full pill.
        control: '9999px',
        tile: '0.875rem',
        panel: '1.25rem',
        block: '2rem',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        // The only keyframe in the template, and it is not decorative:
        // skeletons need to read as "loading" rather than as "empty".
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
