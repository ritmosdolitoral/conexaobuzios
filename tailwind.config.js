/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Cores customizadas do projeto Conexão Búzios
      colors: {
        'buzios-ocean': {
          'deep': '#0a3d5c',
          'medium': '#1e6b96', 
          'light': '#2980b9'
        },
        'buzios-turquoise': '#17a2b8',
        'buzios-sand': {
          'warm': '#f4e6d3',
          'medium': '#e8d5b7'
        },
        'buzios-gold': '#ffd700',
        'buzios-green': '#20c997',
        'buzios-lilac': '#a78bfa'
      },
      // Fontes customizadas
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      // Animações customizadas
      animation: {
        'float': 'float 25s infinite linear',
        'pulse-cursor': 'pulse-cursor 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop-in': 'pop-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'fade-in-up': 'fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-up': 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'hero-slide-in': 'heroSlideIn 1s ease-out',
        'feature-slide-in': 'featureSlideIn 0.6s ease-out forwards',
        'card-slide-in': 'cardSlideIn 0.6s ease-out',
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1.4s infinite ease-in-out both',
        'success-pulse': 'successPulse 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      },
      // Keyframes para animações
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0.15' },
          '100%': { transform: 'translateY(-100vh) translateX(20vw)', opacity: '0' }
        },
        'pulse-cursor': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(1.1)' }
        },
        'pop-in': {
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInUp: {
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        heroSlideIn: {
          'from': { opacity: '0', transform: 'translateY(-30px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        featureSlideIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        cardSlideIn: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' }
        },
        successPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounce: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%': { transform: 'scale(1.0)', opacity: '1' }
        }
      },
      // Sombras customizadas
      boxShadow: {
        'card': '0 8px 32px rgba(10, 61, 92, 0.3)',
        'card-hover': '0 12px 48px rgba(10, 61, 92, 0.4)',
        'button': '0 4px 16px rgba(41, 128, 185, 0.3)',
        'floating': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'glass': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      // Backdrop blur customizado
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px'
      },
      // Espaçamentos responsivos
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      // Larguras máximas responsivas
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      // Transições suaves
      transitionDuration: {
        '400': '400ms',
        '600': '600ms'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    },
    // Configurações responsivas personalizadas
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px'
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Plugin customizado para utilitários específicos do projeto
    function({ addUtilities, addComponents, theme }) {
      // Utilitários para glassmorphism
      addUtilities({
        '.glass-effect': {
          'background': 'rgba(29, 107, 150, 0.25)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(244, 230, 211, 0.2)'
        },
        '.glass-surface': {
          'background': 'rgba(29, 107, 150, 0.15)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(244, 230, 211, 0.1)'
        }
      });
      
      // Componentes reutilizáveis
      addComponents({
        '.btn-primary': {
          'background': 'linear-gradient(135deg, #17a2b8, #1e6b96)',
          'color': '#fdfcfa',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.75rem',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          'box-shadow': '0 4px 16px rgba(23, 162, 184, 0.3)',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 6px 20px rgba(23, 162, 184, 0.4)'
          }
        },
        '.card-base': {
          'background': 'rgba(29, 107, 150, 0.25)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(244, 230, 211, 0.2)',
          'border-radius': '1.25rem',
          'box-shadow': '0 8px 32px rgba(10, 61, 92, 0.3)',
          'transition': 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }
      });
    }
  ],
  // Otimização para produção
  corePlugins: {
    preflight: true,
  },
  // Configuração para modo escuro
  darkMode: 'class'
}