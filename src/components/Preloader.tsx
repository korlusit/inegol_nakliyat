import React from 'react';
// Büyük logoyu import et
import logoLarge from '../assets/logo-lg.png'; 

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-dark-body">
      
      {/* Kamyon ikonu yerine Büyük Logo */}
      <div className="mb-5 animate-glow-pulse">
        <img 
          src={logoLarge} 
          alt="Yükleniyor..." 
          className="w-48 md:w-64 object-contain drop-shadow-[0_0_15px_rgba(0,122,255,0.5)]" 
        />
      </div>
      
      {/* Yazı (İstersen silebilirsin, logo varsa gerek kalmayabilir) */}
      <div className="font-['Montserrat'] text-xl font-semibold tracking-[3px] text-white">
        YÜKLENİYOR...
      </div>
    </div>
  );
};

export default Preloader;