// src/context/DataContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultData = {
  general: {
    phone: "905XXXXXXXXXX",
    title: "İnegöl Nakliyat",
    visitCount: 0,
    offerCount: 0
  },
  contact: {
    address: "Osmaniye Mah. Altay Cad. No:1, İnegöl / BURSA",
    email: "info@inegolnakliyat.com",
    mapEmbedUrl: ""
  },
  // YENİ: FOOTER VE SOSYAL MEDYA AYARLARI
  footer: {
    description: "İnegöl ve çevresinde yılların tecrübesiyle, sigortalı ve asansörlü taşımacılık hizmeti sunuyoruz.",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    copyrightText: "Özel Tasarım"
  },
  regions: [
    "Yeniceköy Mahallesi", "Akhisar Mahallesi", "Alanyurt", "Cerrah"
  ],
  prices: {
    basePrice: 2000,
    kmPrice: 50,
    elevatorCost: 300,
    stairsCost: 500,
    items: {
      sofa3: 150, sofa2: 100, armchair: 50, diningTable: 100,
      bedDouble: 200, wardrobe: 250, whiteGoods: 100, box: 20,
    }
  },
  gallery: [] 
};

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteContent", "mainData"), (docSnap) => {
      if (docSnap.exists()) {
        setData({ ...defaultData, ...docSnap.data() });
      } else {
        setDoc(doc(db, "siteContent", "mainData"), defaultData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updateData = async (section: string, newData: any) => {
    const docRef = doc(db, "siteContent", "mainData");
    await updateDoc(docRef, { [section]: newData });
  };

  const incrementStat = (field: string) => {
    if (loading || !data || !data.general) return;
    const currentVal = Number(data.general[field]) || 0;
    updateData('general', { ...data.general, [field]: currentVal + 1 });
  };

  return (
    <DataContext.Provider value={{ data, updateData, incrementStat, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);