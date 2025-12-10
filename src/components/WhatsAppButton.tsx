// src/components/WhatsAppButton.tsx

import React from 'react';
import { RiWhatsappLine } from 'react-icons/ri';
import { useData } from '../context/DataContext'; // Admin verisini çekeceğimiz yer

const WhatsAppButton: React.FC = () => {
  // 1. Admin panelinden (DataContext) genel verileri çekiyoruz
  const { data } = useData();

  // 2. Admin panelinde tanımlı telefonu al, yoksa varsayılanı kullan
  // (data?.general?.phone kontrolü, veri henüz yüklenmediyse hata vermesini engeller)
  const phoneNumber = data?.general?.phone || '905XXXXXXXXXX';

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=Merhaba,%20nakliyat%20hizmetiniz%20hakkında%20bilgi%20almak%20istiyorum.`}
      target="_blank"
      rel="noopener noreferrer"
      // --- STİL VE KONUMLANDIRMA ---
      // fixed left-6: Sola yasla
      // z-[9999]: Dünyadaki en yüksek katman (Navbar'ın üstünde kalır)
      // bottom-[110px]: MOBİLDE navbarın üstüne çıkması için yukarı aldık.
      // md:bottom-8: BİLGİSAYARDA (md ekran ve üstü) estetik durması için aşağı indirdik.
      className="fixed left-6 
                 bottom-[110px] md:bottom-8 
                 z-[9999] 
                 flex items-center justify-center 
                 w-14 h-14 md:w-16 md:h-16 
                 rounded-full bg-[#25D366] text-white 
                 border-2 border-white/20 shadow-[0_0_20px_rgba(37,211,102,0.6)] 
                 transition-transform duration-300 hover:scale-110 hover:brightness-110"
      aria-label="WhatsApp İletişim Hattı"
    >
      <RiWhatsappLine className="text-3xl md:text-4xl" />
    </a>
  );
};

export default WhatsAppButton;