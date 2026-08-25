/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wayland: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        chrome: {
          light: '#e8e8e8',
          DEFAULT: '#c0c0c0',
          dark: '#808080',
        },
        steel: {
          light: '#b8c5d6',
          DEFAULT: '#8a9aad',
          dark: '#5c6d7e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
      },
      // Article body typography, mapped onto the existing chrome/wayland palette.
      // The plugin defaults are light-mode and would fight the site, so every
      // prose colour token is set explicitly here.
      // Article body typography, mapped onto the existing chrome/steel palette.
      // Accent furniture uses `steel` rather than violet: violet stays as ambient
      // atmosphere (orb, grid, button glow) and never as body-copy colour.
      typography: () => ({
        automa: {
          css: {
            '--tw-prose-body': 'rgb(192 192 192 / 0.75)',
            '--tw-prose-headings': '#e8e8e8',
            '--tw-prose-lead': 'rgb(192 192 192 / 0.7)',
            '--tw-prose-links': '#b8c5d6',
            '--tw-prose-bold': '#e8e8e8',
            '--tw-prose-counters': 'rgb(192 192 192 / 0.65)',
            '--tw-prose-bullets': 'rgb(138 154 173 / 0.6)',
            '--tw-prose-hr': 'rgb(255 255 255 / 0.1)',
            '--tw-prose-quotes': '#e8e8e8',
            '--tw-prose-quote-borders': 'rgb(138 154 173 / 0.5)',
            '--tw-prose-captions': 'rgb(192 192 192 / 0.65)',
            '--tw-prose-code': '#e8e8e8',
            '--tw-prose-pre-code': 'rgb(192 192 192 / 0.85)',
            '--tw-prose-pre-bg': 'rgb(15 23 42 / 0.5)',
            '--tw-prose-th-borders': 'rgb(255 255 255 / 0.15)',
            '--tw-prose-td-borders': 'rgb(255 255 255 / 0.08)',
            maxWidth: 'none',
            a: {
              color: 'var(--tw-prose-links)',
              textDecorationColor: 'rgb(138 154 173 / 0.4)',
              textUnderlineOffset: '3px',
              transition: 'color 200ms',
              '&:hover': { color: '#e8e8e8' },
            },
            // Weight 500 rather than the plugin's 700: the rest of the site
            // carries heading hierarchy by size at weight 400, and bold section
            // headings inside an article were the last thing still shouting.
            // 500 keeps them scannable in two thousand words of prose without
            // breaking the family.
            'h2, h3, h4': {
              fontWeight: '500',
              letterSpacing: '-0.01em',
              scrollMarginTop: '6rem',
            },
            // The autolink anchor inherits `font-weight: inherit` below, so the
            // weight has to be set on the anchor too or the plugin's bold wins.
            'h2 a, h3 a, h4 a': { fontWeight: '500' },
            // rehype-autolink-headings wraps heading text in an anchor. Without
            // this the heading inherits the link colour instead of its own.
            'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a': {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'inherit',
            },
            blockquote: {
              fontStyle: 'italic',
              fontWeight: '400',
            },
            code: {
              backgroundColor: 'rgb(30 41 59 / 0.6)',
              padding: '0.15em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            'pre code': { backgroundColor: 'transparent', padding: '0' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
