// src/App.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- BİLEŞENLER ---
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Preloader from './components/Preloader';
import Footer from './components/Footer';

// --- VERİ MERKEZİ ---
import { DataProvider, useData } from './context/DataContext';

// --- CSS ---
import './App.css';

// ==============================================
// 1. MÜŞTERİ SAYFALARI (Lazy Load)
// ==============================================
const Home = React.lazy(() => import('./pages/Home'));
const Wizard = React.lazy(() => import('./pages/Wizard'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Regions = React.lazy(() => import('./pages/Regions'));
const Contact = React.lazy(() => import('./pages/Contact'));

// ==============================================
// 2. ADMIN SAYFALARI (DÜZELTİLDİ)
// ==============================================
// Klasör yapın: src/pages/Admin/... şeklinde olduğu için:

// Login Sayfası: src/pages/Admin/Login.tsx
const Login = React.lazy(() => import('./pages/Admin/Login'));

// İç Sayfalar: src/pages/Admin/pages/Dashboard.tsx
const Dashboard = React.lazy(() => import('./pages/Admin/pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Admin/pages/Settings'));
const Leads = React.lazy(() => import('./pages/Admin/pages/Leads'));
const GalleryManager = React.lazy(() => import('./pages/Admin/pages/GalleryManager'));


// ==============================================
// 3. MÜŞTERİ ARAYÜZÜ (Public Site Layout)
// ==============================================
const PublicSite = () => {
  const [activePage, setActivePage] = useState('home');
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { incrementStat } = useData();

  useEffect(() => {
    incrementStat('visitCount');
    const handleLoad = () => setLoading(false);
    
    if (document.readyState === 'complete') {
        handleLoad();
    } else {
        window.addEventListener('load', handleLoad);
    }
    
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const handleNav = (page: string) => {
    if (page === 'quote') {
      setShowWizard(true);
    } else {
      setActivePage(page);
      window.scrollTo(0, 0);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="App flex flex-col min-h-screen">
      <WhatsAppButton />
      <Navbar onNavigate={handleNav} />
      
      <div className="flex-grow">
        <Suspense fallback={<Preloader />}>
          
          {showWizard && <Wizard onClose={() => setShowWizard(false)} />}
          
          <div className="app-container">
            {activePage === 'home' && <Home />}
            {activePage === 'gallery' && <Gallery />}
            {activePage === 'regions' && <Regions />}
            {activePage === 'contact' && <Contact />}
          </div>

        </Suspense>
      </div>

      <Footer />
    </div>
  );
};


// ==============================================
// 4. ANA UYGULAMA ROTASI (Main App)
// ==============================================
function App() {
  const AdminLoader = () => (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Yönetim Paneli Yükleniyor...</p>
      </div>
    </div>
  );

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Müşteri Tarafı */}
          <Route path="/" element={<PublicSite />} />
          
          {/* Admin Giriş */}
          <Route path="/admin" element={
            <Suspense fallback={<AdminLoader />}>
              <Login />
            </Suspense>
          } />
          
          {/* Admin Paneli */}
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<AdminLoader />}>
              <Dashboard />
            </Suspense>
          } />
          
          <Route path="/admin/settings" element={
            <Suspense fallback={<AdminLoader />}>
              <Settings />
            </Suspense>
          } />
          
          <Route path="/admin/leads" element={
            <Suspense fallback={<AdminLoader />}>
              <Leads />
            </Suspense>
          } />

          <Route path="/admin/gallery" element={
            <Suspense fallback={<AdminLoader />}>
              <GalleryManager />
            </Suspense>
          } />

        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;