/** @type {import('tailwindcss').Config} */
export default {
  // Bu kısım, Tailwind'in hangi dosyalarda class arayacağını belirtir. Mevcut yapını koruyor.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. RENK TANIMLARI
      colors: {
        // Senin App.css dosyasındaki değişkenlere karşılık gelen renkler
        'dark-body': '#050505',
        'text-main': '#ffffff',
        'text-muted': '#a1a1aa',
        'brand-blue': '#007aff',       // Senin --primary rengin
        'whatsapp': '#25D366',         // WhatsApp rengi
        'glass-bg-dark': 'rgba(20, 20, 25, 0.7)',
        'glass-border-dark': 'rgba(255, 255, 255, 0.08)',
      },
      
      // 2. GÖLGE TANIMLARI (Neon & Glass Efekti)
      boxShadow: {
        // Neon Glow Efektleri
        'neon-blue': '0 0 20px rgba(0, 122, 255, 0.6)',
        'neon-green': '0 0 20px rgba(37, 211, 102, 0.6)',
        // Glass Card Hover Efekti (App.css'ten alındı)
        'glass': '0 15px 40px rgba(0, 0, 0, 0.5)',
      },
      
      // 3. ANİMASYON TANIMLARI (Preloader için)
      animation: {
        'glow-pulse': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // 4. KEYFRAMES (Animasyonun nasıl çalıştığı)
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)', 
            filter: 'brightness(1)',
            // Text Shadow ile neon rengini daha belirgin yapıyoruz
            textShadow: '0 0 10px rgba(0,122,255,0.5)', 
          },
          '50%': { 
            opacity: '.8', 
            transform: 'scale(1.1)', 
            filter: 'brightness(1.5)',
            textShadow: '0 0 25px rgba(0,122,255,0.9)', 
          },
        }
      }
    },
    
    // Montserrat fontunu varsayılan yapıyoruz (Senin Navbar.css ve App.css'teki gibi)
    fontFamily: {
      sans: ['Montserrat', 'Inter', 'sans-serif'],
    }
  },
  
  // Bu ayar, Tailwind'in Glass efektini desteklemesi için kritik
  corePlugins: {
    backdropFilter: true,
  },
  
  plugins: [],
}