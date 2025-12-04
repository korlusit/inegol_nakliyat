import React, { useState, useEffect } from 'react';
import './Wizard.css';
import { 
  RiCloseLine, RiArrowRightLine, RiTruckLine, 
  RiSofaLine, RiTvLine, RiArchiveDrawerLine, RiFridgeLine,
  RiCheckLine, RiBuilding4Line, RiUserLocationLine, RiLayoutGridFill,
  RiTShirtLine, RiRestaurantLine, RiBox3Line
} from 'react-icons/ri';

// --- HARİTA KÜTÜPHANELERİ ---
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ARAMA KÜTÜPHANESİ
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Varsayılan İkon Düzeltmesi (Marker görünmeme sorununu çözer)
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface WizardProps {
  onClose: () => void;
}

// --- ENVANTER VERİSİ ---
const CATEGORIES = {
  SALON: [
    { id: 'sofa3', label: '3\'lü Koltuk', vol: 25, icon: <RiSofaLine /> },
    { id: 'sofa2', label: '2\'li Koltuk', vol: 20, icon: <RiSofaLine /> },
    { id: 'armchair', label: 'Berjer', vol: 10, icon: <RiSofaLine /> },
    { id: 'tv_unit', label: 'TV Ünitesi', vol: 15, icon: <RiTvLine /> },
    { id: 'dining_table', label: 'Yemek Masası', vol: 15, icon: <RiRestaurantLine /> },
    { id: 'chair', label: 'Sandalye (Adet)', vol: 2, icon: <RiLayoutGridFill /> },
    { id: 'vitrine', label: 'Vitrin / Gümüşlük', vol: 15, icon: <RiArchiveDrawerLine /> },
  ],
  YATAK: [
    { id: 'bed_double', label: 'Çift Kişilik Yatak', vol: 30, icon: <RiLayoutGridFill /> },
    { id: 'bed_single', label: 'Tek Kişilik Yatak', vol: 15, icon: <RiLayoutGridFill /> },
    { id: 'wardrobe', label: 'Gardırop (Kapılı)', vol: 25, icon: <RiArchiveDrawerLine /> },
    { id: 'dresser', label: 'Şifonyer', vol: 10, icon: <RiArchiveDrawerLine /> },
    { id: 'nightstand', label: 'Komodin', vol: 3, icon: <RiArchiveDrawerLine /> },
  ],
  BEYAZ: [
    { id: 'fridge', label: 'Buzdolabı', vol: 15, icon: <RiFridgeLine /> },
    { id: 'washer', label: 'Çamaşır Mak.', vol: 8, icon: <RiArchiveDrawerLine /> },
    { id: 'dish', label: 'Bulaşık Mak.', vol: 8, icon: <RiArchiveDrawerLine /> },
    { id: 'oven', label: 'Fırın / Ocak', vol: 8, icon: <RiArchiveDrawerLine /> },
  ],
  DIGER: [
    { id: 'box', label: 'Koli (Adet)', vol: 1, icon: <RiBox3Line /> },
    { id: 'carpet', label: 'Halı (Adet)', vol: 2, icon: <RiLayoutGridFill /> },
  ]
};

// --- HARİTA ARAMA BİLEŞENİ (Düzeltilmiş) ---
const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    // TypeScript hatasını önlemek için 'as any' kullanıyoruz
    // @ts-ignore
    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false, 
      keepResult: true,
      searchLabel: 'Adres veya Dükkan ara (Örn: Migros)',
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

// --- HARİTA TIKLAMA BİLEŞENİ ---
const LocationMarker = ({ points, setPoints }: { points: any[], setPoints: any }) => {
  useMapEvents({
    click(e) {
      if (points.length < 2) {
        setPoints([...points, e.latlng]);
      } else {
        // 3. tıklamada sıfırla ve yeni başlangıç yap
        setPoints([e.latlng]);
      }
    },
  });
  return null;
};

// --- ANA WIZARD BİLEŞENİ ---
const Wizard: React.FC<WizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [activeCat, setActiveCat] = useState<keyof typeof CATEGORIES>('SALON');

  // MAP STATE
  const [mapCenter] = useState<[number, number]>([40.076, 29.51]); // İnegöl
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [routePath, setRoutePath] = useState<[number, number][]>([]); 

  // DATA STATE
  const [inventory, setInventory] = useState<{[key: string]: number}>({});
  const [buildingData, setBuildingData] = useState({
    floorFrom: '', elevatorFrom: false,
    floorTo: '', elevatorTo: false,
  });
  const [finalPrice, setFinalPrice] = useState(0);

  // --- ROTA VE MESAFE HESAPLAMA (OSRM) ---
  useEffect(() => {
    if (points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      
      const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const km = Math.round(route.distance / 1000);
            setDistanceKm(km < 3 ? 3 : km); 

            // GeoJSON [lng, lat] -> Leaflet [lat, lng] dönüşümü
            const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRoutePath(coords);
          }
        })
        .catch(err => {
          console.error("Rota alınamadı", err);
          // Hata durumunda kuş uçuşu
          setDistanceKm(Math.round(p1.distanceTo(p2) / 1000));
          setRoutePath([[p1.lat, p1.lng], [p2.lat, p2.lng]]);
        });
    } else {
      setDistanceKm(0);
      setRoutePath([]);
    }
  }, [points]);

  // --- ENVANTER GÜNCELLEME ---
  const updateInv = (id: string, delta: number) => {
    setInventory(prev => {
      const val = (prev[id] || 0) + delta;
      if (val < 0) return prev;
      return { ...prev, [id]: val };
    });
  };

  // --- FİYAT HESAPLAMA ---
  useEffect(() => {
    if (step === 4) {
      let price = 2500; // Taban

      // Mesafe (Km başı 45 TL)
      price += distanceKm * 45;

      // Hacim
      let totalVol = 0;
      Object.keys(CATEGORIES).forEach(key => {
        CATEGORIES[key as keyof typeof CATEGORIES].forEach(item => {
          const count = inventory[item.id] || 0;
          totalVol += count * item.vol;
        });
      });
      price += totalVol * 5;

      // Katlar
      const flFrom = parseInt(buildingData.floorFrom) || 0;
      const flTo = parseInt(buildingData.floorTo) || 0;
      const costFrom = buildingData.elevatorFrom ? flFrom * 150 : flFrom * 300;
      const costTo = buildingData.elevatorTo ? flTo * 150 : flTo * 300;
      price += costFrom + costTo;

      setFinalPrice(Math.round(price / 100) * 100);
    }
  }, [step, distanceKm, inventory, buildingData]);


  return (
    <div className="wizard-page">
      <div className="wizard-container">
        
        {/* HEADER */}
        <div className="wizard-header">
          <div className="wizard-title">
            {step === 1 && "Nereden Nereye?"}
            {step === 2 && "Eşya Detayları"}
            {step === 3 && "Bina Bilgileri"}
            {step === 4 && "Hesaplanan Tutar"}
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', color:'#aaa', fontSize:'1.5rem', cursor:'pointer'}}>
            <RiCloseLine />
          </button>
        </div>

        {/* CONTENT */}
        <div className="wizard-content">
          
          {/* ADIM 1: HARİTA */}
          {step === 1 && (
            <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
              <p style={{color:'#aaa', marginBottom:'10px', fontSize:'0.9rem'}}>
                Sol üstteki büyüteç ile adres arayabilir, haritaya tıklayarak <strong>Başlangıç</strong> ve <strong>Varış</strong> noktalarını seçebilirsiniz.
              </p>
              
              <div className="map-wrapper">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', background:'#111' }}>
                  
                  {/* Karanlık Harita Katmanı */}
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                  
                  {/* Arama Bileşeni */}
                  <SearchField />
                  
                  {/* Tıklama Bileşeni */}
                  <LocationMarker points={points} setPoints={setPoints} />
                  
                  {/* Pinler */}
                  {points.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                      <Popup>{idx === 0 ? "MEVCUT EV" : "YENİ EV"}</Popup>
                    </Marker>
                  ))}

                  {/* Rota Çizgisi */}
                  {routePath.length > 0 && (
                    <Polyline 
                      positions={routePath} 
                      pathOptions={{ color: '#007aff', weight: 5, opacity: 0.8, dashArray: '10, 10', lineCap: 'round' }} 
                    />
                  )}

                </MapContainer>

                {distanceKm > 0 && (
                  <div className="map-overlay-info">
                    <div style={{fontSize:'0.8rem', color:'#aaa'}}>ROTA</div>
                    <div className="distance-value"><RiTruckLine style={{verticalAlign:'middle'}}/> {distanceKm} KM</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADIM 2: ENVANTER */}
          {step === 2 && (
            <div>
              <div className="category-tabs">
                {Object.keys(CATEGORIES).map(cat => (
                  <button 
                    key={cat} 
                    className={`tab-btn ${activeCat === cat ? 'active' : ''}`}
                    onClick={() => setActiveCat(cat as any)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="inventory-grid">
                {CATEGORIES[activeCat].map(item => {
                  const count = inventory[item.id] || 0;
                  return (
                    <div key={item.id} className={`item-card ${count > 0 ? 'active' : ''}`}>
                      <div className="item-top">
                        <div className="item-icon">{item.icon}</div>
                        <span style={{fontWeight:'bold', color:'white'}}>{item.label}</span>
                      </div>
                      <div className="item-controls">
                        <button className="btn-inv" onClick={() => updateInv(item.id, -1)}>-</button>
                        <span className="inv-count">{count}</span>
                        <button className="btn-inv" onClick={() => updateInv(item.id, 1)}>+</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ADIM 3: BİNA */}
          {step === 3 && (
            <div className="building-split">
              <div className="building-col">
                <div style={{color:'#007aff', fontWeight:'bold', marginBottom:'15px'}}><RiUserLocationLine /> Mevcut Ev</div>
                <input type="number" placeholder="Bulunduğu Kat" className="input-glass-lg"
                  value={buildingData.floorFrom} onChange={e => setBuildingData({...buildingData, floorFrom: e.target.value})}
                />
                <div className={`toggle-row ${buildingData.elevatorFrom ? 'active' : ''}`} 
                     style={{display:'flex', justifyContent:'space-between', padding:'15px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', cursor:'pointer'}}
                     onClick={() => setBuildingData({...buildingData, elevatorFrom: !buildingData.elevatorFrom})}>
                  <span style={{color:'white'}}>Asansör Var</span>
                  <div style={{width:'20px', height:'20px', borderRadius:'50%', border:'2px solid #555', display:'flex', alignItems:'center', justifyContent:'center', background: buildingData.elevatorFrom ? '#007aff':'transparent', borderColor: buildingData.elevatorFrom ? '#007aff':'#555'}}>
                    {buildingData.elevatorFrom && <RiCheckLine style={{color:'white', fontSize:'0.8rem'}}/>}
                  </div>
                </div>
              </div>

              <div className="building-col">
                <div style={{color:'#007aff', fontWeight:'bold', marginBottom:'15px'}}><RiBuilding4Line /> Yeni Ev</div>
                <input type="number" placeholder="Taşınacak Kat" className="input-glass-lg"
                  value={buildingData.floorTo} onChange={e => setBuildingData({...buildingData, floorTo: e.target.value})}
                />
                <div className={`toggle-row ${buildingData.elevatorTo ? 'active' : ''}`} 
                     style={{display:'flex', justifyContent:'space-between', padding:'15px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', cursor:'pointer'}}
                     onClick={() => setBuildingData({...buildingData, elevatorTo: !buildingData.elevatorTo})}>
                  <span style={{color:'white'}}>Asansör Var</span>
                  <div style={{width:'20px', height:'20px', borderRadius:'50%', border:'2px solid #555', display:'flex', alignItems:'center', justifyContent:'center', background: buildingData.elevatorTo ? '#007aff':'transparent', borderColor: buildingData.elevatorTo ? '#007aff':'#555'}}>
                    {buildingData.elevatorTo && <RiCheckLine style={{color:'white', fontSize:'0.8rem'}}/>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADIM 4: FİYAT */}
          {step === 4 && (
            <div style={{textAlign:'center', marginTop:'30px'}}>
              <div style={{color:'#888', letterSpacing:'2px'}}>TAHMİNİ FİYAT</div>
              <div style={{fontSize:'5rem', fontWeight:'900', color:'white', textShadow:'0 0 40px #007aff', lineHeight:'1'}}>
                {finalPrice.toLocaleString('tr-TR')} <span style={{fontSize:'2rem', color:'#007aff'}}>₺</span>
              </div>
              
              <div style={{maxWidth:'400px', margin:'30px auto', background:'rgba(255,255,255,0.05)', padding:'20px', borderRadius:'15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', color:'#ccc'}}>
                  <span>Mesafe ({distanceKm} km)</span>
                  <span>+{distanceKm * 40} ₺</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', color:'#ccc'}}>
                  <span>Eşya Hacmi</span>
                  <span>Hesaplandı</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', color:'#ccc'}}>
                  <span>Kat & Asansör</span>
                  <span>Hesaplandı</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="wizard-footer">
          {step > 1 ? (
            <button className="btn-action btn-ghost" onClick={() => setStep(step - 1)}>Geri</button>
          ) : (<div></div>)}

          {step < 4 ? (
            <button className="btn-action btn-primary" onClick={() => setStep(step + 1)} disabled={step === 1 && points.length < 2}>
              {step === 1 && points.length < 2 ? "Konum Seçin" : "Devam Et"}
            </button>
          ) : (
            <button className="btn-action btn-primary" onClick={() => { alert("Randevu alındı!"); onClose(); }}>
              Randevu Oluştur
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Wizard;