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
        '2xl': '1440px',
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
        line: {
          DEFAULT: 'rgb(var(--c-line) / <alpha-value>)',
          soft: 'rgb(var(--c-line-soft) / <alpha-value>)',
          strong: 'rgb(var(--c-line-strong) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-accent-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        // One face throughout. Jost is a geometric grotesk that holds up at
        // both the very wide uppercase tracking this template leans on and at
        // light weights for display type — the Romans International voice.
        display: ['Jost', 'system-ui', 'sans-serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        // Deliberately faint. On white, a heavy shadow reads as grubby, so
        // elevation is carried by hairlines and only hinted at on hover.
        lift: '0 18px 40px -24px rgb(10 10 10 / 0.35)',
        panel: '0 32px 80px -48px rgb(10 10 10 / 0.45)',
      },
      borderRadius: {
        // Fully square. Template 02 kept 2px; 03 removes radii entirely so
        // every edge in the layout lines up on the same orthogonal grid.
        control: '0px',
        panel: '0px',
      },
      letterSpacing: {
        micro: '0.24em',
        wordmark: '0.42em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        prose: '64ch',
      },
    },
  },
  plugins: [],
}
