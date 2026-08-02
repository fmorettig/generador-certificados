import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ArrowLeft, Plus, Search, ChevronRight, 
  Save, CheckCircle2, ShieldAlert, User, Award, Cross, PlusCircle, Lock, Printer
} from 'lucide-react';

const COLORS = {
  brown: '#603828',
  gold: '#C49E65',
  cream: '#FAF6F0',
  white: '#FFFFFF',
  textLight: '#8D6E63',
  border: '#E6DFD5',
  hoverBg: '#FDFBF7'
};

const INITIAL_JSON_STRUCTURE = {
  numero_expediente: '',
  fecha_registro_sistema: new Date().toISOString().split('T')[0],
  
  persona: {
    nombre_completo: '',
    fecha_nacimiento: '',
    lugar_nacimiento: { ciudad: 'Barquisimeto', estado: 'Lara' },
    padre: { nombre_completo: '' },
    madre: { nombre_completo: '' }
  },

  datos_civiles: {
    registro_civil: 'Registro Civil Parroquia Catedral',
    fecha_presentacion: '',
    numero_acta: '',
    numero_certificado_nacimiento: '',
    folio: ''
  },

  sacramentos: {
    bautismo: {
      registrado_en_parroquia: true,
      parroquia_externa: '',
      libro: '',
      folio: '',
      numero_acta: '',
      fecha_sacramento: '',
      ministro: { titulo: 'Pbro.', nombre_completo: '' },
      padrinos: ['']
    },
    primera_comunion: null,
    confirmacion: null,
    matrimonio: null,
    defuncion: null
  }
};

export default function Digitalizacion({ onVolver, onVerImpresion }) {
  const [expedientes, setExpedientes] = useState([]);
  const [modo, setModo] = useState('lista'); // 'lista' | 'tipeo' | 'ficha'
  const [paso, setPaso] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  
  const [expedienteActivo, setExpedienteActivo] = useState(INITIAL_JSON_STRUCTURE);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  // Estado para formulario de nuevo sacramento en Ficha
  const [sacramentoTipo, setSacramentoTipo] = useState('');
  const [nuevoSacramento, setNuevoSacramento] = useState({
    registrado_en_parroquia: true,
    parroquia_externa: '',
    libro: '',
    folio: '',
    numero_acta: '',
    fecha_sacramento: '',
    ministro: { titulo: 'Pbro.', nombre_completo: '' },
    padrinos: [''],
    esposo_a: '' // Para matrimonio
  });

  // Cargar expedientes guardados
  useEffect(() => {
    const guardados = localStorage.getItem('expedientes_bautismos_db');
    if (guardados) {
      try { setExpedientes(JSON.parse(guardados)); } catch (e) { console.error(e); }
    }
  }, []);

  // Atajo Ctrl + S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (modo === 'tipeo') {
          handleGuardarYCrearOtro();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modo, expedienteActivo]);

  const guardarEnAlmacen = (nuevosExpedientes) => {
    setExpedientes(nuevosExpedientes);
    localStorage.setItem('expedientes_bautismos_db', JSON.stringify(nuevosExpedientes));
  };

  // --- ADAPTADOR DE DATOS HACIA VISTAIMPRESION.JSX ---
  const handlePrepararImpresion = (tipo, sacramentoData) => {
    if (!onVerImpresion) {
      alert("⚠️ La función 'onVerImpresion' no fue proporcionada por el componente padre.");
      return;
    }

    const pers = expedienteSeleccionado.persona || {};
    const civ = expedienteSeleccionado.datos_civiles || {};

    // Mapear el objeto formData en el formato plano que requiere VistaImpresion
    const formData = {
      // Datos del Registro Eclesiástico
      libro: sacramentoData.libro || '',
      folio: sacramentoData.folio || '',
      numero: sacramentoData.numero_acta || '',
      anio: sacramentoData.fecha_sacramento ? sacramentoData.fecha_sacramento.split('-')[0] : '',
      fechaSacramento: sacramentoData.fecha_sacramento || '',

      // Personales
      bautizadoNombres: pers.nombre_completo || '',
      bautizadoApellidos: '',
      lugarNacimiento: pers.lugar_nacimiento ? `${pers.lugar_nacimiento.ciudad || ''}, ${pers.lugar_nacimiento.estado || ''}`.trim() : '',
      fechaNacimiento: pers.fecha_nacimiento || '',
      
      // Padres
      padreNombre: pers.padre?.nombre_completo || '',
      madreNombre: pers.madre?.nombre_completo || '',

      // Padrinos y Ministro
      padrino: sacramentoData.padrinos?.[0] || '',
      madrina: sacramentoData.padrinos?.[1] || sacramentoData.padrinos?.slice(1).join(', ') || '',
      ministro: sacramentoData.ministro ? `${sacramentoData.ministro.titulo} ${sacramentoData.ministro.nombre_completo}`.trim() : '',

      // Datos Civiles
      actaCivil: civ.numero_acta || '',
      fechaCivil: civ.fecha_presentacion || '',
      registroCivil: civ.registro_civil || '',
      municipioCivil: civ.numero_certificado_nacimiento || '',
      estadoCivilRegistro: civ.folio ? `Folio: ${civ.folio}` : '',

      // Datos de Matrimonio (Si aplica)
      esposoNombres: tipo === 'matrimonio' ? pers.nombre_completo : '',
      esposaNombres: tipo === 'matrimonio' ? (sacramentoData.esposo_a || '') : '',
      
      // Fieles de Expedición
      lugarExpedicion: 'Barquisimeto',
      fechaExpedicion: new Date().toISOString().split('T')[0],
      motivo: 'Documentación Oficial'
    };

    // Llamar a la vista de impresión con certType y formData
    onVerImpresion(tipo, formData);
  };

  // --- MANEJADORES FORMULARIO TIPEO ---
  const updatePersona = (field, value) => {
    setExpedienteActivo(prev => ({
      ...prev,
      persona: { ...prev.persona, [field]: value }
    }));
  };

  const updateLugarNacimiento = (field, value) => {
    setExpedienteActivo(prev => ({
      ...prev,
      persona: {
        ...prev.persona,
        lugar_nacimiento: { ...prev.persona.lugar_nacimiento, [field]: value }
      }
    }));
  };

  const updateDatosCiviles = (field, value) => {
    setExpedienteActivo(prev => ({
      ...prev,
      datos_civiles: { ...prev.datos_civiles, [field]: value }
    }));
  };

  const updateBautismo = (field, value) => {
    setExpedienteActivo(prev => ({
      ...prev,
      sacramentos: {
        ...prev.sacramentos,
        bautismo: { ...prev.sacramentos.bautismo, [field]: value }
      }
    }));
  };

  const updateMinistro = (field, value) => {
    setExpedienteActivo(prev => ({
      ...prev,
      sacramentos: {
        ...prev.sacramentos,
        bautismo: {
          ...prev.sacramentos.bautismo,
          ministro: { ...prev.sacramentos.bautismo.ministro, [field]: value }
        }
      }
    }));
  };

  const handlePadrinoChange = (index, value) => {
    const nuevosPadrinos = [...expedienteActivo.sacramentos.bautismo.padrinos];
    nuevosPadrinos[index] = value;
    updateBautismo('padrinos', nuevosPadrinos);
  };

  const addPadrino = () => {
    updateBautismo('padrinos', [...expedienteActivo.sacramentos.bautismo.padrinos, '']);
  };

  const removePadrino = (index) => {
    const nuevosPadrinos = expedienteActivo.sacramentos.bautismo.padrinos.filter((_, i) => i !== index);
    updateBautismo('padrinos', nuevosPadrinos);
  };

  // --- VALIDACIONES DE CAMPOS OBLIGATORIOS ---
  const validarPaso1 = () => {
    const p = expedienteActivo.persona;
    const c = expedienteActivo.datos_civiles;

    if (!p.nombre_completo.trim()) return "El nombre completo es obligatorio.";
    if (!p.fecha_nacimiento) return "La fecha de nacimiento es obligatoria.";
    if (!p.lugar_nacimiento.ciudad.trim() || !p.lugar_nacimiento.estado.trim()) return "La ciudad y estado de nacimiento son obligatorios.";
    if (!p.padre.nombre_completo.trim()) return "El nombre del padre es obligatorio.";
    if (!p.madre.nombre_completo.trim()) return "El nombre de la madre es obligatorio.";
    if (!c.registro_civil.trim()) return "El registro civil es obligatorio.";
    if (!c.numero_acta.trim()) return "El número de acta civil es obligatorio.";
    if (!c.numero_certificado_nacimiento.trim()) return "El certificado de nacimiento es obligatorio.";
    if (!c.folio.trim()) return "El folio civil es obligatorio.";
    if (!c.fecha_presentacion) return "La fecha de presentación civil es obligatoria.";

    return null;
  };

  const validarPaso2 = () => {
    const b = expedienteActivo.sacramentos.bautismo;

    if (!b.registrado_en_parroquia && !b.parroquia_externa.trim()) return "Debe ingresar el nombre de la parroquia externa.";
    if (!b.libro.trim()) return "El número de libro de bautismo es obligatorio.";
    if (!b.folio.trim()) return "El folio de bautismo es obligatorio.";
    if (!b.numero_acta.trim()) return "El número de acta de bautismo es obligatorio.";
    if (!b.fecha_sacramento) return "La fecha del bautismo es obligatoria.";
    if (!b.ministro.nombre_completo.trim()) return "El nombre del ministro/celebrante es obligatorio.";
    if (b.padrinos.some(p => !p.trim())) return "Todos los campos de padrinos/madrinas deben tener información.";

    return null;
  };

  const handleSiguientePaso = () => {
    const error = validarPaso1();
    if (error) {
      alert(`⚠️ Faltan datos en el Paso 1:\n${error}`);
      return;
    }
    setPaso(2);
  };

  const handleGuardarYCrearOtro = () => {
    const errorP1 = validarPaso1();
    if (errorP1) {
      alert(`⚠️ Faltan datos en el Paso 1:\n${errorP1}`);
      setPaso(1);
      return;
    }

    const errorP2 = validarPaso2();
    if (errorP2) {
      alert(`⚠️ Faltan datos en el Paso 2:\n${errorP2}`);
      return;
    }

    const conExpedienteNum = {
      ...expedienteActivo,
      numero_expediente: expedienteActivo.numero_expediente || Math.floor(1000 + Math.random() * 9000).toString(),
      fecha_registro_sistema: new Date().toISOString().split('T')[0]
    };

    const actualizados = [conExpedienteNum, ...expedientes];
    guardarEnAlmacen(actualizados);

    setExpedienteActivo(INITIAL_JSON_STRUCTURE);
    setPaso(1);
    alert('✅ Expediente guardado con éxito.');
  };

  // --- LÓGICA DE AGREGAR SACRAMENTO EN FICHA ---
  const handleGuardarSacramentoFicha = () => {
    if (!sacramentoTipo) {
      alert('Por favor seleccione qué sacramento desea registrar.');
      return;
    }

    if (expedienteSeleccionado.sacramentos[sacramentoTipo] !== null) {
      alert('⚠️ Este sacramento ya se encuentra registrado en el expediente.');
      return;
    }

    if (!nuevoSacramento.registrado_en_parroquia && !nuevoSacramento.parroquia_externa.trim()) {
      alert('Por favor especifique la Parroquia Externa.'); return;
    }
    if (!nuevoSacramento.libro.trim() || !nuevoSacramento.folio.trim() || !nuevoSacramento.numero_acta.trim()) {
      alert('Libro, Folio y N° de Acta son obligatorios.'); return;
    }
    if (!nuevoSacramento.fecha_sacramento) {
      alert('La fecha del sacramento es obligatoria.'); return;
    }
    if (!nuevoSacramento.ministro.nombre_completo.trim()) {
      alert('El nombre del ministro celebrante es obligatorio.'); return;
    }

    const sacramentoFormateado = {
      registrado_en_parroquia: nuevoSacramento.registrado_en_parroquia,
      parroquia_externa: nuevoSacramento.registrado_en_parroquia ? '' : nuevoSacramento.parroquia_externa,
      libro: nuevoSacramento.libro,
      folio: nuevoSacramento.folio,
      numero_acta: nuevoSacramento.numero_acta,
      fecha_sacramento: nuevoSacramento.fecha_sacramento,
      ministro: { ...nuevoSacramento.ministro },
      padrinos: nuevoSacramento.padrinos.filter(p => p.trim() !== '')
    };

    if (sacramentoTipo === 'matrimonio') {
      sacramentoFormateado.esposo_a = nuevoSacramento.esposo_a;
    }

    const expedienteActualizado = {
      ...expedienteSeleccionado,
      sacramentos: {
        ...expedienteSeleccionado.sacramentos,
        [sacramentoTipo]: sacramentoFormateado
      }
    };

    const listaActualizada = expedientes.map(exp => 
      exp.numero_expediente === expedienteActualizado.numero_expediente ? expedienteActualizado : exp
    );

    guardarEnAlmacen(listaActualizada);
    setExpedienteSeleccionado(expedienteActualizado);

    setSacramentoTipo('');
    setNuevoSacramento({
      registrado_en_parroquia: true,
      parroquia_externa: '',
      libro: '',
      folio: '',
      numero_acta: '',
      fecha_sacramento: '',
      ministro: { titulo: 'Pbro.', nombre_completo: '' },
      padrinos: [''],
      esposo_a: ''
    });

    alert('✅ Sacramento agregado correctamente a la ficha.');
  };

  const filtrados = expedientes.filter(e => {
    const q = busqueda.toLowerCase();
    const nombre = (e.persona?.nombre_completo || '').toLowerCase();
    const acta = (e.datos_civiles?.numero_acta || '').toLowerCase();
    const exp = (e.numero_expediente || '').toString();
    return nombre.includes(q) || acta.includes(q) || exp.includes(q);
  });

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* CABECERA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
        <button 
          onClick={() => {
            if (modo !== 'lista') { setModo('lista'); setPaso(1); }
            else onVolver();
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: COLORS.brown, cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} color={COLORS.brown} /> {modo === 'lista' ? 'Volver al Inicio' : 'Volver al Listado'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={24} color={COLORS.gold} />
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '24px', color: COLORS.brown, margin: 0 }}>
            Digitalización de Libros y Expedientes
          </h2>
        </div>
      </div>

      {/* VISTA 1: LISTADO */}
      {modo === 'lista' && (
        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={16} color={COLORS.textLight} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Buscar por Nombre, N° Expediente o Acta Civil..." 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)}
                style={inputStyleWithIcon}
              />
            </div>

            <button 
              onClick={() => { setExpedienteActivo(INITIAL_JSON_STRUCTURE); setModo('tipeo'); }}
              style={{ backgroundColor: COLORS.brown, color: COLORS.cream, border: 'none', borderRadius: '6px', padding: '11px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold' }}
            >
              <Plus size={16} color={COLORS.gold} /> Digitalizar Nuevo Expediente
            </button>
          </div>

          {filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: COLORS.textLight, fontSize: '14px' }}>
              {busqueda ? 'No se encontraron expedientes con ese criterio.' : 'Aún no hay expedientes registrados en la base local.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}`, color: COLORS.brown }}>
                    <th style={thStyle}>N° Exp.</th>
                    <th style={thStyle}>Persona / Titular</th>
                    <th style={thStyle}>Acta Civil</th>
                    <th style={thStyle}>Origen Bautismo</th>
                    <th style={thStyle}>Ubicación Eclesial</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((item) => (
                    <tr key={item.numero_expediente} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={tdStyle}><b>#{item.numero_expediente}</b></td>
                      <td style={tdStyle}><b>{item.persona.nombre_completo}</b></td>
                      <td style={tdStyle}>Acta N° {item.datos_civiles.numero_acta || '—'}</td>
                      <td style={tdStyle}>
                        {item.sacramentos.bautismo?.registrado_en_parroquia ? (
                          <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '11px' }}>Sta. Teresita</span>
                        ) : (
                          <span style={{ color: '#c62828', fontWeight: 'bold', fontSize: '11px' }}>{item.sacramentos.bautismo?.parroquia_externa || 'Externa'}</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        Libro: {item.sacramentos.bautismo?.libro || '—'} | Folio: {item.sacramentos.bautismo?.folio || '—'} | Acta: {item.sacramentos.bautismo?.numero_acta || '—'}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button 
                          onClick={() => { setExpedienteSeleccionado(item); setModo('ficha'); }}
                          style={{ backgroundColor: COLORS.hoverBg, border: `1px solid ${COLORS.border}`, borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: COLORS.brown, fontWeight: 'bold', fontSize: '12px' }}
                        >
                          Ver Ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: TIPEO EN 2 PASOS */}
      {modo === 'tipeo' && (
        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '30px' }}>
          
          {/* INDICADOR DE PASOS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: paso === 1 ? 1 : 0.5 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: COLORS.brown, color: COLORS.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
              <span style={{ fontWeight: 'bold', color: COLORS.brown }}>Paso 1: Expediente Civil (Identidad Base)</span>
            </div>
            <div style={{ width: '60px', height: '2px', backgroundColor: COLORS.border }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: paso === 2 ? 1 : 0.5 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: COLORS.brown, color: COLORS.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
              <span style={{ fontWeight: 'bold', color: COLORS.brown }}>Paso 2: Registro Eclesiástico (Bautismo)</span>
            </div>
          </div>

          {/* PASO 1: DATOS CIVILES */}
          {paso === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: "'Georgia', serif", color: COLORS.brown, margin: 0 }}>Paso 1: Expediente Civil (Identidad Base)</h3>
                <span style={{ fontSize: '12px', color: COLORS.textLight, fontWeight: 'bold' }}>N° Expediente: Auto / Asignado</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre Completo *</label>
                  <input type="text" value={expedienteActivo.persona.nombre_completo} onChange={(e) => updatePersona('nombre_completo', e.target.value)} style={inputStyle} placeholder="Ej: Juan Alberto Pérez Gómez" autoFocus required />
                </div>
                <div>
                  <label style={labelStyle}>Fecha de Nacimiento *</label>
                  <input type="date" value={expedienteActivo.persona.fecha_nacimiento} onChange={(e) => updatePersona('fecha_nacimiento', e.target.value)} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Ciudad Nacimiento *</label>
                  <input type="text" value={expedienteActivo.persona.lugar_nacimiento.ciudad} onChange={(e) => updateLugarNacimiento('ciudad', e.target.value)} style={inputStyle} placeholder="Barquisimeto" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Nombre del Padre *</label>
                  <input type="text" value={expedienteActivo.persona.padre.nombre_completo} onChange={(e) => setExpedienteActivo({...expedienteActivo, persona: {...expedienteActivo.persona, padre: {nombre_completo: e.target.value}}})} style={inputStyle} placeholder="Ej: Carlos Eduardo Pérez" required />
                </div>
                <div>
                  <label style={labelStyle}>Nombre de la Madre *</label>
                  <input type="text" value={expedienteActivo.persona.madre.nombre_completo} onChange={(e) => setExpedienteActivo({...expedienteActivo, persona: {...expedienteActivo.persona, madre: {nombre_completo: e.target.value}}})} style={inputStyle} placeholder="Ej: María Elena Gómez" required />
                </div>
              </div>

              <div style={{ backgroundColor: COLORS.hoverBg, padding: '16px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, marginBottom: '24px' }}>
                <b style={{ color: COLORS.brown, fontSize: '12px', display: 'block', marginBottom: '12px' }}>DATOS DEL ACTA CIVIL</b>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>Registro Civil / Prefectura *</label>
                    <input type="text" value={expedienteActivo.datos_civiles.registro_civil} onChange={(e) => updateDatosCiviles('registro_civil', e.target.value)} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>N° Acta Civil *</label>
                    <input type="text" value={expedienteActivo.datos_civiles.numero_acta} onChange={(e) => updateDatosCiviles('numero_acta', e.target.value)} style={inputStyle} placeholder="1234" required />
                  </div>
                  <div>
                    <label style={labelStyle}>N° Certificado Nac. *</label>
                    <input type="text" value={expedienteActivo.datos_civiles.numero_certificado_nacimiento} onChange={(e) => updateDatosCiviles('numero_certificado_nacimiento', e.target.value)} style={inputStyle} placeholder="CN-88901" required />
                  </div>
                  <div>
                    <label style={labelStyle}>Folio N° *</label>
                    <input type="text" value={expedienteActivo.datos_civiles.folio} onChange={(e) => updateDatosCiviles('folio', e.target.value)} style={inputStyle} placeholder="45" required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Fecha Presentación Civil *</label>
                  <input type="date" value={expedienteActivo.datos_civiles.fecha_presentacion} onChange={(e) => updateDatosCiviles('fecha_presentacion', e.target.value)} style={inputStyle} required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={handleSiguientePaso}
                  style={{ backgroundColor: COLORS.brown, color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                  Siguiente: Paso 2 (Bautismo) <ChevronRight size={16} color={COLORS.gold} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: BAUTISMO */}
          {paso === 2 && (
            <div>
              <h3 style={{ fontFamily: "'Georgia', serif", color: COLORS.brown, marginTop: 0, marginBottom: '20px' }}>Paso 2: Registro Eclesiástico (Bautismo)</h3>

              <div style={{ backgroundColor: COLORS.hoverBg, padding: '16px', borderRadius: '8px', border: `1px solid ${COLORS.gold}`, marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: COLORS.brown, fontSize: '14px' }}>
                  <input 
                    type="checkbox" 
                    checked={expedienteActivo.sacramentos.bautismo.registrado_en_parroquia} 
                    onChange={(e) => updateBautismo('registrado_en_parroquia', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: COLORS.brown }}
                  />
                  Bautizado en esta Parroquia (Parroquia Santa Teresita del Niño Jesús)
                </label>

                {!expedienteActivo.sacramentos.bautismo.registrado_en_parroquia && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Nombre de la Parroquia Externa *</label>
                    <input 
                      type="text" 
                      value={expedienteActivo.sacramentos.bautismo.parroquia_externa} 
                      onChange={(e) => updateBautismo('parroquia_externa', e.target.value)} 
                      style={inputStyle} 
                      placeholder="Ej: Parroquia Nuestra Señora de Coromoto" 
                      required
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Libro N° *</label>
                  <input type="text" value={expedienteActivo.sacramentos.bautismo.libro} onChange={(e) => updateBautismo('libro', e.target.value)} style={inputStyle} placeholder="01" required />
                </div>
                <div>
                  <label style={labelStyle}>Folio N° *</label>
                  <input type="text" value={expedienteActivo.sacramentos.bautismo.folio} onChange={(e) => updateBautismo('folio', e.target.value)} style={inputStyle} placeholder="14" required />
                </div>
                <div>
                  <label style={labelStyle}>N° Acta / Partida *</label>
                  <input type="text" value={expedienteActivo.sacramentos.bautismo.numero_acta} onChange={(e) => updateBautismo('numero_acta', e.target.value)} style={inputStyle} placeholder="45" required />
                </div>
                <div>
                  <label style={labelStyle}>Fecha del Bautismo *</label>
                  <input type="date" value={expedienteActivo.sacramentos.bautismo.fecha_sacramento} onChange={(e) => updateBautismo('fecha_sacramento', e.target.value)} style={inputStyle} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Título Ministro *</label>
                  <select value={expedienteActivo.sacramentos.bautismo.ministro.titulo} onChange={(e) => updateMinistro('titulo', e.target.value)} style={inputStyle}>
                    <option value="Pbro.">Pbro.</option>
                    <option value="Díac.">Díac.</option>
                    <option value="Mons.">Mons.</option>
                    <option value="S.E. Mons.">S.E. Mons.</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Nombre Celebrante / Ministro *</label>
                  <input type="text" value={expedienteActivo.sacramentos.bautismo.ministro.nombre_completo} onChange={(e) => updateMinistro('nombre_completo', e.target.value)} style={inputStyle} placeholder="José Antonio Silva" required />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Padrino(s) y Madrina(s) *</label>
                {expedienteActivo.sacramentos.bautismo.padrinos.map((padrino, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input 
                      type="text" 
                      value={padrino} 
                      onChange={(e) => handlePadrinoChange(idx, e.target.value)} 
                      style={inputStyle} 
                      placeholder={`Nombre completo padrino/madrina ${idx + 1}`} 
                      required
                    />
                    {expedienteActivo.sacramentos.bautismo.padrinos.length > 1 && (
                      <button type="button" onClick={() => removePadrino(idx)} style={{ border: 'none', background: '#ffebee', color: '#c62828', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}>X</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addPadrino} style={{ background: 'none', border: `1px dashed ${COLORS.gold}`, color: COLORS.brown, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  + Agregar otro Padrino/Madrina
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: `1px solid ${COLORS.border}` }}>
                <button type="button" onClick={() => setPaso(1)} style={{ backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', color: COLORS.textLight }}>
                  Atrás
                </button>

                <button 
                  type="button" 
                  onClick={handleGuardarYCrearOtro}
                  style={{ backgroundColor: COLORS.brown, color: COLORS.cream, border: `1px solid ${COLORS.gold}`, padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(96, 56, 40, 0.2)' }}
                >
                  <Save size={18} color={COLORS.gold} /> GUARDAR REGISTRO Y CREAR OTRO (Ctrl + S)
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* VISTA 3: FICHA DE LA PERSONA */}
      {modo === 'ficha' && expedienteSeleccionado && (
        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '30px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: COLORS.gold }}>EXPEDIENTE N° #{expedienteSeleccionado.numero_expediente}</span>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '24px', color: COLORS.brown, margin: '4px 0' }}>
                {expedienteSeleccionado.persona.nombre_completo}
              </h2>
              <span style={{ fontSize: '13px', color: COLORS.textLight }}>
                Nacimiento: {expedienteSeleccionado.persona.fecha_nacimiento || 'N/A'} ({expedienteSeleccionado.persona.lugar_nacimiento.ciudad})
              </span>
            </div>
            <button onClick={() => setModo('lista')} style={{ border: `1px solid ${COLORS.border}`, background: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', color: COLORS.brown, fontWeight: 'bold' }}>
              Volver al Listado
            </button>
          </div>

          {/* INFORMACIÓN FAMILIAR Y CIVIL */}
          <div style={{ backgroundColor: COLORS.hoverBg, padding: '16px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, marginBottom: '24px' }}>
            <b style={{ color: COLORS.brown, fontSize: '12px', display: 'block', marginBottom: '8px' }}>INFORMACIÓN FAMILIAR Y CIVIL</b>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div><b>Padre:</b> {expedienteSeleccionado.persona.padre?.nombre_completo || 'N/A'}</div>
              <div><b>Madre:</b> {expedienteSeleccionado.persona.madre?.nombre_completo || 'N/A'}</div>
              <div><b>Registro Civil:</b> {expedienteSeleccionado.datos_civiles.registro_civil}</div>
              <div><b>N° Acta:</b> {expedienteSeleccionado.datos_civiles.numero_acta} | <b>Folio:</b> {expedienteSeleccionado.datos_civiles.folio}</div>
              <div><b>Certificado Nac.:</b> {expedienteSeleccionado.datos_civiles.numero_certificado_nacimiento || 'N/A'}</div>
              <div><b>Fecha Presentación:</b> {expedienteSeleccionado.datos_civiles.fecha_presentacion || 'N/A'}</div>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Georgia', serif", color: COLORS.brown, fontSize: '18px', marginBottom: '16px' }}>
            Sacramentos Registrados
          </h3>

          {/* LISTADO Y TARJETAS DE SACRAMENTOS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px' }}>
            {Object.entries({
              bautismo: { label: 'Bautismo', certType: 'bautizo' },
              primera_comunion: { label: 'Primera Comunión', certType: 'comunion' },
              confirmacion: { label: 'Confirmación', certType: 'confirmacion' },
              matrimonio: { label: 'Matrimonio', certType: 'matrimonio' },
              defuncion: { label: 'Defunción', certType: 'defuncion' }
            }).map(([key, item]) => {
              const sac = expedienteSeleccionado.sacramentos[key];
              return (
                <div key={key} style={{ backgroundColor: sac ? '#FFF' : COLORS.hoverBg, padding: '16px', borderRadius: '8px', border: `1px solid ${sac ? COLORS.gold : COLORS.border}`, opacity: sac ? 1 : 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <b style={{ color: COLORS.brown, fontSize: '14px' }}>{item.label}</b>
                      {sac ? (
                        <span style={{ fontSize: '11px', color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Registrado</span>
                      ) : (
                        <span style={{ fontSize: '11px', color: COLORS.textLight, fontStyle: 'italic' }}>Sin Registro</span>
                      )}
                    </div>

                    {sac ? (
                      <div style={{ fontSize: '12px', color: '#333' }}>
                        <div><b>Lugar:</b> {sac.registrado_en_parroquia ? 'Parroquia Sta. Teresita' : sac.parroquia_externa}</div>
                        <div><b>Fecha:</b> {sac.fecha_sacramento}</div>
                        <div><b>Libro:</b> {sac.libro} | <b>Folio:</b> {sac.folio} | <b>Acta:</b> {sac.numero_acta}</div>
                        <div><b>Ministro:</b> {sac.ministro?.titulo} {sac.ministro?.nombre_completo}</div>
                        {sac.esposo_a && <div><b>Cónyuge:</b> {sac.esposo_a}</div>}
                        {sac.padrinos?.length > 0 && <div><b>Padrinos:</b> {sac.padrinos.join(', ')}</div>}
                      </div>
                    ) : (
                      <p style={{ fontSize: '12px', color: COLORS.textLight, margin: 0 }}>No hay partida registrada para este sacramento.</p>
                    )}
                  </div>

                  {/* BOTÓN IMPRIMIR CERTIFICADO */}
                  {sac && (
                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: `1px dashed ${COLORS.border}`, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handlePrepararImpresion(item.certType, sac)}
                        style={{ backgroundColor: COLORS.brown, color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Printer size={14} color={COLORS.gold} /> Imprimir Certificado
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MÓDULO PARA REGISTRAR NUEVO SACRAMENTO */}
          <div style={{ backgroundColor: COLORS.cream, padding: '20px', borderRadius: '10px', border: `1px solid ${COLORS.gold}` }}>
            <h4 style={{ fontFamily: "'Georgia', serif", color: COLORS.brown, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} color={COLORS.brown} /> Añadir Sacramento a la Ficha
            </h4>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Seleccionar Sacramento a Registrar *</label>
              <select 
                value={sacramentoTipo} 
                onChange={(e) => setSacramentoTipo(e.target.value)}
                style={inputStyle}
              >
                <option value="">-- Seleccionar Sacramento --</option>
                <option value="bautismo" disabled={expedienteSeleccionado.sacramentos.bautismo !== null}>
                  Bautismo {expedienteSeleccionado.sacramentos.bautismo !== null ? '(Ya registrado)' : ''}
                </option>
                <option value="primera_comunion" disabled={expedienteSeleccionado.sacramentos.primera_comunion !== null}>
                  Primera Comunión {expedienteSeleccionado.sacramentos.primera_comunion !== null ? '(Ya registrado)' : ''}
                </option>
                <option value="confirmacion" disabled={expedienteSeleccionado.sacramentos.confirmacion !== null}>
                  Confirmación {expedienteSeleccionado.sacramentos.confirmacion !== null ? '(Ya registrado)' : ''}
                </option>
                <option value="matrimonio" disabled={expedienteSeleccionado.sacramentos.matrimonio !== null}>
                  Matrimonio {expedienteSeleccionado.sacramentos.matrimonio !== null ? '(Ya registrado)' : ''}
                </option>
                <option value="defuncion" disabled={expedienteSeleccionado.sacramentos.defuncion !== null}>
                  Defunción {expedienteSeleccionado.sacramentos.defuncion !== null ? '(Ya registrado)' : ''}
                </option>
              </select>
            </div>

            {sacramentoTipo && (
              <div>
                <div style={{ backgroundColor: '#FFF', padding: '12px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: COLORS.brown, fontSize: '13px' }}>
                    <input 
                      type="checkbox" 
                      checked={nuevoSacramento.registrado_en_parroquia} 
                      onChange={(e) => setNuevoSacramento({...nuevoSacramento, registrado_en_parroquia: e.target.checked})}
                      style={{ accentColor: COLORS.brown }}
                    />
                    Celebrado en esta Parroquia (Parroquia Santa Teresita del Niño Jesús)
                  </label>

                  {!nuevoSacramento.registrado_en_parroquia && (
                    <div style={{ marginTop: '10px' }}>
                      <label style={labelStyle}>Nombre Parroquia Externa *</label>
                      <input 
                        type="text" 
                        value={nuevoSacramento.parroquia_externa} 
                        onChange={(e) => setNuevoSacramento({...nuevoSacramento, parroquia_externa: e.target.value})}
                        style={inputStyle} 
                        placeholder="Ej: Parroquia San Francisco"
                      />
                    </div>
                  )}
                </div>

                {sacramentoTipo === 'matrimonio' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Nombre Completo del Cónyuge *</label>
                    <input 
                      type="text" 
                      value={nuevoSacramento.esposo_a} 
                      onChange={(e) => setNuevoSacramento({...nuevoSacramento, esposo_a: e.target.value})}
                      style={inputStyle} 
                      placeholder="Nombre del Esposo/a"
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Libro N° *</label>
                    <input type="text" value={nuevoSacramento.libro} onChange={(e) => setNuevoSacramento({...nuevoSacramento, libro: e.target.value})} style={inputStyle} placeholder="02" />
                  </div>
                  <div>
                    <label style={labelStyle}>Folio N° *</label>
                    <input type="text" value={nuevoSacramento.folio} onChange={(e) => setNuevoSacramento({...nuevoSacramento, folio: e.target.value})} style={inputStyle} placeholder="10" />
                  </div>
                  <div>
                    <label style={labelStyle}>N° Acta *</label>
                    <input type="text" value={nuevoSacramento.numero_acta} onChange={(e) => setNuevoSacramento({...nuevoSacramento, numero_acta: e.target.value})} style={inputStyle} placeholder="25" />
                  </div>
                  <div>
                    <label style={labelStyle}>Fecha Sacramento *</label>
                    <input type="date" value={nuevoSacramento.fecha_sacramento} onChange={(e) => setNuevoSacramento({...nuevoSacramento, fecha_sacramento: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Título Ministro *</label>
                    <select value={nuevoSacramento.ministro.titulo} onChange={(e) => setNuevoSacramento({...nuevoSacramento, ministro: {...nuevoSacramento.ministro, titulo: e.target.value}})} style={inputStyle}>
                      <option value="Pbro.">Pbro.</option>
                      <option value="Díac.">Díac.</option>
                      <option value="Mons.">Mons.</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Nombre Ministro / Celebrante *</label>
                    <input type="text" value={nuevoSacramento.ministro.nombre_completo} onChange={(e) => setNuevoSacramento({...nuevoSacramento, ministro: {...nuevoSacramento.ministro, nombre_completo: e.target.value}})} style={inputStyle} placeholder="Ej: Padre Ramón Linares" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={handleGuardarSacramentoFicha}
                    style={{ backgroundColor: COLORS.brown, color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    Guardar Sacramento en Expediente
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

// ESTILOS AUXILIARES
const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 'bold',
  color: COLORS.textLight,
  marginBottom: '4px',
  textTransform: 'uppercase'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: `1px solid ${COLORS.border}`,
  outline: 'none',
  fontSize: '13px',
  boxSizing: 'border-box',
  backgroundColor: '#FFF'
};

const inputStyleWithIcon = {
  ...inputStyle,
  paddingLeft: '36px'
};

const thStyle = {
  padding: '10px 12px',
  fontWeight: 'bold',
  fontSize: '12px',
  letterSpacing: '0.5px'
};

const tdStyle = {
  padding: '12px'
};