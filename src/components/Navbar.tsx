// src/components/Navbar.tsx

import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom'; 
import logoSmall from '../assets/logo-sm.png'; 

import { 
  RiHome5Line, RiHome5Fill,
  RiInformationLine, RiInformationFill, // İkon değişti
  RiPhoneLine, RiPhoneFill,
  RiImage2Line, RiImage2Fill 
} from 'react-icons/ri';

interface NavbarProps {
  onOpenWizard: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenWizard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path.includes('gallery')) setActiveTab('gallery');
    else if (path.includes('hakkimizda')) setActiveTab('about'); // Link kontrolü
    else if (path.includes('contact')) setActiveTab('contact');
  }, [location]);

  const handleNavClick = (page: string) => {
    if (page === 'quote') {
      onOpenWizard();
    } else {
      if (page === 'home') navigate('/');
      else if (page === 'about') navigate('/hakkimizda');
      else navigate(`/${page}`);
    }
  };

  return (
    <div className="floating-navbar">
      
      {/* PC MENU */}
      <div className="pc-left-brand">
        <div className="brand-circle flex items-center justify-center bg-transparent border-none shadow-none">
           <img src={logoSmall} alt="Logo" className="w-full h-full object-contain p-3 -mt-1" />
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
          
          {/* İsim ve İkon Değişti */}
          <button className={`nav-link ${activeTab === 'about' ? 'active' : ''}`} onClick={() => handleNavClick('about')}>
            {activeTab === 'about' ? <RiInformationFill /> : <RiInformationLine />}
            <span>Hakkımızda</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>
            {activeTab === 'contact' ? <RiPhoneFill /> : <RiPhoneLine />}
            <span>İletişim</span>
          </button>
        </div>
        <button className="btn-quote-pc" onClick={() => handleNavClick('quote')}>FİYAT AL</button>
      </div>

      {/* MOBİL MENU - ÜST */}
      <div className="mobile-top-brand">
        <div className="brand-circle flex items-center justify-center bg-transparent border-none shadow-none">
           <img src={logoSmall} alt="Logo" className="w-full h-full object-contain p-3 -mt-1" />
        </div>
        <span className="brand-name">İNEGÖL <span className="highlight-text">NAKLİYAT</span></span>
      </div>

      {/* MOBİL MENU - ALT */}
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
            {/* İsim ve İkon Değişti */}
            <button className={`nav-link ${activeTab === 'about' ? 'active' : ''}`} onClick={() => handleNavClick('about')}>
            <RiInformationLine />
            <span>Hakkımızda</span>
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