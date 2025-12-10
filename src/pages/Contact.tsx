import React from 'react';
import { useData } from '../context/DataContext';
import { Helmet } from 'react-helmet-async';
import { RiMapPinLine, RiPhoneLine, RiMailLine, RiWhatsappLine } from 'react-icons/ri';

const Contact = () => {
  const { data } = useData();
  const contact = data?.contact || {};
  const phone = data?.general?.phone || '';

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-6xl mx-auto">
      <Helmet>
        <title>İletişim | İnegöl Nakliyat</title>
      </Helmet>

      <h1 className="text-4xl font-bold text-white text-center mb-12">Bize Ulaşın</h1>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* SOL: BİLGİLER */}
        <div className="space-y-6">
          <div className="glass-card p-6 flex items-start gap-4">
            <RiMapPinLine className="text-3xl text-brand-blue flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">Adresimiz</h3>
              <p className="text-slate-400 mt-1">{contact.address || 'Adres bilgisi girilmedi.'}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <RiPhoneLine className="text-3xl text-brand-blue flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">Telefon</h3>
              <a href={`tel:${phone}`} className="text-slate-400 mt-1 block hover:text-white transition-colors">
                {phone}
              </a>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <RiMailLine className="text-3xl text-brand-blue flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">E-posta</h3>
              <a href={`mailto:${contact.email}`} className="text-slate-400 mt-1 block hover:text-white transition-colors">
                {contact.email || 'info@inegolnakliyat.com'}
              </a>
            </div>
          </div>
          
          <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-center font-bold py-4 rounded-xl transition-all shadow-neon-green flex items-center justify-center gap-2">
            <RiWhatsappLine className="text-2xl" /> WhatsApp'tan Yaz
          </a>
        </div>

        {/* SAĞ: HARİTA */}
        <div className="glass-card p-2 h-[400px] md:h-auto overflow-hidden rounded-3xl relative">
          {contact.mapEmbedUrl ? (
            <iframe 
              src={contact.mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              Harita yüklenmedi.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;