/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003d9b',
          container: '#0052cc',
          fixed: '#dae2ff',
          on: '#ffffff',
          'on-container': '#c4d2ff'
        },
        secondary: {
          DEFAULT: '#00687b',
          container: '#50dcff',
          fixed: '#afecff',
          on: '#ffffff',
          'on-container': '#005f71'
        },
        tertiary: {
          DEFAULT: '#7b2600',
          container: '#a33500',
          on: '#ffffff'
        },
        surface: {
          DEFAULT: '#f8f9fb',
          dim: '#d9dadc',
          bright: '#f8f9fb',
          container: {
            lowest: '#ffffff',
            low: '#f3f4f6',
            DEFAULT: '#edeef0',
            high: '#e7e8ea',
            highest: '#e1e2e4'
          },
          variant: '#e1e2e4'
        },
        'on-surface': '#191c1e',
        'on-surface-variant': '#434654',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f3',
        outline: {
          DEFAULT: '#737685',
          variant: '#c3c6d6'
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          on: '#ffffff'
        }
      },
      fontFamily: {
        h: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      spacing: {
        'xs': '4px',
        'base': '8px',
        'sm': '12px',
        'md': '24px',
        'lg': '48px',
        'xl': '80px',
        'gutter': '24px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
