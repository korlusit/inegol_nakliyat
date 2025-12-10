import React from 'react';
import { useData } from '../context/DataContext';
import { Helmet } from 'react-helmet-async';
import { RiMapPin2Line, RiCheckDoubleLine } from 'react-icons/ri';

const Regions = () => {
  const { data } = useData();
  const regions = data?.regions || [];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-6xl mx-auto">
      <Helmet>
        <title>Hizmet Bölgeleri | İnegöl Nakliyat</title>
      </Helmet>

      <div className="text-center mb-12">
        <RiMapPin2Line className="text-6xl text-brand-blue mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Hizmet Bölgelerimiz</h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          İnegöl merkezli olmak üzere Bursa ve çevre ilçelerde profesyonel taşımacılık hizmeti veriyoruz.
        </p>
      </div>

      {regions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {regions.map((region: string, index: number) => (
            <div key={index} className="glass-card p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <RiCheckDoubleLine />
              </div>
              <span className="text-white font-medium text-lg">{region}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500">
          Henüz bölge eklenmemiş.
        </div>
      )}
    </div>
  );
};

export default Regions;