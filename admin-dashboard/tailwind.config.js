/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      },
      colors: {
        canvas: '#F6F6F3',
        card: '#FFFFFF',
        surface: '#F0F1EC',
        border: {
          DEFAULT: '#DCDDD7',
          light: '#EAEBE6',
          dark: '#CBCDC5',
        },
        content: {
          primary: '#30332F',
          secondary: '#6B706A',
          muted: '#8A8F89',
        },
        finance: {
          green: '#5F7563',
          'green-dark': '#4D6151',
          'green-light': '#E9EFEA',
          olive: '#7C8768',
          'olive-light': '#EFF2EA',
          amber: '#A78655',
          'amber-light': '#F6EFE5',
          red: '#A96861',
          'red-light': '#F8EDEB',
        },
        sidebar: {
          bg: '#F3F4F0',
          text: '#59605A',
          'active-bg': '#E3EAE3',
          'active-text': '#526A57',
          border: '#DCDDD7',
        },
        // Backwards compatibility mappings for primary and accent
        primary: {
          50: '#F4F7F4',
          100: '#E3EAE3',
          200: '#CAD7CC',
          300: '#A6BBA9',
          400: '#7E9C83',
          500: '#5F7563',
          600: '#526A57',
          700: '#435647',
          800: '#38463B',
          900: '#30332F',
        },
        accent: {
          50: '#F8FAF6',
          100: '#EFF2EA',
          200: '#DFE5D5',
          300: '#C2CEB1',
          400: '#9FB18B',
          500: '#7C8768',
          600: '#687256',
          700: '#535A45',
          800: '#434939',
          900: '#30332F',
        }
      }
    },
  },
  plugins: [],
}
