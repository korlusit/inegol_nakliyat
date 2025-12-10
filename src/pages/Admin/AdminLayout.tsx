// src/pages/Admin/AdminLayout.tsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiFileList3Line, RiSettings4Line, RiImageLine, RiLogoutBoxLine, RiMenu4Line, RiCloseLine } from 'react-icons/ri';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';

// LOGOYU IMPORT EDİYORUZ (Klasör yapına göre 2 üstte)
import logoSmall from '../../assets/logo-sm.png';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate('/admin');
  };

  const menuItems = [
    { icon: RiDashboardLine, label: 'Özet Durum', path: '/admin/dashboard' },
    { icon: RiFileList3Line, label: 'Gelen Teklifler', path: '/admin/leads' },
    { icon: RiImageLine, label: 'Galeri Yönetimi', path: '/admin/gallery' },
    { icon: RiSettings4Line, label: 'Site & Fiyat Ayarları', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* MOBİL ÜST BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-slate-700">
        {/* Mobilde de küçük logo görünsün */}
        <div className="flex items-center gap-2">
            <img src={logoSmall} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg text-white">Yönetim Paneli</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl text-slate-300">
          {sidebarOpen ? <RiCloseLine /> : <RiMenu4Line />}
        </button>
      </div>

      <div className="flex">
        {/* SOL MENÜ (SIDEBAR) */}
        <aside className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-slate-700 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-slate-700 flex flex-col items-center text-center">
            {/* GÜNCELLEME: Logo Eklendi */}
            <div className="w-20 h-20 mb-3 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-lg">
                <img 
                  src={logoSmall} 
                  alt="Admin Logo" 
                  className="w-12 h-12 object-contain" 
                />
            </div>
            <h1 className="text-xl font-bold text-white">İNEGÖL NAKLİYAT</h1>
            <p className="text-xs text-slate-500 mt-1">Yönetim Paneli</p>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <RiLogoutBoxLine className="text-xl" />
              <span>Güvenli Çıkış</span>
            </button>
          </div>
        </aside>

        {/* İÇERİK ALANI */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
          <div className="max-w-6xl mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;