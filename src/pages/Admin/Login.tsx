// src/pages/Admin/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase'; 
import toast, { Toaster } from 'react-hot-toast';

// LOGOYU IMPORT EDİYORUZ (Klasör yapına göre 2 üstte)
import logoLarge from '../../assets/logo-lg.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Giriş Başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error("Giriş Hatası:", err.code);
      toast.error('Giriş başarısız. Bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
        
        {/* GÜNCELLEME: Yazı yerine LOGO geldi */}
        <div className="text-center mb-8">
          <img 
            src={logoLarge} 
            alt="İnegöl Nakliyat Yönetim Paneli" 
            className="h-24 mx-auto object-contain mb-4" 
          />
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Yönetim Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">E-posta Adresi</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="admin@inegol.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Şifre</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
          >
            {loading ? 'Kontrol Ediliyor...' : 'GİRİŞ YAP'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Panel v2.0
        </div>
      </div>
    </div>
  );
};

export default Login;