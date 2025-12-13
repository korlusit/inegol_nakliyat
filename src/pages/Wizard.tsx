// src/pages/Wizard.tsx

import React, { useState } from 'react';
import './Wizard.css';
import { useData } from '../context/DataContext';
import { 
  RiCloseLine, RiTruckLine, 
  RiHome5Line, RiBuilding4Line, RiUserLocationLine, 
  RiCheckLine, RiLayoutMasonryLine, RiWhatsappLine, RiHotelLine,
  RiMapPinTimeLine, RiPhoneFill, RiInformationLine, RiArrowRightLine
} from 'react-icons/ri';

// NOT: Harita kütüphaneleri (Leaflet vb.) tamamen kaldırıldı. 
// Bu sayede sayfa çok daha hızlı açılacak (Lazy Load verimliliği artacak).

interface WizardProps {
  onClose: () => void;
}

const ROOM_TYPES = [
  { id: '1+0', label: '1+0 Stüdyo', desc: 'Minimal', icon: <RiHotelLine /> },
  { id: '2+0', label: '2+0 Daire', desc: 'Az Eşya', icon: <RiHome5Line /> },
  { id: '1+1', label: '1+1 Daire', desc: 'Standart', icon: <RiHome5Line /> },
  { id: '2+1', label: '2+1 Daire', desc: 'Aile Evi', icon: <RiLayoutMasonryLine /> },
  { id: '3+1', label: '3+1 Daire', desc: 'Geniş', icon: <RiLayoutMasonryLine /> },
  { id: '4+1', label: '4+1 Daire', desc: 'Büyük', icon: <RiBuilding4Line /> },
  { id: '5+1', label: '5+1 Daire', desc: 'Çok Geniş', icon: <RiBuilding4Line /> },
  { id: '6+1', label: '6+1 Villa', desc: 'Komple', icon: <RiBuilding4Line /> },
];

const Wizard: React.FC<WizardProps> = ({ onClose }) => {
  const { data } = useData(); 
  const phone = data?.general?.phone || '905XXXXXXXXXX';

  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<string>('2+1');
  
  // Harita yerine metin bazlı adres state'leri
  const [addressData, setAddressData] = useState({
    from: '',
    to: ''
  });

  const [buildingData, setBuildingData] = useState({
    floorFrom: '', elevatorFrom: false,
    floorTo: '', elevatorTo: false,
  });

  const sendToWhatsApp = () => {
    // Harita linki yerine direkt adresleri yazdırıyoruz
    const message = `👋 Merhaba, web sitenizden taşınma fiyatı almak istiyorum.

🏠 *Ev Tipi:* ${selectedRoom}

📍 *NEREDEN:* ${addressData.from}
🏢 Kat: ${buildingData.floorFrom || 'Giriş'} (${buildingData.elevatorFrom ? '✅ Asansörlü' : '❌ Merdiven'})

📍 *NEREYE:* ${addressData.to}
🏢 Kat: ${buildingData.floorTo || 'Giriş'} (${buildingData.elevatorTo ? '✅ Asansörlü' : '❌ Merdiven'})

Fiyat teklifi alabilir miyim?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col md:items-center md:justify-center bg-black/90 backdrop-blur-sm p-0 md:p-4">
      
      <div className="w-full h-full md:h-[90vh] md:max-w-4xl bg-[#111] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative animate-fadeIn">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 bg-[#161b22]">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-white">
              {step === 1 && "1. Adım: Konum Bilgileri"}
              {step === 2 && "2. Adım: Ev Tipi"}
              {step === 3 && "3. Adım: Bina Durumu"}
              {step === 4 && "4. Adım: Özet & Teklif"}
            </h2>
            <p className="text-xs text-slate-400">Adımları tamamlayarak hızlıca fiyat alın.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-500 transition-colors">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          
          {/* ADIM 1: ADRES GİRİŞİ (Harita Yerine) */}
          {step === 1 && (
            <div className="flex flex-col h-full justify-center gap-8 max-w-2xl mx-auto">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-200 flex gap-3 items-center">
                <RiInformationLine className="text-2xl flex-shrink-0" />
                <span>Harita sorunları nedeniyle adresleri manuel girmeniz daha hızlı sonuç verecektir. İlçe veya mahalle yazmanız yeterlidir.</span>
              </div>
              
              <div className="space-y-6">
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wider">
                        <RiUserLocationLine className="inline mr-1 text-blue-500"/> Nereden Taşınıyorsunuz?
                    </label>
                    <input 
                        type="text" 
                        placeholder="Örn: İnegöl, Alanyurt, Bursa Merkez..." 
                        className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-lg transition-all placeholder:text-slate-600"
                        value={addressData.from}
                        onChange={(e) => setAddressData({...addressData, from: e.target.value})}
                    />
                </div>

                <div className="flex justify-center text-slate-600">
                    <RiArrowRightLine className="text-3xl rotate-90 md:rotate-0" />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wider">
                        <RiMapPinTimeLine className="inline mr-1 text-green-500"/> Nereye Taşınıyorsunuz?
                    </label>
                    <input 
                        type="text" 
                        placeholder="Örn: İstanbul, İzmir, Ankara..." 
                        className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-lg transition-all placeholder:text-slate-600"
                        value={addressData.to}
                        onChange={(e) => setAddressData({...addressData, to: e.target.value})}
                    />
                </div>
              </div>
            </div>
          )}

          {/* Adım 2: Oda Seçimi */}
          {step === 2 && (
            <div className="h-full">
              <h3 className="text-center text-white text-lg font-bold mb-6">Eviniz kaç odalı?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ROOM_TYPES.map(room => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`cursor-pointer rounded-xl p-4 border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedRoom === room.id 
                      ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(0,122,255,0.4)] transform scale-105' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`text-3xl ${selectedRoom === room.id ? 'text-white' : 'text-slate-500'}`}>{room.icon}</div>
                    <div className="text-white font-bold text-sm">{room.label}</div>
                    {selectedRoom === room.id && <RiCheckLine className="text-white bg-white/20 rounded-full p-0.5 w-5 h-5 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adım 3: Bina */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-start">
                <RiInformationLine className="text-yellow-500 text-xl mt-0.5 flex-shrink-0" />
                <span className="text-sm text-yellow-100/80">
                  <strong>Önemli:</strong> 2. kat ve üzerindeki taşımalarda bina asansörü kullanılamıyorsa <u>Mobil Asansör</u> kurulumu gerekir.
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* MEVCUT EV */}
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-blue-400 font-bold mb-4">
                    <RiUserLocationLine className="text-xl"/> Mevcut Ev
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Bulunduğu Kat</label>
                      <input type="number" placeholder="Örn: 3" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        value={buildingData.floorFrom} onChange={e => setBuildingData({...buildingData, floorFrom: e.target.value})}
                      />
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${buildingData.elevatorFrom ? 'bg-green-500/10 border-green-500/50' : 'bg-black/20 border-white/10'}`}
                      onClick={() => setBuildingData({...buildingData, elevatorFrom: !buildingData.elevatorFrom})}
                    >
                      <span className="text-sm text-white">Mobil Asansör Gerekir</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${buildingData.elevatorFrom ? 'border-green-500 bg-green-500 text-white' : 'border-slate-500'}`}>
                        {buildingData.elevatorFrom && <RiCheckLine className="text-sm" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* YENİ EV */}
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-purple-400 font-bold mb-4">
                    <RiBuilding4Line className="text-xl"/> Yeni Ev
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Taşınacak Kat</label>
                      <input type="number" placeholder="Örn: 5" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                        value={buildingData.floorTo} onChange={e => setBuildingData({...buildingData, floorTo: e.target.value})}
                      />
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${buildingData.elevatorTo ? 'bg-green-500/10 border-green-500/50' : 'bg-black/20 border-white/10'}`}
                      onClick={() => setBuildingData({...buildingData, elevatorTo: !buildingData.elevatorTo})}
                    >
                      <span className="text-sm text-white">Mobil Asansör Gerekir</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${buildingData.elevatorTo ? 'border-green-500 bg-green-500 text-white' : 'border-slate-500'}`}>
                        {buildingData.elevatorTo && <RiCheckLine className="text-sm" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Adım 4: Özet */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Taşınma Özeti</h2>
              <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2"><RiHome5Line/> Ev Tipi</span>
                  <span className="text-white font-bold">{selectedRoom}</span>
                </div>
                
                {/* Mesafe yerine Adresleri Göster */}
                <div className="p-4 border-b border-white/10 bg-white/5 space-y-2">
                   <div className="flex items-start gap-2">
                      <RiUserLocationLine className="text-blue-500 mt-1"/>
                      <div>
                        <span className="text-xs text-slate-500 uppercase block">Nereden</span>
                        <span className="text-white font-bold">{addressData.from || 'Belirtilmedi'}</span>
                        <span className="text-slate-400 text-xs block mt-1">{buildingData.floorFrom || 'Giriş'}. Kat • {buildingData.elevatorFrom ? 'Asansörlü' : 'Merdiven'}</span>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-white/5 space-y-2">
                   <div className="flex items-start gap-2">
                      <RiMapPinTimeLine className="text-green-500 mt-1"/>
                      <div>
                        <span className="text-xs text-slate-500 uppercase block">Nereye</span>
                        <span className="text-white font-bold">{addressData.to || 'Belirtilmedi'}</span>
                        <span className="text-slate-400 text-xs block mt-1">{buildingData.floorTo || 'Giriş'}. Kat • {buildingData.elevatorTo ? 'Asansörlü' : 'Merdiven'}</span>
                      </div>
                   </div>
                </div>

              </div>
              <p className="text-slate-400 text-sm mt-6 text-center max-w-xs">
                Bu bilgiler doğrultusunda en uygun fiyat teklifini almak için bize WhatsApp'tan ulaşın.
              </p>
            </div>
          )}

        </div>

        {/* FOOTER ACTION BAR */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-[#161b22] flex gap-3 justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 font-bold transition-colors">
              Geri
            </button>
          ) : (
            <div className="w-20"></div> 
          )}

          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              // Validasyon: Adresler boşsa ilerletme
              disabled={step === 1 && (!addressData.from.trim() || !addressData.to.trim())}
              className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {step === 1 ? "Konumu Onayla" : "Devam Et"}
            </button>
          ) : (
            <div className="flex gap-3 flex-1 md:w-auto">
                <a href={`tel:${phone}`} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
                    <RiPhoneFill /> Ara
                </a>
                <button onClick={sendToWhatsApp} className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform">
                    <RiWhatsappLine className="text-xl"/> WhatsApp
                </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Wizard;