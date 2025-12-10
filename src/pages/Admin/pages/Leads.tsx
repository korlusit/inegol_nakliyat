import React from 'react';
import AdminLayout from '../AdminLayout';

const Leads = () => {
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-white mb-6">Gelen Teklifler</h2>
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-12 text-center">
        <p className="text-slate-400 text-lg">Henüz yeni bir talep yok.</p>
        <p className="text-sm text-slate-600 mt-2">Sihirbaz formunu dolduran müşteriler burada listelenecek.</p>
      </div>
    </AdminLayout>
  );
};

export default Leads;