// src/admin/pages/Settings.tsx

import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { useData } from '../../../context/DataContext';
import toast from 'react-hot-toast';
import { 
  RiSave3Line, RiTruckLine, RiLayoutGridLine, RiBuilding4Line, 
  RiMapPinLine, RiGlobalLine, RiInstagramLine, RiFacebookCircleLine, 
  RiAddLine, RiCloseLine 
} from 'react-icons/ri';

const Settings = () => {
  const { data, updateData } = useData();
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('general'); 
  const [newRegion, setNewRegion] = useState(''); 

  // Veritabanından gelen veriyi state'e aktar
  useEffect(() => {
    if (data) setFormData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  // Tüm ayarları kaydetme fonksiyonu
  const handleSave = async () => {
    const loadingToast = toast.loading('Ayarlar kaydediliyor...');
    try {
      await updateData('general', formData.general);
      await updateData('prices', formData.prices);
      await updateData('contact', formData.contact);
      await updateData('regions', formData.regions);
      await updateData('footer', formData.footer);
      
      toast.success('Başarıyla Güncellendi!', { id: loadingToast });
    } catch (error) {
      toast.error('Kaydetme başarısız oldu.', { id: loadingToast });
    }
  };

  // Yeni bölge ekleme
  const addRegion = () => {
    if(!newRegion.trim()) return;
    setFormData({
      ...formData,
      regions: [...(formData.regions || []), newRegion]
    });
    setNewRegion('');
  };

  // Bölge silme
  const removeRegion = (index: number) => {
    const newRegions = [...formData.regions];
    newRegions.splice(index, 1);
    setFormData({ ...formData, regions: newRegions });
  };

  if (!formData) return <AdminLayout><div className="text-white p-8">Veriler Yükleniyor...</div></AdminLayout>;

  return (
    <AdminLayout>
      
      {/* BAŞLIK VE KAYDET BUTONU */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Site Ayarları</h2>
          <p className="text-slate-400">İletişim, fiyatlar ve footer ayarlarını buradan yönetin.</p>
        </div>
        <button 
          onClick={handleSave} 
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          <RiSave3Line className="text-xl" /> DEĞİŞİKLİKLERİ KAYDET
        </button>
      </div>

      {/* TAB MENÜSÜ */}
      <div className="flex gap-4 border-b border-slate-700 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['general', 'contact', 'footer', 'prices', 'items'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`px-4 py-2 font-bold capitalize transition-colors whitespace-nowrap ${
              activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'general' ? 'Genel' : 
             tab === 'contact' ? 'İletişim & Bölge' : 
             tab === 'footer' ? 'Sosyal & Footer' : 
             tab === 'prices' ? 'Fiyatlar' : 'Eşyalar'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl animate-fadeIn">
        
        {/* 1. SEKME: GENEL AYARLAR */}
        {activeTab === 'general' && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><RiTruckLine className="text-blue-500"/> Temel Bilgiler</h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-400 text-sm">WhatsApp / Telefon</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none"
                    value={formData.general.phone}
                    onChange={e => setFormData({...formData, general: {...formData.general, phone: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Site Başlığı (SEO Title)</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none"
                    value={formData.general.title}
                    onChange={e => setFormData({...formData, general: {...formData.general, title: e.target.value}})}
                  />
                </div>
             </div>
          </div>
        )}

        {/* 2. SEKME: İLETİŞİM & BÖLGELER */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><RiMapPinLine className="text-red-500"/> Adres ve Harita</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Açık Adres</label>
                  <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-red-500 outline-none"
                    value={formData.contact?.address || ''}
                    onChange={e => setFormData({...formData, contact: {...formData.contact, address: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">E-posta Adresi</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-red-500 outline-none"
                    value={formData.contact?.email || ''}
                    onChange={e => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Google Haritalar Embed Linki</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 text-xs font-mono focus:border-red-500 outline-none"
                    placeholder="http://googleusercontent.com/maps..."
                    value={formData.contact?.mapEmbedUrl || ''}
                    onChange={e => setFormData({...formData, contact: {...formData.contact, mapEmbedUrl: e.target.value}})}
                  />
                  <p className="text-xs text-slate-500 mt-1">Google Maps → Paylaş → Harita Yerleştir → HTML kopyala içindeki linki al.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><RiBuilding4Line className="text-orange-500"/> Hizmet Bölgeleri</h3>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                  placeholder="Yeni Mahalle / İlçe Ekle"
                  value={newRegion}
                  onChange={e => setNewRegion(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addRegion()}
                />
                <button onClick={addRegion} className="bg-green-600 hover:bg-green-500 text-white px-4 rounded-lg font-bold"><RiAddLine/></button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.regions?.map((region: string, idx: number) => (
                  <div key={idx} className="bg-slate-800 border border-slate-600 px-3 py-1 rounded-full flex items-center gap-2 text-sm text-slate-200">
                    {region}
                    <button onClick={() => removeRegion(idx)} className="text-red-400 hover:text-red-300 ml-1"><RiCloseLine/></button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. SEKME: SOSYAL & FOOTER */}
        {activeTab === 'footer' && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><RiGlobalLine className="text-cyan-500"/> Footer ve Sosyal Medya</h3>
            <div className="space-y-4">
              
              <div>
                <label className="text-slate-400 text-sm">Footer Hakkında Metni</label>
                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:border-cyan-500 outline-none"
                  value={formData.footer?.description || ''}
                  onChange={e => setFormData({...formData, footer: {...formData.footer, description: e.target.value}})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-400 text-sm flex items-center gap-2 mb-1"><RiInstagramLine/> Instagram Linki</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                    value={formData.footer?.instagram || ''}
                    onChange={e => setFormData({...formData, footer: {...formData.footer, instagram: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm flex items-center gap-2 mb-1"><RiFacebookCircleLine/> Facebook Linki</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    value={formData.footer?.facebook || ''}
                    onChange={e => setFormData({...formData, footer: {...formData.footer, facebook: e.target.value}})}
                  />
                </div>
              </div>

              {/* DÜZELTİLEN KISIM: Copyright Alanı */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <label className="text-slate-400 text-sm font-bold text-cyan-400">Alt Telif Metni (Copyright Firma İsmi)</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-2 focus:border-cyan-500 outline-none"
                  placeholder="Örn: İnegöl Nakliyat Ltd. Şti."
                  value={formData.footer?.copyrightText || ''}
                  onChange={e => setFormData({...formData, footer: {...formData.footer, copyrightText: e.target.value}})}
                />
                <p className="text-xs text-slate-500 mt-2">
                  ℹ️ Burayı boş bırakırsanız otomatik olarak "Site Başlığı" (Genel Ayarlar) görünür.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* 4. SEKME: TEMEL FİYATLAR */}
        {activeTab === 'prices' && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><RiTruckLine className="text-green-500"/> Lojistik Maliyetleri</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-2">
                <label className="text-slate-400 text-sm">Kamyon Açılış Ücreti (Taban Fiyat)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono text-lg mt-1"
                  value={formData.prices.basePrice}
                  onChange={e => setFormData({...formData, prices: {...formData.prices, basePrice: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">KM Başına Ücret</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                  value={formData.prices.kmPrice}
                  onChange={e => setFormData({...formData, prices: {...formData.prices, kmPrice: Number(e.target.value)}})}
                />
              </div>
            </div>

            <h4 className="text-lg font-bold text-slate-300 mb-4 border-t border-slate-700 pt-4">Kat ve Asansör Farkları</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="text-slate-400 text-sm">Asansörlü Taşıma (Kat Başına)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                  value={formData.prices.elevatorCost}
                  onChange={e => setFormData({...formData, prices: {...formData.prices, elevatorCost: Number(e.target.value)}})}
                />
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="text-slate-400 text-sm">Merdivenle Taşıma (Kat Başına)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                  value={formData.prices.stairsCost}
                  onChange={e => setFormData({...formData, prices: {...formData.prices, stairsCost: Number(e.target.value)}})}
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. SEKME: EŞYA FİYATLARI */}
        {activeTab === 'items' && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><RiLayoutGridLine className="text-purple-500"/> Eşya Bazlı Ek Ücretler</h3>
            <p className="text-sm text-slate-400 mb-6">Müşteri sihirbazda bu eşyaları seçtiğinde fiyata eklenecek tutarları belirleyin.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <ItemInput label="3'lü Koltuk / Kanepe" field="sofa3" data={formData} set={setFormData} />
              <ItemInput label="2'li Koltuk" field="sofa2" data={formData} set={setFormData} />
              <ItemInput label="Tekli Koltuk / Berjer" field="armchair" data={formData} set={setFormData} />
              <ItemInput label="Yemek Masası" field="diningTable" data={formData} set={setFormData} />
              <ItemInput label="Çift Kişilik Yatak" field="bedDouble" data={formData} set={setFormData} />
              <ItemInput label="Gardırop" field="wardrobe" data={formData} set={setFormData} />
              <ItemInput label="Beyaz Eşya (Buzdolabı vb.)" field="whiteGoods" data={formData} set={setFormData} />
              <ItemInput label="Standart Koli" field="box" data={formData} set={setFormData} />
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

// Yardımcı Input Bileşeni
const ItemInput = ({ label, field, data, set }: any) => (
  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors">
    <span className="text-slate-300 text-sm">{label}</span>
    <div className="relative w-28">
      <input 
        type="number" 
        className="w-full bg-slate-800 text-white text-right p-2 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
        value={data.prices.items?.[field] || 0}
        onChange={(e) => {
          const newItems = { ...data.prices.items, [field]: Number(e.target.value) };
          set({ ...data, prices: { ...data.prices, items: newItems } });
        }}
      />
      <span className="absolute right-10 top-2 text-xs text-slate-500 mr-1 hidden">₺</span>
    </div>
  </div>
);

export default Settings;