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
        deal: {
          DEFAULT: 'rgb(var(--c-deal) / <alpha-value>)',
          ink: 'rgb(var(--c-deal-ink) / <alpha-value>)',
        },
        line: 'rgb(var(--c-line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-accent-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        // Single typeface for now — `display` is kept as an alias so the existing
        // `font-display` usages remain the seam for reintroducing a second face.
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(15 23 42 / 0.06), 0 8px 24px rgb(15 23 42 / 0.08)',
        lift: '0 18px 40px rgb(15 23 42 / 0.16)',
      },
      borderRadius: {
        // 16px is the site-wide standard; both keys resolve to it so the
        // panel/control distinction stays available if it's ever reinstated.
        control: '0.875rem',
        panel: '1.25rem',
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
