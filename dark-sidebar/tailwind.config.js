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
        line: {
          DEFAULT: 'rgb(var(--c-line) / <alpha-value>)',
          soft: 'rgb(var(--c-line-soft) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--c-accent-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        // DM Sans carries display type — a clean geometric grotesk for
        // headings, distinct from Work Sans' body-copy grade even though
        // both are sans faces, giving the pairing contrast without a serif.
        display: ['DM Sans', 'system-ui', 'sans-serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        // Used sparingly — only where a panel genuinely floats over content
        // (menus, drawers). Flat panels rely on borders instead.
        lift: '0 24px 60px rgb(0 0 0 / 0.55)',
      },
      borderRadius: {
        // Near-square geometry is the main structural difference from
        // template 01's 16px radius.
        control: '2px',
        panel: '2px',
      },
      letterSpacing: {
        micro: '0.22em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        prose: '66ch',
      },
    },
  },
  plugins: [],
}
