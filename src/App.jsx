import React, { useState, useEffect } from 'react';
import { FileText, Award, Heart, CheckCircle, ChevronRight, CalendarDays, History, BookOpen } from 'lucide-react';
import Formulario from './components/Formulario';
import VistaImpresion from './components/VistaImpresion';
import Formatos from './components/Formatos';
import Historial from './components/Historial';
import Digitalizacion from './components/Digitalizacion';

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
  const [historial, setHistorial] = useState([]);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredHistorial, setHoveredHistorial] = useState(false);
  const [hoveredFormatos, setHoveredFormatos] = useState(false);
  const [hoveredDigitalizacion, setHoveredDigitalizacion] = useState(false);
  const [hoveredFooterLogo, setHoveredFooterLogo] = useState(false);

  // Cargar historial desde localStorage al montar la app
  useEffect(() => {
    const guardados = localStorage.getItem('historial_certificados');
    if (guardados) {
      try {
        setHistorial(JSON.parse(guardados));
      } catch (e) {
        console.error('Error al cargar historial:', e);
      }
    }
  }, []);

  // Inicializar un formulario con la nueva estructura de campos
  const initForm = (type) => {
    setCertType(type);
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    setFormData({
      id: Date.now().toString(), // ID Único
      
      // Número de Expediente Numérico Puro y Tipo de Sacramento
      numeroExpediente: '',
      tipoSacramento: type,

      // Libros Eclesiales e Información Adicional
      libro: '',
      folio: '',
      fechaSacramento: '',
      lugarSacramento: 'Parroquia Sta. Teresita del Niño Jesús',
      ministroTitulo: 'Presbítero',
      ministroNombre: '',
      
      // Padrinos (hasta 4)
      padrino1: '',
      padrino2: '',
      padrino3: '',
      padrino4: '',

      // Edad al recibir el sacramento
      edadAlSacramento: '',

      observaciones: '',

      // Expediente Civil Base
      civilRegistro: '',
      civilFechaPresentacion: '',
      civilNumActa: '',
      civilNumFolio: '',
      civilCertificadoNacimiento: '',
      civilMunicipio: '',
      civilEstado: '',

      // Datos de la Persona (Bautismo / Comunión / Confirmación)
      personaNombres: '',
      personaApellidos: '',
      personaFechaNac: '',
      personaLugarNac: '',
      padreNombre: '',
      madreNombre: '',

      // Matrimonio - Esposo
      esposoNombres: '',
      esposoApellidos: '',
      esposoFechaNac: '',
      esposoLugarNac: '',
      esposoPadre: '',
      esposoMadre: '',
      esposoCivilRegistro: '',
      esposoCivilActa: '',

      // Matrimonio - Esposa
      esposaNombres: '',
      esposaApellidos: '',
      esposaFechaNac: '',
      esposaLugarNac: '',
      esposaPadre: '',
      esposaMadre: '',
      esposaCivilRegistro: '',
      esposaCivilActa: '',

      // Matrimonio - Testigos
      testigo1: '',
      testigo2: '',

      // Expedición / Certificado
      motivo: '',
      fechaExpedicion: fechaHoy,
      tecnicoMun: '',
      tecnicoAnio: ''
    });
    setScreen('form');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar o Actualizar en Historial (Anti-duplicación)
  const guardarEnHistorial = (datosActuales, tipoActual) => {
    const itemGuardar = {
      id: datosActuales.id || Date.now().toString(),
      certType: tipoActual,
      formData: datosActuales,
      fechaGuardado: new Date().toISOString()
    };

    setHistorial((prev) => {
      const existeIndex = prev.findIndex((item) => item.id === itemGuardar.id);
      let nuevoHistorial = [...prev];

      if (existeIndex >= 0) {
        nuevoHistorial[existeIndex] = itemGuardar;
      } else {
        nuevoHistorial.unshift(itemGuardar);
      }

      localStorage.setItem('historial_certificados', JSON.stringify(nuevoHistorial));
      return nuevoHistorial;
    });
  };

  // Cargar elemento seleccionado desde el componente Historial
  const handleCargarDesdeHistorial = (item) => {
    setCertType(item.certType);
    setFormData(item.formData);
    setScreen('preview');
  };

  // Eliminar un item específico del historial
  const handleEliminarItem = (id) => {
    const filtrado = historial.filter((i) => i.id !== id);
    setHistorial(filtrado);
    localStorage.setItem('historial_certificados', JSON.stringify(filtrado));
  };

  // Vaciar todo el historial
  const handleVaciarHistorial = () => {
    if (window.confirm('¿Está seguro de que desea vaciar todo el historial de certificados guardados?')) {
      setHistorial([]);
      localStorage.removeItem('historial_certificados');
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.cream, minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", margin: 0, overflowX: 'hidden' }}>
      
      {/* HEADER: BANNER INSTITUCIONAL EQUILIBRADO */}
      <div className="no-print" style={{ backgroundColor: COLORS.brown, height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', width: '100%', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/teresitalogo.png" alt="Logo" style={{ height: '68px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '30px', backgroundColor: COLORS.gold, opacity: 0.5 }}></div>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: '16px', color: COLORS.cream, letterSpacing: '0.5px', cursor: 'pointer' }} onClick={() => setScreen('home')}>
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
              Seleccione el tipo de documento eclesiástico que desea emitir o consultar
            </p>

            {/* REJILLA DE CERTIFICADOS CON MANEJO DE HOVER DINÁMICO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              
              <button onClick={() => initForm('bautizo')} onMouseEnter={() => setHoveredCard('bautizo')} onMouseLeave={() => setHoveredCard(null)} style={getCardStyle(hoveredCard === 'bautizo')}>
                <FileText size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE BAUTIZO
              </button>

              <button onClick={() => initForm('comunion')} onMouseEnter={() => setHoveredCard('comunion')} onMouseLeave={() => setHoveredCard(null)} style={getCardStyle(hoveredCard === 'comunion')}>
                <Award size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE PRIMERA COMUNIÓN
              </button>

              <button onClick={() => initForm('confirmacion')} onMouseEnter={() => setHoveredCard('confirmacion')} onMouseLeave={() => setHoveredCard(null)} style={getCardStyle(hoveredCard === 'confirmacion')}>
                <CheckCircle size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE CONFIRMACIÓN
              </button>

              <button onClick={() => initForm('matrimonio')} onMouseEnter={() => setHoveredCard('matrimonio')} onMouseLeave={() => setHoveredCard(null)} style={getCardStyle(hoveredCard === 'matrimonio')}>
                <Heart size={48} color={COLORS.gold} strokeWidth={1.1} /> 
                CERTIFICADO DE MATRIMONIO
              </button>

            </div>

            {/* ENLACES Y BOTONES OPERATIVOS INFERIORES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* BOTÓN: DIGITALIZACIÓN DE LIBROS */}
              <button 
                onClick={() => setScreen('digitalizacion')}
                onMouseEnter={() => setHoveredDigitalizacion(true)}
                onMouseLeave={() => setHoveredDigitalizacion(false)}
                style={getDraftButtonStyle(hoveredDigitalizacion)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <BookOpen size={24} color={COLORS.gold} strokeWidth={1.3} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: COLORS.brown, marginBottom: '2px' }}>
                      DIGITALIZACIÓN DE LIBROS PARROQUIALES
                    </span>
                    <span style={{ fontSize: '12px', color: COLORS.textLight }}>
                      Carga progresiva de libros físicos de bautismos, matrimonios y expedientes civiles
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} color={COLORS.gold} style={{ transform: hoveredDigitalizacion ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {/* BOTÓN: FORMATOS E INTENCIONES DIARIAS */}
              <button 
                onClick={() => setScreen('formatos')}
                onMouseEnter={() => setHoveredFormatos(true)}
                onMouseLeave={() => setHoveredFormatos(false)}
                style={getDraftButtonStyle(hoveredFormatos)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <CalendarDays size={24} color={COLORS.gold} strokeWidth={1.3} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: COLORS.brown, marginBottom: '2px' }}>
                      FORMATOS E INTENCIONES DIARIAS
                    </span>
                    <span style={{ fontSize: '12px', color: COLORS.textLight }}>
                      Automatizar hojas del libro de intenciones y plantillas de control de solicitudes A4
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} color={COLORS.gold} style={{ transform: hoveredFormatos ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {/* BOTÓN: HISTORIAL DE CERTIFICADOS GUARDADOS */}
              <button 
                onClick={() => setScreen('historial')}
                onMouseEnter={() => setHoveredHistorial(true)}
                onMouseLeave={() => setHoveredHistorial(false)}
                style={getDraftButtonStyle(hoveredHistorial)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <History size={24} color={COLORS.gold} strokeWidth={1.3} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: COLORS.brown, marginBottom: '2px' }}>
                      HISTORIAL DE CERTIFICADOS ({historial.length})
                    </span>
                    <span style={{ fontSize: '12px', color: COLORS.textLight }}>
                      Consulte y reabra actas generadas previamente guardadas localmente en este dispositivo
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} color={COLORS.gold} style={{ transform: hoveredHistorial ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

            </div>
          </div>
        )}

        {screen === 'form' && (
          <Formulario 
            certType={certType} 
            formData={formData} 
            onChange={handleInputChange} 
            onBack={() => setScreen('home')} 
            onPreview={() => {
              guardarEnHistorial(formData, certType);
              setScreen('preview');
            }} 
          />
        )}

        {screen === 'preview' && (
          <VistaImpresion 
            certType={certType} 
            formData={formData} 
            onBack={() => setScreen('form')} 
            onPrint={() => {
              guardarEnHistorial(formData, certType);
              window.print();
            }}
          />
        )}

        {screen === 'formatos' && (
          <Formatos onBack={() => setScreen('home')} />
        )}

        {screen === 'historial' && (
          <Historial 
            historial={historial}
            onCargar={handleCargarDesdeHistorial}
            onEliminar={handleEliminarItem}
            onVaciar={handleVaciarHistorial}
            onVolver={() => setScreen('home')}
          />
        )}

        {screen === 'digitalizacion' && (
          <Digitalizacion onVolver={() => setScreen('home')} />
        )}
      </main>

      {/* FOOTER PREMIUM */}
      <div className="no-print" style={{ backgroundColor: COLORS.brown, padding: '24px 40px', color: 'rgba(255,255,255,0.70)', fontSize: '12px', borderTop: `1px solid rgba(196, 158, 101, 0.25)`, width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <b style={{ color: '#FFF' }}>Herramienta de Digitalización de Certificados Parroquiales</b> — Parroquia Santa Teresita
          </div>
          
          <div 
            onMouseEnter={() => setHoveredFooterLogo(true)}
            onMouseLeave={() => setHoveredFooterLogo(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.65)',
              backgroundColor: hoveredFooterLogo ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: hoveredFooterLogo ? `1px solid ${COLORS.gold}` : '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              transform: hoveredFooterLogo ? 'translateY(-1px)' : 'none',
              boxShadow: hoveredFooterLogo ? '0 4px 12px rgba(196, 158, 101, 0.15)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }}
          >
            <span>Desarrollado por</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '8px' }}>
              <img 
                src="/personal_monotipo1.png" 
                alt="Logo personal" 
                style={{ 
                  height: '18px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: hoveredFooterLogo ? 'drop-shadow(0 0 4px rgba(196, 158, 101, 0.5))' : 'none',
                  transition: 'filter 0.25s ease'
                }} 
              />
              <span style={{ 
                color: COLORS.gold, 
                fontWeight: '700', 
                fontFamily: "'Segoe UI', Roboto, sans-serif", 
                letterSpacing: '0.8px',
                fontSize: '12px'
              }}>
                MTI
              </span>
            </div>
          </div>
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

// FUNCIONES DINÁMICAS DE ESTILOS
const getCardStyle = (isHovered) => ({
  backgroundColor: isHovered ? COLORS.hoverBg : '#FFFFFF',
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