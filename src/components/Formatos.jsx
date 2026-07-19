import React, { useState } from 'react';

const COLORS = { brown: '#603828', gold: '#C49E65', cream: '#FAF6F0', white: '#FFFFFF', border: '#E6DFD5', text: '#333333' };

export default function Formatos({ onBack }) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'print-intenciones', 'print-solicitudes'
  const [selectedFormat, setSelectedFormat] = useState('intenciones'); // 'intenciones', 'solicitudes'
  const [showConfig, setShowConfig] = useState(false);
  
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
  const filasDeTabla = Array.from({ length: 24 });

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
            <div onClick={() => setSelectedFormat('solicitudes')} style={{ flex: 1, padding: '20px', borderRadius: '8px', border: `2px solid ${selectedFormat === 'solicitudes' ? COLORS.border : COLORS.brown}`, backgroundColor: selectedFormat === 'solicitudes' ? COLORS.cream : '#fff', cursor: 'pointer', transition: '0.2s' }}>
              <b style={{ display: 'block', color: COLORS.brown, fontSize: '14px' }}>Control de Solicitudes (Carta Horizontal)</b>
              <span style={{ fontSize: '12px', color: '#666' }}>Formato impreso horizontal para seguimiento.</span>
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
              <p style={{ fontSize: '13px', color: '#666', maxWidth: '500px', margin: '0 auto 20px auto' }}>
                Este formato genera una plantilla limpia en tamaño Carta Horizontal optimizada para el despacho, estructurada únicamente con líneas de tablas y bloques de dos columnas.
              </p>
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
          <div className="no-print" style={{ width: '21.59cm', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('menu')} style={btnSecundario}>← VOLVER AL ASISTENTE</button>
            <button onClick={() => window.print()} style={btnPrincipal}>IMPRIMIR TODAS LAS HOJAS ({paginasAIprimir.length})</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {paginasAIprimir.map((pag, index) => (
              <div key={index} className="print-page layout-letter" style={sheetContainerLetter}>
                
                {/* Membrete Oficial */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #603828', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src="/stateresita.png" style={{ height: '75px', width: 'auto' }} alt="Logo" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '11px', color: COLORS.brown, fontWeight: 'bold', letterSpacing: '0.5px' }}>PARROQUIA SANTA TERESITA DEL NIÑO JESÚS</h4>
                      <p style={{ margin: 0, fontSize: '9px', color: '#666', fontStyle: 'italic' }}>Urb. del Este - Barquisimeto - Edo. Lara</p>
                    </div>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Georgia', serif", fontWeight: 'bold', color: COLORS.brown, letterSpacing: '1px' }}>INTENCIONES DEL DÍA</h2>
                </div>

                {/* Sub-encabezado Variable con Fecha y Hora */}
                <div style={{ textAlign: 'center', margin: '12px 0', fontSize: '14px', color: COLORS.brown, display: 'flex', justifyContent: 'center', gap: '5px', alignItems: 'center' }}>
                  <span>Fecha:</span>
                  <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', borderBottom: '1px solid #000', padding: '0 15px', fontWeight: 'bold' }}>
                    {formatearFechaLarga(pag.fecha)} {pag.hora ? ` — Misa: ${pag.hora}` : ''}
                  </span>
                </div>

                {/* Tablas Estructuradas en Paralelo */}
                <div style={{ display: 'flex', gap: '20px', flex: 1, width: '100%', alignItems: 'stretch' }}>
                  
                  {/* SECCIÓN 1: DIFUNTOS */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th colSpan="2" style={tableHeaderBrown}>DIFUNTOS</th>
                        </tr>
                        <tr style={subHeaderRowStyle}>
                          <th style={leftHeaderStyle}>Intención</th>
                          <th style={rightHeaderStyle}>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filasDeTabla.map((_, rIdx) => (
                          <tr key={rIdx} style={tableRowStyle}>
                            <td style={leftCellStyle}></td>
                            <td style={rightCellStyle}></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* SECCIÓN 2: ACCIÓN DE GRACIAS */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th colSpan="2" style={tableHeaderBrown}>ACCIÓN DE GRACIAS</th>
                        </tr>
                        <tr style={subHeaderRowStyle}>
                          <th style={leftHeaderStyle}>Intención</th>
                          <th style={rightHeaderStyle}>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filasDeTabla.map((_, rIdx) => (
                          <tr key={rIdx} style={tableRowStyle}>
                            <td style={leftCellStyle}></td>
                            <td style={rightCellStyle}></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Sección de Cierre: Colecta, Observaciones*/}
                <div style={{ border: '1.5px solid #C49E65', borderRadius: '6px', padding: '10px 15px', marginTop: '12px', position: 'relative' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: COLORS.brown, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    ✦ TOTAL DE LA COLECTA ✦
                  </div>
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ flex: 1, fontSize: '12px', fontWeight: 'bold' }}>
                      Total de la colecta: &nbsp;$ <span style={{ borderBottom: '1px dashed #000', width: '70%', display: 'inline-block' }}></span>
                    </div>
                    <div style={{ flex: 2, fontSize: '11px' }}>
                      Observaciones: <span style={{ borderBottom: '1px dashed #000', width: '75%', display: 'inline-block', height: '14px' }}></span>
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
          <div className="no-print" style={{ width: '27.94cm', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('menu')} style={btnSecundario}>← VOLVER AL ASISTENTE</button>
            <button onClick={() => window.print()} style={btnPrincipal}>IMPRIMIR HOJA CONTROL (CARTA LANDSCAPE)</button>
          </div>

          <div className="print-page layout-letter-landscape" style={sheetContainerLetterLandscape}>
            
            {/* Encabezado Principal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #603828', paddingBottom: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src="/stateresita.png" style={{ height: '75px', width: 'auto' }} alt="Logo" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '11px', color: COLORS.brown, fontWeight: 'bold' }}>PARROQUIA</h3>
                  <h2 style={{ margin: 0, fontSize: '15px', color: COLORS.brown, fontWeight: 'bold', fontFamily: "'Georgia', serif" }}>STA. TERESITA DEL NIÑO JESÚS</h2>
                </div>
              </div>
              <h1 style={{ margin: 0, fontSize: '20px', fontFamily: "'Georgia', serif", color: COLORS.brown, letterSpacing: '0.5px', fontWeight: 'bold' }}>
                CONTROL DE SOLICITUDES DE CERTIFICADOS
              </h1>
              <div style={{ fontSize: '12px' }}>
              </div>
            </div>

            {/* Gran Tabla de Control Operativo */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#603828', color: '#FFFFFF', textAlign: 'center' }}>
                  <th style={thControl}>N°</th>
                  <th style={thControl}>FECHA DE SOLICITUD</th>
                  <th style={thControl}>NOMBRE DEL SOLICITANTE</th>
                  <th style={thControl}>INFORMACIÓN ADICIONAL</th>
                  <th style={thControl}>TIPO DE CERTIFICADO</th>
                  <th style={thControl}>DATOS DE CONTACTO (Nombre y Teléfono)</th>
                  <th style={thControl}>LISTO</th>
                  <th style={thControl}>ENTREGADO</th>
                  <th style={thControl}>FECHA DE ENTREGA</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(15)].map((_, idx) => (
                  <tr key={idx} style={{ height: '28px' }}>
                    <td style={{ ...tdControl, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#FAF6F0' }}>{idx + 1}</td>
                    <td style={tdControl}></td>
                    <td style={tdControl}></td>
                    <td style={{ ...tdControl, padding: '1px 5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ borderBottom: '1px solid #E6DFD5', height: '5px' }}></div>
                        <div style={{ borderBottom: '1px solid #E6DFD5', height: '5px' }}></div>
                        <div style={{ borderBottom: '1px solid #E6DFD5', height: '5px' }}></div>
                      </div>
                    </td>
                    <td style={tdControl}></td>
                    <td style={tdControl}></td>
                    <td style={{ ...tdControl, textAlign: 'center' }}><div style={checkBoxSimulate}></div></td>
                    <td style={{ ...tdControl, textAlign: 'center' }}><div style={checkBoxSimulate}></div></td>
                    <td style={{ ...tdControl, textAlign: 'center', color: '#999', fontSize: '8px' }}>___/___/___</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pie de Página Explicativo y Firma */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #C49E65', paddingTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%' }}>
                <span style={{ color: COLORS.gold }}>⚜</span>
                <p style={{ margin: 0, fontSize: '9px', fontStyle: 'italic', color: COLORS.brown, textAlign: 'center' }}>
                  Formato operativo de control para el despacho. Rellene manualmente los campos, marque el estado de entrega y archive para el balance.
                </p>
                <span style={{ color: COLORS.gold }}>⚜</span>
              </div>
              

            </div>

          </div>
        </div>
      )}

      {/* Reglas de Estilos de Impresión CSS */}
      <style>{`
        @page { margin: 0mm !important; }
        @media print {
          html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .print-page { border: none !important; box-shadow: none !important; margin: 0 auto !important; page-break-after: always !important; page-break-inside: avoid !important; }
          .layout-letter { width: 21.59cm !important; height: 27.94cm !important; padding: 1.2cm 1.0cm !important; }
          .layout-letter-landscape { width: 27.94cm !important; height: 21.59cm !important; padding: 1.0cm !important; }
        }
      `}</style>

    </div>
  );
}

// Estilos de los botones del menú superior
const btnArrow = { backgroundColor: '#603828', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnPrincipal = { backgroundColor: '#603828', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '13px' };
const btnSecundario = { backgroundColor: '#fff', color: '#603828', border: '1px solid #E6DFD5', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' };

// Contenedores de las Hojas de Impresión
const sheetContainerLetter = { width: '21.59cm', height: '27.94cm', backgroundColor: '#FFFFFF', border: '1px solid #E6DFD5', padding: '1.2cm 1.0cm', boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const sheetContainerLetterLandscape = { width: '27.94cm', height: '21.59cm', backgroundColor: '#FFFFFF', border: '1px solid #E6DFD5', padding: '1.0cm', boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };

// ESTILOS DE LA TABLA COMPLETA
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#FFFDF9',
  borderLeft: '1px solid #C49E65',
  borderRight: '1px solid #C49E65',
  borderBottom: '1px solid #C49E65',
  tableLayout: 'fixed'
};

const tableHeaderBrown = { backgroundColor: '#603828', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '6px', textAlign: 'center', letterSpacing: '0.5px' };

const subHeaderRowStyle = {
  borderBottom: '1px solid #C49E65',
  backgroundColor: '#FAF6F0'
};

const leftHeaderStyle = { width: '70%', fontSize: '10px', fontWeight: 'bold', color: '#603828', padding: '5px', textAlign: 'center', borderRight: '1px solid #C49E65' };
const rightHeaderStyle = { width: '30%', fontSize: '10px', fontWeight: 'bold', color: '#603828', padding: '5px', textAlign: 'center' };

const tableRowStyle = {
  height: '28px',
  borderBottom: '1px solid #C49E65'
};

const leftCellStyle = {
  width: '70%',
  borderRight: '1px solid #C49E65',
  padding: 0
};

const rightCellStyle = {
  width: '30%',
  padding: 0
};

// ESTILOS DE LA TABLA DE CONTROL DE SOLICITUDES
const thControl = {
  border: '1px solid #C49E65',
  padding: '6px 4px',
  fontSize: '9px',
  fontWeight: 'bold',
  backgroundColor: '#603828',
  color: '#FFFFFF',
  textAlign: 'center',
  verticalAlign: 'middle'
};

const tdControl = {
  border: '1px solid #C49E65',
  padding: '4px',
  fontSize: '10px',
  height: '28px',
  backgroundColor: '#FFFDF9',
  verticalAlign: 'middle'
};

const checkBoxSimulate = {
  width: '14px',
  height: '14px',
  border: '1px solid #C49E65',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '3px'
};