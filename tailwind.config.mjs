/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Swiss-Bento Palette (Mapped to CSS Variables)
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          light: 'var(--color-subtle)',
        },
        subtle: 'var(--color-subtle)',
        'border-line': 'var(--color-border)',
        
        // Brand Accents
        'brand-neon': 'var(--color-brand-neon)',
        'brand-orange': 'var(--color-brand-orange)',
        
        // Inverse Tokens
        'inv-canvas': 'var(--color-inv-canvas)',
        'inv-ink': 'var(--color-inv-ink)',
        
        // Semantic aliases
        primary: {
          DEFAULT: 'var(--color-ink)',
          dark: 'var(--color-canvas)'
        },
        muted: {
          DEFAULT: 'var(--color-subtle)',
          dark: '#A1A1AA'
        },
        accent: {
          DEFAULT: 'var(--color-brand-neon)',
          green: 'var(--color-brand-orange)',
          dark: 'var(--color-brand-neon)'
        },
        
        // JLPT Colors
        jlpt: {
          n5: '#22C55E',
          n4: '#3B82F6',
          n3: '#A855F7',
          n2: '#F97316',
          n1: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
        display: ['"Helvetica Now Display"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        'none': '0px',
        'sm': '2px',
        'md': '4px',
        'lg': '4px', 
        'xl': '4px',
        '2xl': '4px',
        '3xl': '4px',
        'full': '9999px', // Keep full for circles
      },
      boxShadow: {
        'none': 'none',
        'soft': 'none', // Remove soft shadows
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
