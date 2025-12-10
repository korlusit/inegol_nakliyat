// src/components/Navbar.tsx

import React, { useState } from 'react';
import './Navbar.css';

// ASSETS IMPORT
import logoSmall from '../assets/logo-sm.png'; 

import { 
  RiHome5Line, RiHome5Fill,
  RiMapPinLine, RiMapPinFill,
  RiPhoneLine, RiPhoneFill,
  RiImage2Line, RiImage2Fill 
} from 'react-icons/ri';

interface NavbarProps {
  onNavigate?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
    if (onNavigate) onNavigate(tabName);
  };

  return (
    <div className="floating-navbar">
      
      {/* 1. PC GÖRÜNÜMÜ */}
      <div className="pc-left-brand">
        <div className="brand-circle flex items-center justify-center bg-transparent border-none shadow-none">
           {/* GÜNCELLEME: 
               p-3   -> Logoyu daha da küçültür (Kenarlardan boşluk bırakır)
               -mt-1 -> Logoyu çok az yukarı çeker
           */}
           <img 
             src={logoSmall} 
             alt="İnegöl Nakliyat" 
             className="w-full h-full object-contain p-3 -mt-1" 
           />
        </div>
        <span className="brand-name">
          İNEGÖL <span className="highlight-text">NAKLİYAT</span>
        </span>
      </div>

      <div className="pc-nav-content">
        <div className="nav-group">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
            {activeTab === 'home' ? <RiHome5Fill /> : <RiHome5Line />}
            <span>Ana Sayfa</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => handleNavClick('gallery')}>
            {activeTab === 'gallery' ? <RiImage2Fill /> : <RiImage2Line />}
            <span>Galeri</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'regions' ? 'active' : ''}`} onClick={() => handleNavClick('regions')}>
            {activeTab === 'regions' ? <RiMapPinFill /> : <RiMapPinLine />}
            <span>Bölgeler</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>
            {activeTab === 'contact' ? <RiPhoneFill /> : <RiPhoneLine />}
            <span>İletişim</span>
          </button>
        </div>
        <button className="btn-quote-pc" onClick={() => handleNavClick('quote')}>FİYAT AL</button>
      </div>


      {/* 2. MOBİL ÜST (MARKA) */}
      <div className="mobile-top-brand">
        <div className="brand-circle flex items-center justify-center bg-transparent border-none shadow-none">
           {/* GÜNCELLEME: Mobilde de aynı ayar (p-3 ve -mt-1) */}
           <img 
             src={logoSmall} 
             alt="Logo" 
             className="w-full h-full object-contain p-3 -mt-1" 
           />
        </div>
        <span className="brand-name">
          İNEGÖL <span className="highlight-text">NAKLİYAT</span>
        </span>
      </div>


      {/* 3. MOBİL ALT (NAV) */}
      <div className="mobile-bottom-nav">
        <div className="mobile-group">
           <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
            {activeTab === 'home' ? <RiHome5Fill /> : <RiHome5Line />}
            <span>Ana Sayfa</span>
          </button>
           <button className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => handleNavClick('gallery')}>
            {activeTab === 'gallery' ? <RiImage2Fill /> : <RiImage2Line />}
            <span>Galeri</span>
          </button>
        </div>

        <div className="spacer"></div>

        <div className="mobile-group">
           <button className={`nav-link ${activeTab === 'regions' ? 'active' : ''}`} onClick={() => handleNavClick('regions')}>
            <RiMapPinFill />
            <span>Bölgeler</span>
          </button>
           <button className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>
            <RiPhoneFill />
            <span>İletişim</span>
          </button>
        </div>

        <button className="btn-quote-mobile" onClick={() => handleNavClick('quote')}>
          FİYAT<br/>AL
        </button>
      </div>

    </div>
  );
};

export default Navbar;