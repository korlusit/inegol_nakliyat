import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// HelmetProvider, site içi SEO yönetimi için eklenir (Dinamik başlıklar)
import { HelmetProvider } from 'react-helmet-async'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Dinamik SEO başlıkları için sarmalayıcı */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)