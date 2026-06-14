import React, { useState, useRef } from 'react';
import { FileText, Award, Heart, CheckCircle, FolderOpen, ChevronRight } from 'lucide-react';
import Formulario from './components/Formulario';
import VistaImpresion from './components/VistaImpresion';

const COLORS = {
  brown: '#603828',
  gold: '#C49E65',
  cream: '#FAF6F0',
  white: '#FFFFFF',
  textLight: '#8D6E63',
  border: '#E6DFD5'
};

export default function App() {
  const [screen, setScreen] = useState('home'); 
  const [certType, setCertType] = useState(''); 
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);

  const initForm = (type) => {
    setCertType(type);
    setFormData({
      nombres: '', 
      fechaSacramento: '', 
      celebrante: '', 
      libro: '', 
      folio: '', 
      partida: '', 
      observaciones: '',
      fechaNacimiento: '', 
      lugarNacimiento: '', 
      padre: '', 
      madre: '', 
      lugarSacramento: 'Parroquia Sta. Teresita del Niño Jesús',
      novio: '', 
      novia: '', 
      padreNovio: '', 
      madreNovio: '', 
      padreNovia: '', 
      madreNovia: '', 
      padrinos: '',
      civilPrefectura: '', 
      civilFecha: '', 
      civilActa: ''
    });
    setScreen('form');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoadJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (parsedData.certType && parsedData.formData) {
          setCertType(parsedData.certType);
          setFormData(parsedData.formData);
          setScreen('form');
        } else {
          alert('El archivo JSON seleccionado no tiene el formato válido de un certificado.');
        }
      } catch (error) {
        alert('Error al leer el archivo. Asegúrese de que sea un archivo .json válido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    /* AJUSTADO: width 100vw y margin 0 para romper cualquier centrado del CSS global */
    <div style={{ backgroundColor: COLORS.cream, minHeight: '100vh', width: '100vw', margin: 0, display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER DE LA APLICACIÓN */}
      <div className="no-print" style={{ backgroundColor: COLORS.brown, height: '70px', display: 'flex', alignItems: 'center', padding: '0 30px', width: '100%', boxSizing: 'border-box' }}>
        <img src="/teresitalogo.png" alt="Parroquia Santa Teresita del Niño Jesús" style={{ height: '50px', objectFit: 'contain' }} />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
        
        {screen === 'home' && (
          <div style={{ width: '100%', maxWidth: '850px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: '36px', color: COLORS.brown, fontWeight: 'normal', marginBottom: '8px' }}>Bienvenido</h1>
            <p style={{ color: COLORS.textLight, fontSize: '15px', marginBottom: '35px' }}>Seleccione el certificado que desea emitir</p>

            {/* GRILLA DE CATEGORÍAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              
              <button onClick={() => initForm('bautizo')} style={cardStyle}>
                <FileText size={45} color={COLORS.gold} strokeWidth={1.2} />
                CERTIFICADO DE BAUTIZO
              </button>

              <button onClick={() => initForm('comunion')} style={cardStyle}>
                <Award size={45} color={COLORS.gold} strokeWidth={1.2} />
                CERTIFICADO DE PRIMERA COMUNIÓN
              </button>

              <button onClick={() => initForm('confirmacion')} style={cardStyle}>
                <Heart size={45} color={COLORS.gold} strokeWidth={1.2} />
                CERTIFICADO DE CONFIRMACIÓN
              </button>

              <button onClick={() => initForm('matrimonio')} style={cardStyle}>
                <CheckCircle size={45} color={COLORS.gold} strokeWidth={1.2} />
                CERTIFICADO DE MATRIMONIO
              </button>

            </div>

            {/* INTERFAZ DE CARGA LOCAL */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLoadJson} 
              accept=".json" 
              style={{ display: 'none' }} 
            />

            <button onClick={triggerFileSelect} style={buttonBorradorStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FolderOpen size={22} color={COLORS.gold} strokeWidth={1.5} />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: COLORS.brown, letterSpacing: '0.5px' }}>ABRIR BORRADOR GUARDADO</span>
                  <span style={{ fontSize: '12px', color: COLORS.textLight }}>Seleccione un archivo .json previamente guardado</span>
                </div>
              </div>
              <ChevronRight size={18} color={COLORS.gold} />
            </button>

          </div>
        )}

        {screen === 'form' && (
          <Formulario certType={certType} formData={formData} onChange={handleInputChange} onBack={() => setScreen('home')} onPreview={() => setScreen('preview')} />
        )}

        {screen === 'preview' && (
          <VistaImpresion certType={certType} formData={formData} onBack={() => setScreen('form')} />
        )}
      </main>

      {/* BARRA INFERIOR */}
      <div className="no-print" style={{ backgroundColor: COLORS.brown, minHeight: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', color: 'white', fontSize: '12px', borderTop: `1px solid ${COLORS.gold}`, width: '100%', padding: '10px 20px', boxSizing: 'border-box', textAlign: 'center', flexWrap: 'wrap' }}>
        <div>Herramienta de llenado de certificados — Los archivos PDF se guardan en su computadora</div>
        <div>Sin Internet: Funciona completamente local</div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E6DFD5',
  borderRadius: '10px',
  padding: '40px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '18px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#603828',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
};

const buttonBorradorStyle = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E6DFD5',
  borderRadius: '10px',
  padding: '20px 25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
};