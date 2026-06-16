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
  border: '#E6DFD5',
  hoverBg: '#FDFBF7'
};

export default function App() {
  const [screen, setScreen] = useState('home'); 
  const [certType, setCertType] = useState(''); 
  const [formData, setFormData] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredDraft, setHoveredDraft] = useState(false);
  const fileInputRef = useRef(null);

  const initForm = (type) => {
    setCertType(type);
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    setFormData({
      // Campos generales
      nombres: '', fechaSacramento: '', celebrante: '', libro: '', folio: '', partida: '', observaciones: '',
      lugarSacramento: 'Parroquia Sta. Teresita del Niño Jesús',
      motivo: '',
      fechaExpedicion: fechaHoy,
      
      // Campos específicos de Matrimonio (Esposo)
      esposoNombre: '', esposoEdad: '', esposoEstadoCivil: 'Soltero', esposoNaturalDe: '', esposoVecinoDe: '', esposoPadre: '', esposoMadre: '',
      
      // Campos específicos de Matrimonio (Esposa)
      esposaNombre: '', esposaEdad: '', esposaEstadoCivil: 'Soltera', esposaNaturalDe: '', esposaVecinaDe: '', esposaPadre: '', esposaMadre: '',
      
      // Otros
      padrino: '', madrina: '', ministro: '',
      civilActa: '', civilFecha: '', civilMunicipio: '', civilEstado: 'Lara',
      tecnicoMun: '', tecnicoAnio: new Date().getFullYear().toString()
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
        setCertType(parsedData.certType);
        setFormData(parsedData.formData);
        setScreen('form');
      } catch (error) { 
        alert('Error al leer el archivo .json legislado'); 
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ backgroundColor: COLORS.cream, minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", margin: 0, overflowX: 'hidden' }}>
      
      {/* HEADER: BANNER INSTITUCIONAL EQUILIBRADO */}
      <div className="no-print" style={{ backgroundColor: COLORS.brown, height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', width: '100%', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/teresitalogo.png" alt="Logo" style={{ height: '68px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '30px', backgroundColor: COLORS.gold, opacity: 0.5 }}></div>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: '16px', color: COLORS.cream, letterSpacing: '0.5px' }}>
            Parroquia Santa Teresita del Niño Jesús
          </span>
        </div>
        <span style={{ fontSize: '11px', color: COLORS.gold, letterSpacing: '1px', fontWeight: 'bold' }}>
          SISTEMA DE REGISTRO ECLESIÁSTICO
        </span>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
        {screen === 'home' && (
          <div style={{ width: '100%', maxWidth: '850px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: '38px', color: COLORS.brown, fontWeight: 'normal', marginBottom: '10px', letterSpacing: '-0.5px' }}>
              Registro Parroquial
            </h1>
            <p style={{ color: COLORS.textLight, fontSize: '15px', marginBottom: '40px' }}>
              Seleccione el tipo de documento eclesiástico que desea emitir o cargar
            </p>

            {/* REJILLA DE CERTIFICADOS CON MANEJO DE HOVER DINÁMICO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
              
              <button 
                onClick={() => initForm('bautizo')} 
                onMouseEnter={() => setHoveredCard('bautizo')}
                onMouseLeave={() => setHoveredCard(null)}
                style={getCardStyle(hoveredCard === 'bautizo')}
              >
                <FileText size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE BAUTIZO
              </button>

              <button 
                onClick={() => initForm('comunion')} 
                onMouseEnter={() => setHoveredCard('comunion')}
                onMouseLeave={() => setHoveredCard(null)}
                style={getCardStyle(hoveredCard === 'comunion')}
              >
                <Award size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE PRIMERA COMUNIÓN
              </button>

              <button 
                onClick={() => initForm('confirmacion')} 
                onMouseEnter={() => setHoveredCard('confirmacion')}
                onMouseLeave={() => setHoveredCard(null)}
                style={getCardStyle(hoveredCard === 'confirmacion')}
              >
                <CheckCircle size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE CONFIRMACIÓN
              </button>

              <button 
                onClick={() => initForm('matrimonio')} 
                onMouseEnter={() => setHoveredCard('matrimonio')}
                onMouseLeave={() => setHoveredCard(null)}
                style={getCardStyle(hoveredCard === 'matrimonio')}
              >
                <Heart size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE MATRIMONIO
              </button>

            </div>

            {/* SECCIÓN CARGAR ARCHIVO / BORRADOR */}
            <input type="file" ref={fileInputRef} onChange={handleLoadJson} accept=".json" style={{ display: 'none' }} />
            <button 
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={() => setHoveredDraft(true)}
              onMouseLeave={() => setHoveredDraft(false)}
              style={getDraftButtonStyle(hoveredDraft)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <FolderOpen size={24} color={COLORS.gold} strokeWidth={1.3} />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: COLORS.brown, marginBottom: '2px' }}>
                    ABRIR BORRADOR GUARDADO
                  </span>
                  <span style={{ fontSize: '12px', color: COLORS.textLight }}>
                    Importar archivo de respaldo anterior (.json) desde el almacenamiento
                  </span>
                </div>
              </div>
              <ChevronRight size={20} color={COLORS.gold} style={{ transform: hoveredDraft ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
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

      {/* FOOTER CON INFORMACIÓN TÉCNICA LOCAL */}
      <div className="no-print" style={{ backgroundColor: COLORS.brown, minHeight: '55px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', color: 'rgba(255,255,255,0.70)', fontSize: '12px', borderTop: `1px solid ${COLORS.gold}`, width: '100%', boxSizing: 'border-box' }}>
        <div>Herramienta de Digitalización de Certificados Parroquiales — Santa Teresita</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '7px', height: '7px', backgroundColor: '#4CAF50', borderRadius: '50%' }}></div>
          <span>Entorno Local Asegurado (Sin Internet)</span>
        </div>
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

// FUNCIONES DINÁMICAS DE ESTILOS PARA GESTIONAR EL HOVER SIN DEPENDER DE CSS EXTERNO
const getCardStyle = (isHovered) => ({
  backgroundColor: '#FFFFFF',
  border: `1px solid ${COLORS.border}`,
  borderRadius: '12px',
  padding: '45px 25px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  cursor: 'pointer',
  fontSize: '13.5px',
  fontWeight: 'bold',
  color: COLORS.brown,
  letterSpacing: '0.6px',
  boxShadow: isHovered ? '0 5px 15px rgba(96, 56, 40, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
  transform: isHovered ? 'translateY(-2px)' : 'none',
  backgroundColor: isHovered ? COLORS.hoverBg : '#FFFFFF',
  transition: 'all 0.25s ease',
  outline: 'none'
});

const getDraftButtonStyle = (isHovered) => ({
  width: '100%',
  backgroundColor: isHovered ? COLORS.hoverBg : '#FFFFFF',
  border: `1px solid ${COLORS.border}`,
  borderRadius: '12px',
  padding: '22px 28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  boxShadow: isHovered ? '0 4px 12px rgba(96, 56, 40, 0.05)' : 'none',
  transition: 'all 0.2s ease',
  outline: 'none'
});