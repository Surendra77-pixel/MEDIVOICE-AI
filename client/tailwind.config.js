/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo 600
          container: '#6366f1',
          fixed: '#e0e7ff',
          on: '#ffffff',
          'on-container': '#312e81'
        },
        secondary: {
          DEFAULT: '#0ea5e9', // Sky 500
          container: '#38bdf8',
          fixed: '#e0f2fe',
          on: '#ffffff',
          'on-container': '#0c4a6e'
        },
        tertiary: {
          DEFAULT: '#f43f5e', // Rose 500
          container: '#fb7185',
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
        },
        doctor: {
          DEFAULT: '#4f46e5', // Same as primary
          dark: '#4338ca',
          light: '#6366f1'
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
      },
      maxWidth: {
        'container-max': '1440px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
