// src/pages/Admin/pages/GalleryManager.tsx

import React, { useState } from 'react';
import AdminLayout from '../AdminLayout';
import { useData } from '../../../context/DataContext';
import { RiDeleteBinLine, RiImageAddLine, RiUploadCloud2Line } from 'react-icons/ri';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const { data, updateData } = useData();
  const [uploading, setUploading] = useState(false);

  // Resmi Base64 formatına çeviren ve küçülten fonksiyon
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Resmi max 800px genişliğe küçültelim (Veritabanı limiti için şart)
          const scaleFactor = 800 / img.width;
          canvas.width = 800;
          canvas.height = img.height * scaleFactor;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Kaliteyi %70'e düşürerek sıkıştır
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading('Fotoğraf işleniyor...');

    try {
      // 1. Resmi Kod'a Dönüştür
      const base64String = await convertToBase64(file);

      // 2. Veritabanına kaydet (Storage kullanmadan!)
      const currentGallery = Array.isArray(data.gallery) ? data.gallery : [];
      const newImage = {
        id: Date.now(),
        url: base64String, // Resmin kendisi artık bu kodun içinde
        name: file.name,
        date: new Date().toLocaleDateString('tr-TR')
      };

      await updateData('gallery', [newImage, ...currentGallery]);
      toast.success('Fotoğraf galeriye eklendi!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Yükleme başarısız oldu.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: any) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğine emin misin?')) return;
    const toastId = toast.loading('Siliniyor...');
    try {
      const currentGallery = Array.isArray(data.gallery) ? data.gallery : [];
      const newGallery = currentGallery.filter((img: any) => img.id !== image.id);
      await updateData('gallery', newGallery);
      toast.success('Fotoğraf silindi.', { id: toastId });
    } catch (error) {
      toast.error('Silme işlemi başarısız.', { id: toastId });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Galeri Yönetimi</h2>
          <p className="text-slate-400">Storage kullanmadan fotoğraf yükle/çıkar.</p>
        </div>
        
        <label className={`cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <RiImageAddLine className="text-xl" />
          {uploading ? 'İşleniyor...' : 'Fotoğraf Yükle'}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.gallery && data.gallery.length > 0 ? (
          data.gallery.map((img: any) => (
            <div key={img.id} className="group relative aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
              <img src={img.url} alt="Galeri" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <button onClick={() => handleDelete(img)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transform hover:scale-110 transition-transform">
                  <RiDeleteBinLine className="text-xl" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-500 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
            <RiUploadCloud2Line className="text-6xl mx-auto mb-4 opacity-50" />
            <p>Henüz hiç fotoğraf yüklenmemiş.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GalleryManager;