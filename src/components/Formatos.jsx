import React, { useState } from 'react';

const COLORS = { brown: '#603828', gold: '#C49E65', cream: '#FAF6F0', white: '#FFFFFF', border: '#E6DFD5', text: '#333333' };

export default function Formatos({ onBack }) {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedFormat, setSelectedFormat] = useState('intenciones');
  const [showConfig, setShowConfig] = useState(false);
  const [numControl, setNumControl] = useState('');
  
  // Configuración de Horarios
  const [horarios, setHorarios] = useState({
    Lunes: [{ hora: '6:00 PM', activo: true }],
    Martes: [{ hora: '6:00 PM', activo: true }],
    Miércoles: [{ hora: '6:00 PM', activo: true }],
    Jueves: [{ hora: '6:00 PM', activo: true }],
    Viernes: [{ hora: '6:00 PM', activo: true }],
    Sábado: [{ hora: '6:00 PM', activo: true }],
    Domingo: [
      { hora: '9:00 AM', activo: true },
      { hora: '11:00 AM', activo: true },
      { hora: '5:00 PM', activo: false }
    ]
  });

  // Estado del Calendario
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // Julio
  const [selectedDays, setSelectedDays] = useState([]); 

  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const diasSemanaNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    let startDay = date.getDay() - 1;
    if (startDay === -1) startDay = 6;
    for (let i = 0; i < startDay; i++) days.push(null);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const toggleDaySelection = (dateStr) => {
    if (selectedDays.includes(dateStr)) {
      setSelectedDays(selectedDays.filter(d => d !== dateStr));
    } else {
      setSelectedDays([...selectedDays, dateStr]);
    }
  };

  const seleccionarProximaSemana = () => {
    const hoy = new Date(2026, 6, 18); 
    const proximos = [];
    for (let i = 0; i < 7; i++) {
      const sig = new Date(hoy);
      sig.setDate(hoy.getDate() + i);
      const str = `${sig.getFullYear()}-${String(sig.getMonth() + 1).padStart(2, '0')}-${String(sig.getDate()).padStart(2, '0')}`;
      proximos.push(str);
    }
    setSelectedDays(proximos);
  };

  const seleccionarTodoElMes = () => {
    const date = new Date(currentYear, currentMonth, 1);
    const todos = [];
    while (date.getMonth() === currentMonth) {
      const str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      todos.push(str);
      date.setDate(date.getDate() + 1);
    }
    setSelectedDays(todos);
  };

  const formatearFechaLarga = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let formateada = d.toLocaleDateString('es-ES', opciones);
    return formateada.charAt(0).toUpperCase() + formateada.slice(1);
  };

  const generarPaginasImpresion = () => {
    const paginas = [];
    const fechasOrdenadas = [...selectedDays].sort();
    fechasOrdenadas.forEach(fechaStr => {
      const d = new Date(fechaStr + "T00:00:00");
      const nombreDiaSemana = diasSemanaNombres[d.getDay()];
      const horariosDelDia = horarios[nombreDiaSemana] || [];
      const horasActivas = horariosDelDia.filter(h => h.activo);
      if (horasActivas.length === 0) {
        paginas.push({ fecha: fechaStr, hora: null });
      } else {
        horasActivas.forEach(h => {
          paginas.push({ fecha: fechaStr, hora: h.hora });
        });
      }
    });
    return paginas;
  };

  const paginasAIprimir = generarPaginasImpresion();
  const filasDeTabla = Array.from({ length: 28 });

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {activeTab === 'menu' && (
        <div style={{ backgroundColor: COLORS.white, width: '100%', maxWidth: '900px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, padding: '35px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          
          {/* Encabezado */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: `1px solid ${COLORS.cream}`, paddingBottom: '15px' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: COLORS.brown, fontWeight: 'bold', cursor: 'pointer' }}>← INICIO</button>
            <h2 style={{ margin: 0, fontSize: '16px', color: COLORS.brown, fontFamily: "'Georgia', serif", letterSpacing: '0.5px' }}>AUTOMATIZACIÓN DE FORMATOS DIARIOS</h2>
            <button onClick={() => setShowConfig(!showConfig)} style={{ backgroundColor: COLORS.cream, border: `1px solid ${COLORS.border}`, padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: COLORS.brown, fontWeight: 'bold' }}>
              {showConfig ? 'Ocultar Horarios ⚙' : 'Configurar Horarios ⚙'}
            </button>
          </div>

          {/* Configuración de Horarios */}
          {showConfig && (
            <div style={{ backgroundColor: COLORS.cream, padding: '20px', borderRadius: '8px', marginBottom: '25px', border: `1px solid ${COLORS.border}` }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: COLORS.brown, fontWeight: 'bold' }}>CONFIGURACIÓN DE HORARIOS HABITUALES POR MISA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {Object.keys(horarios).map(dia => (
                  <div key={dia} style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                    <b style={{ fontSize: '12px', color: COLORS.brown }}>{dia}</b>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {horarios[dia].map((h, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={h.activo} onChange={(e) => {
                            const copia = { ...horarios };
                            copia[dia][idx].activo = e.target.checked;
                            setHorarios(copia);
                          }} />
                          {h.hora}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Formato Base */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div onClick={() => setSelectedFormat('intenciones')} style={{ flex: 1, padding: '20px', borderRadius: '8px', border: `2px solid ${selectedFormat === 'intenciones' ? COLORS.brown : COLORS.border}`, backgroundColor: selectedFormat === 'intenciones' ? COLORS.cream : '#fff', cursor: 'pointer', transition: '0.2s' }}>
              <b style={{ display: 'block', color: COLORS.brown, fontSize: '14px' }}>Libro de Intenciones Diarias</b>
              <span style={{ fontSize: '12px', color: '#666' }}>Genera las hojas diarias para intenciones de difuntos, acción de gracias y balance de colecta.</span>
            </div>
            <div onClick={() => setSelectedFormat('solicitudes')} style={{ flex: 1, padding: '20px', borderRadius: '8px', border: `2px solid ${selectedFormat === 'solicitudes' ? COLORS.brown : COLORS.border}`, backgroundColor: selectedFormat === 'solicitudes' ? COLORS.cream : '#fff', cursor: 'pointer', transition: '0.2s' }}>
              <b style={{ display: 'block', color: COLORS.brown, fontSize: '14px' }}>Control de Solicitudes</b>
              <span style={{ fontSize: '12px', color: '#666' }}>Formato impreso horizontal de 15 filas con correlativo y control numérico.</span>
            </div>
          </div>

          {/* UI Dinámica */}
          {selectedFormat === 'intenciones' ? (
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1.2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <b style={{ color: COLORS.brown, fontSize: '14px' }}>{nombresMeses[currentMonth]} {currentYear}</b>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else { setCurrentMonth(currentMonth - 1); } }} style={btnArrow}>←</button>
                    <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else { setCurrentMonth(currentMonth + 1); } }} style={btnArrow}>→</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                  {diasSemana.map((d, idx) => (
                    <div key={idx} style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', paddingBottom: '4px' }}>{d}</div>
                  ))}
                  {getDaysInMonth(currentYear, currentMonth).map((dateObj, idx) => {
                    if (!dateObj) return <div key={idx} />;
                    const str = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                    const isSelected = selectedDays.includes(str);
                    return (
                      <div key={idx} onClick={() => toggleDaySelection(str)} style={{
                        padding: '10px 0', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: isSelected ? COLORS.brown : COLORS.cream,
                        color: isSelected ? '#fff' : COLORS.brown,
                        border: str === '2026-07-18' ? '2px solid ' + COLORS.gold : 'none'
                      }}>
                        {dateObj.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ flex: 0.8, backgroundColor: COLORS.cream, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <b style={{ fontSize: '13px', color: COLORS.brown }}>Automatización Veloz</b>
                <button onClick={seleccionarProximaSemana} style={btnSecundario}>Seleccionar próxima semana</button>
                <button onClick={seleccionarTodoElMes} style={btnSecundario}>Seleccionar todo el mes</button>
                <button onClick={() => setSelectedDays([])} style={{ ...btnSecundario, color: '#d32f2f' }}>Limpiar selección</button>
                
                <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: '10px', paddingTop: '15px' }}>
                  <div style={{ fontSize: '12px', marginBottom: '10px', color: COLORS.text }}>
                    Días marcados: <b>{selectedDays.length} días</b> <br />
                    Hojas totales a imprimir: <b>{paginasAIprimir.length} páginas</b>
                  </div>
                  <button 
                    disabled={selectedDays.length === 0}
                    onClick={() => setActiveTab('print-intenciones')}
                    style={{ ...btnPrincipal, opacity: selectedDays.length === 0 ? 0.5 : 1, cursor: selectedDays.length === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    GENERAR VISTA PREVIA →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: COLORS.cream, borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
              <h3 style={{ margin: '0 0 10px 0', color: COLORS.brown, fontFamily: "'Georgia', serif" }}>Formato Único de Control Parroquial</h3>
              <p style={{ fontSize: '13px', color: '#666', maxWidth: '520px', margin: '0 auto 15px auto' }}>
                Este formato genera una planilla limpia optimizada para el despacho, con las 11 columnas exactas y espacio para N° de Control.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: COLORS.brown }}>N° Control (opcional):</label>
                <input 
                  type="text" 
                  placeholder="Ej: 001"
                  value={numControl}
                  onChange={(e) => setNumControl(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '4px', border: `1px solid ${COLORS.border}`, fontSize: '12px', width: '110px', textAlign: 'center' }}
                />
              </div>

              <button onClick={() => setActiveTab('print-solicitudes')} style={{ ...btnPrincipal, maxWidth: '280px', margin: '0 auto' }}>
                GENERAR VISTA PREVIA →
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* VISTA PREVIA DE IMPRESIÓN: INTENCIONES DEL DÍA */}
      {/* ========================================== */}
      {activeTab === 'print-intenciones' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div className="no-print" style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('menu')} style={btnSecundario}>← VOLVER AL ASISTENTE</button>
            <button onClick={() => window.print()} style={btnPrincipal}>IMPRIMIR TODAS LAS HOJAS ({paginasAIprimir.length})</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '800px' }}>
            {paginasAIprimir.map((pag, index) => (
              <div key={index} className="print-page sheet-intenciones" style={sheetContainer}>
                
                {/* Membrete Oficial */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #603828', paddingBottom: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/stateresita.png" style={{ height: '55px', width: 'auto' }} alt="Logo" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '11px', color: COLORS.brown, fontWeight: 'bold', letterSpacing: '0.5px' }}>PARROQUIA SANTA TERESITA DEL NIÑO JESÚS</h4>
                      <p style={{ margin: 0, fontSize: '9px', color: '#666', fontStyle: 'italic' }}>Urb. del Este - Barquisimeto - Edo. Lara</p>
                    </div>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '17px', fontFamily: "'Georgia', serif", fontWeight: 'bold', color: COLORS.brown, letterSpacing: '1px' }}>INTENCIONES DEL DÍA</h2>
                </div>

                {/* Sub-encabezado Variable con Fecha y Hora */}
                <div style={{ textAlign: 'center', margin: '4px 0', fontSize: '11.5px', color: COLORS.brown, display: 'flex', justifyContent: 'center', gap: '5px', alignItems: 'center' }}>
                  <span>Fecha:</span>
                  <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', borderBottom: '1px solid #000', padding: '0 15px', fontWeight: 'bold' }}>
                    {formatearFechaLarga(pag.fecha)} {pag.hora ? ` — Misa: ${pag.hora}` : ''}
                  </span>
                </div>

                {/* Tablas Estructuradas en Paralelo */}
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  
{/* SECCIÓN 1: DIFUNTOS */}
<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', backgroundColor: '#FFFDF9', border: '1px solid #C49E65' }}>
    {/* COLGROUP GARANTIZA EL ANCHO EXACTO DE 75% Y 25% */}
    <colgroup>
      <col style={{ width: '75%' }} />
      <col style={{ width: '25%' }} />
    </colgroup>
    <thead>
      <tr>
        <th colSpan="2" style={{ backgroundColor: '#603828', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '6px 4px', textAlign: 'center', letterSpacing: '1px' }}>
          DIFUNTOS
        </th>
      </tr>
      <tr style={{ borderBottom: '1px solid #C49E65', backgroundColor: '#FAF6F0' }}>
        <th style={{ fontSize: '9px', fontWeight: 'bold', color: '#603828', padding: '3px', textAlign: 'center', borderRight: '1px solid #C49E65' }}>INTENCION</th>
        <th style={{ fontSize: '9px', fontWeight: 'bold', color: '#603828', padding: '3px', textAlign: 'center' }}>OBSERVACIONES</th>
      </tr>
    </thead>
    <tbody>
      {filasDeTabla.map((_, rIdx) => (
        <tr key={rIdx} style={{ height: '28px', borderBottom: '1px solid #C49E65' }}>
          <td style={{ borderRight: '1px solid #C49E65', padding: 0 }}></td>
          <td style={{ padding: 0 }}></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* SECCIÓN 2: ACCIÓN DE GRACIAS */}
<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', backgroundColor: '#FFFDF9', border: '1px solid #C49E65' }}>
    {/* COLGROUP GARANTIZA EL ANCHO EXACTO DE 75% Y 25% */}
    <colgroup>
      <col style={{ width: '75%' }} />
      <col style={{ width: '25%' }} />
    </colgroup>
    <thead>
      <tr>
        <th colSpan="2" style={{ backgroundColor: '#603828', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '6px 4px', textAlign: 'center', letterSpacing: '1px' }}>
          ACCIÓN DE GRACIAS
        </th>
      </tr>
      <tr style={{ borderBottom: '1px solid #C49E65', backgroundColor: '#FAF6F0' }}>
        <th style={{ fontSize: '9px', fontWeight: 'bold', color: '#603828', padding: '3px', textAlign: 'center', borderRight: '1px solid #C49E65' }}>INTENCION</th>
        <th style={{ fontSize: '9px', fontWeight: 'bold', color: '#603828', padding: '3px', textAlign: 'center' }}>OBSERVACIONES</th>
      </tr>
    </thead>
    <tbody>
      {filasDeTabla.map((_, rIdx) => (
        <tr key={rIdx} style={{ height: '28px', borderBottom: '1px solid #C49E65' }}>
          <td style={{ borderRight: '1px solid #C49E65', padding: 0 }}></td>
          <td style={{ padding: 0 }}></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
                </div>

                {/* Sección de Cierre: Colecta, Observaciones*/}
                <div style={{ border: '1.5px solid #C49E65', borderRadius: '6px', padding: '5px 12px', marginTop: '6px' }}>
                  <div style={{ textAlign: 'center', fontSize: '8.5px', fontWeight: 'bold', color: COLORS.brown, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.5px' }}>
                    ✦ TOTAL DE LA COLECTA ✦
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ flex: 1, fontSize: '10px', fontWeight: 'bold' }}>
                      Total colecta: &nbsp;$ <span style={{ borderBottom: '1px dashed #000', width: '60%', display: 'inline-block' }}></span>
                    </div>
                    <div style={{ flex: 2, fontSize: '9.5px' }}>
                      Observaciones: <span style={{ borderBottom: '1px dashed #000', width: '70%', display: 'inline-block', height: '11px' }}></span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VISTA PREVIA DE IMPRESIÓN: CONTROL DE SOLICITUDES */}
      {/* ========================================== */}
      {activeTab === 'print-solicitudes' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div className="no-print" style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <button onClick={() => setActiveTab('menu')} style={btnSecundario}>← VOLVER AL ASISTENTE</button>
            <button onClick={() => window.print()} style={btnPrincipal}>IMPRIMIR HOJA CONTROL</button>
          </div>

          <div className="print-page" style={{ ...sheetContainer, maxWidth: '1000px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #603828', paddingBottom: '6px', marginBottom: '6px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '33%' }}>
                <img src="/stateresita.png" style={{ height: '50px', width: 'auto' }} alt="Logo" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '10px', color: COLORS.brown, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PARROQUIA</h3>
                  <h2 style={{ margin: 0, fontSize: '12px', color: COLORS.brown, fontWeight: 'bold', fontFamily: "'Georgia', serif" }}>STA. TERESITA DEL NIÑO JESÚS</h2>
                  <p style={{ margin: 0, fontSize: '8.5px', color: '#666', fontStyle: 'italic' }}>Barquisimeto - Edo. Lara</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', width: '42%' }}>
                <h1 style={{ margin: 0, fontSize: '15px', fontFamily: "'Georgia', serif", color: COLORS.brown, letterSpacing: '0.5px', fontWeight: 'bold' }}>
                  CONTROL DE SOLICITUDES DE CERTIFICADOS
                </h1>
              </div>

              <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ border: '1.5px solid #603828', borderRadius: '4px', padding: '2px 8px', backgroundColor: '#FAF6F0', textAlign: 'center', minWidth: '90px' }}>
                  <div style={{ fontSize: '8px', fontWeight: 'bold', color: COLORS.brown, textTransform: 'uppercase', letterSpacing: '0.5px' }}>N° CONTROL</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000', fontFamily: 'monospace', minHeight: '13px', paddingTop: '1px' }}>
                    {numControl || '______'}
                  </div>
                </div>
              </div>

            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5px', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#603828', color: '#FFFFFF', textAlign: 'center' }}>
                  <th style={{ ...thControl, width: '3%' }}>N°</th>
                  <th style={{ ...thControl, width: '9%' }}>FECHA SOLICITUD</th>
                  <th style={{ ...thControl, width: '16%' }}>NOMBRE SOLICITANTE</th>
                  <th style={{ ...thControl, width: '12%' }}>TIPO CERTIFICADO</th>
                  <th style={{ ...thControl, width: '16%' }}>INFORMACIÓN ADICIONAL</th>
                  <th style={{ ...thControl, width: '12%' }}>DATOS CONTACTO</th>
                  <th style={{ ...thControl, width: '5%' }}>PAGO</th>
                  <th style={{ ...thControl, width: '7%' }}>REF</th>
                  <th style={{ ...thControl, width: '5%' }}>ENTREGADO</th>
                  <th style={{ ...thControl, width: '8%' }}>FECHA ENTREGA</th>
                  <th style={{ ...thControl, width: '7%' }}>OBSERVACIÓN</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(15)].map((_, idx) => (
                  <tr key={idx} style={{ height: '38px' }}>
                    <td style={{ ...tdControl, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#FAF6F0', color: COLORS.brown }}>{idx + 1}</td>
                    <td style={{ ...tdControl, textAlign: 'center', color: '#999', fontSize: '8px' }}>___/___/___</td>
                    <td style={tdControl}></td>
                    <td style={tdControl}></td>
                    <td style={{ ...tdControl, padding: '1px 4px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center', height: '100%' }}>
                        <div style={{ borderBottom: '1px dashed #E6DFD5' }}></div>
                        <div style={{ borderBottom: '1px dashed #E6DFD5' }}></div>
                      </div>
                    </td>
                    <td style={tdControl}></td>
                    <td style={{ ...tdControl, textAlign: 'center' }}><div style={checkBoxSimulate}></div></td>
                    <td style={tdControl}></td>
                    <td style={{ ...tdControl, textAlign: 'center' }}><div style={checkBoxSimulate}></div></td>
                    <td style={{ ...tdControl, textAlign: 'center', color: '#999', fontSize: '8px' }}>___/___/___</td>
                    <td style={tdControl}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px', borderTop: '1px solid #C49E65', paddingTop: '3px' }}>
              <span style={{ color: COLORS.gold, fontSize: '8px' }}>⚜</span>
              <p style={{ margin: '0 6px', fontSize: '8px', fontStyle: 'italic', color: COLORS.brown, textAlign: 'center' }}>
                Formato operativo para el despacho parroquial. Complete manualmente los datos, indique la referencia de pago y marque al momento de la entrega.
              </p>
              <span style={{ color: COLORS.gold, fontSize: '8px' }}>⚜</span>
            </div>

          </div>
        </div>
      )}

      {/* Reglas de Estilos de Impresión */}
      <style>{`
        @page {
          margin: 0.3cm;
        }
        @media print {
          html, body { 
            background: #fff !important; 
            margin: 0 !important; 
            padding: 0 !important;
          }
          .no-print { display: none !important; }
          .print-page { 
            border: none !important; 
            box-shadow: none !important; 
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always;
          }
          .sheet-intenciones {
            padding-top: 0px !important;
          }
        }
      `}</style>

    </div>
  );
}

// Estilos de los botones
const btnArrow = { backgroundColor: '#603828', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnPrincipal = { backgroundColor: '#603828', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '13px' };
const btnSecundario = { backgroundColor: '#fff', color: '#603828', border: '1px solid #E6DFD5', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' };

// Contenedor de Hojas
const sheetContainer = { 
  width: '100%', 
  backgroundColor: '#FFFFFF', 
  border: '1px solid #E6DFD5', 
  padding: '10px 18px', 
  boxSizing: 'border-box', 
  position: 'relative', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-between', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
};

// ESTILOS DE LA TABLA INTENCIONES
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#FFFDF9',
  borderLeft: '1px solid #C49E65',
  borderRight: '1px solid #C49E65',
  borderBottom: '1px solid #C49E65',
  tableLayout: 'fixed'
};

const tableHeaderBrown = { 
  backgroundColor: '#603828', 
  color: '#fff', 
  fontSize: '13px', 
  fontWeight: 'bold', 
  padding: '6px 4px', 
  textAlign: 'center', 
  letterSpacing: '1px' 
};

const subHeaderRowStyle = {
  borderBottom: '1px solid #C49E65',
  backgroundColor: '#FAF6F0'
};

// AJUSTE EXACTO A TU IMAGEN: 75% Intención / 25% Obs.
const leftHeaderStyle = { width: '75%', fontSize: '9px', fontWeight: 'bold', color: '#603828', padding: '3px', textAlign: 'center', borderRight: '1px solid #C49E65' };
const rightHeaderStyle = { width: '25%', fontSize: '9px', fontWeight: 'bold', color: '#603828', padding: '3px', textAlign: 'center' };

const tableRowStyle = {
  height: '28px',
  borderBottom: '1px solid #C49E65'
};

const leftCellStyle = {
  width: '75%',
  borderRight: '1px solid #C49E65',
  padding: 0
};

const rightCellStyle = {
  width: '25%',
  padding: 0
};

// ESTILOS CONTROL SOLICITUDES
const thControl = {
  border: '1px solid #C49E65',
  padding: '3px 2px',
  fontSize: '8px',
  fontWeight: 'bold',
  backgroundColor: '#603828',
  color: '#FFFFFF',
  textAlign: 'center',
  verticalAlign: 'middle',
  lineHeight: '1.1'
};

const tdControl = {
  border: '1px solid #C49E65',
  padding: '2px',
  fontSize: '8px',
  backgroundColor: '#FFFDF9',
  verticalAlign: 'middle'
};

const checkBoxSimulate = {
  width: '11px',
  height: '11px',
  border: '1px solid #C49E65',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '2px'
};