import React from 'react';

const COLORS = { brown: '#603828', gold: '#C49E65', cream: '#FAF6F0', white: '#FFFFFF', border: '#E6DFD5' };

export default function Formulario({ certType, formData, onChange, onBack, onPreview }) {
  
  const guardarBorradorLocal = () => {
    const archivoDatos = { certType, formData };
    const blob = new Blob([JSON.stringify(archivoDatos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nombre = (formData.esposoNombre || formData.bautizadoNombre || 'Borrador').replace(/\s+/g, '_');
    link.download = `${certType.toUpperCase()}_${nombre}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const esMatrimonio = certType === 'matrimonio';
  const esBautizo = certType === 'bautizo';
  const esComunion = certType === 'comunion';
  const esConfirmacion = certType === 'confirmacion';
  
  // Para simplificar condiciones de formatos limpios (Comunión y Confirmación)
  const esFormatoLimpio = esComunion || esConfirmacion;

  const obtenerTituloSacramento = () => {
    if (esBautizo) return 'DATOS: BAUTIZO';
    if (esComunion) return 'DATOS: PRIMERA COMUNIÓN';
    if (esConfirmacion) return 'DATOS: CONFIRMACIÓN';
    return 'DATOS: MATRIMONIO';
  };

  return (
    <div style={{ backgroundColor: COLORS.white, width: '100%', maxWidth: '900px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, padding: '35px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: `1px solid ${COLORS.cream}`, paddingBottom: '15px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: COLORS.brown, fontWeight: 'bold', cursor: 'pointer' }}>← INICIO</button>
        <h2 style={{ margin: 0, fontSize: '16px', color: COLORS.brown, textTransform: 'uppercase', fontFamily: "'Georgia', serif" }}>
          {obtenerTituloSacramento()}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* CONDICIONAL DE CAMPOS DE PERSONAS */}
        {esMatrimonio ? (
          <>
            {/* SECCIÓN ESPOSO (SOLO MATRIMONIO) */}
            <div style={gridSection}>
              <h3 style={sectionTitle}>DATOS DEL ESPOSO</h3>
              <Input label="Nombre completo" name="esposoNombre" value={formData.esposoNombre || ''} onChange={onChange} />
              <div style={row}>
                <Input label="Estado Civil" name="esposoEstadoCivil" value={formData.esposoEstadoCivil || ''} onChange={onChange} />
                <Input label="Edad" name="esposoEdad" value={formData.esposoEdad || ''} onChange={onChange} />
              </div>
              <div style={row}>
                <Input label="Natural de (Origen)" name="esposoNaturalDe" value={formData.esposoNaturalDe || ''} onChange={onChange} />
                <Input label="Vecino de (Dirección)" name="esposoVecinoDe" value={formData.esposoVecinoDe || ''} onChange={onChange} />
              </div>
              <div style={row}>
                <Input label="Hijo de (Padre)" name="esposoPadre" value={formData.esposoPadre || ''} onChange={onChange} />
                <Input label="Y de (Madre)" name="esposoMadre" value={formData.esposoMadre || ''} onChange={onChange} />
              </div>
            </div>

            {/* SECCIÓN ESPOSA (SOLO MATRIMONIO) */}
            <div style={gridSection}>
              <h3 style={sectionTitle}>DATOS DE LA ESPOSA</h3>
              <Input label="Nombre completo" name="esposaNombre" value={formData.esposaNombre || ''} onChange={onChange} />
              <div style={row}>
                <Input label="Estado Civil" name="esposaEstadoCivil" value={formData.esposaEstadoCivil || ''} onChange={onChange} />
                <Input label="Edad" name="esposaEdad" value={formData.esposaEdad || ''} onChange={onChange} />
              </div>
              <div style={row}>
                <Input label="Natural de" name="esposaNaturalDe" value={formData.esposaNaturalDe || ''} onChange={onChange} />
                <Input label="Vecina de" name="esposaVecinaDe" value={formData.esposaVecinaDe || ''} onChange={onChange} />
              </div>
              <div style={row}>
                <Input label="Hija de (Padre)" name="esposaPadre" value={formData.esposaPadre || ''} onChange={onChange} />
                <Input label="Y de (Madre)" name="esposaMadre" value={formData.esposaMadre || ''} onChange={onChange} />
              </div>
            </div>
          </>
        ) : (
          /* SECCIÓN PARA BAUTIZO, COMUNIÓN O CONFIRMACIÓN */
          <div style={gridSection}>
            <h3 style={sectionTitle}>
              {esComunion ? "DATOS DE QUIEN RECIBE LA COMUNIÓN" : esConfirmacion ? "DATOS DEL CONFIRMANDO" : "DATOS DEL BAUTIZADO / TITULAR"}
            </h3>
            <Input label="Nombre completo" name="bautizadoNombre" value={formData.bautizadoNombre || ''} onChange={onChange} />
            <div style={row}>
              {esBautizo ? (
                <>
                  <Input label="Lugar de Nacimiento (Ciudad, Estado)" name="bautizadoLugarNac" value={formData.bautizadoLugarNac || ''} onChange={onChange} />
                  <Input label="Fecha de Nacimiento" type="date" name="bautizadoFechaNac" value={formData.bautizadoFechaNac || ''} onChange={onChange} />
                </>
              ) : (
                <Input label="Edad (Ej: 15 años)" name="bautizadoEdad" value={formData.bautizadoEdad || ''} onChange={onChange} />
              )}
            </div>
            <div style={row}>
              <Input label="Hijo de (Padre)" name="esposoPadre" value={formData.esposoPadre || ''} onChange={onChange} />
              <Input label="Y de (Madre)" name="esposoMadre" value={formData.esposoMadre || ''} onChange={onChange} />
            </div>
          </div>
        )}

        {/* CELEBRACIÓN Y MINISTROS */}
        <div style={gridSection}>
          <h3 style={sectionTitle}>CELEBRACIÓN</h3>
          <div style={row}>
            <Input 
              label={esMatrimonio ? "Fecha del Matrimonio" : esComunion ? "Fecha de la Primera Comunión" : esConfirmacion ? "Fecha de la Confirmación" : "Fecha del Bautizo"} 
              type="date" 
              name="fechaSacramento" 
              value={formData.fechaSacramento || ''} 
              onChange={onChange} 
            />
            <Input label="Ministro (Quien ejerció)" name="ministro" value={formData.ministro || ''} onChange={onChange} />
          </div>
          {!esComunion && (
            <div style={row}>
              <Input label="Padrino" name="padrino" value={formData.padrino || ''} onChange={onChange} />
              <Input label="Madrina" name="madrina" value={formData.madrina || ''} onChange={onChange} />
            </div>
          )}
          <Input label="Motivo de Emisión" name="motivo" value={formData.motivo || ''} onChange={onChange} />
        </div>

        {/* ARCHIVO Y REGISTRO */}
        <div style={gridSection}>
          <h3 style={sectionTitle}>COLUMNA TÉCNICA (ARCHIVOS)</h3>
          <div style={row}>
            <Input label="Libro" name="libro" value={formData.libro || ''} onChange={onChange} />
            <Input label="Folio" name="folio" value={formData.folio || ''} onChange={onChange} />
            <Input label="Num." name="tecnicoMun" value={formData.tecnicoMun || ''} onChange={onChange} />
            <Input label="Año" name="tecnicoAnio" value={formData.tecnicoAnio || ''} onChange={onChange} />
          </div>
          
          {/* Ocultamos los datos civiles si es comunión o confirmación */}
          {!esFormatoLimpio && (
            <div style={row}>
              <Input label="Inscripción Civil N°" name="civilActa" value={formData.civilActa || ''} onChange={onChange} />
              <Input label="Fecha Inscripción Civil" type="date" name="civilFecha" value={formData.civilFecha || ''} onChange={onChange} />
              <Input label={esBautizo ? "Certificado N°" : "Municipio / Prefectura"} name="civilMunicipio" value={formData.civilMunicipio || ''} onChange={onChange} />
              <Input label="Estado" name="civilEstado" value={formData.civilEstado || ''} onChange={onChange} />
            </div>
          )}
        </div>

        <div style={gridSection}>
          <h3 style={sectionTitle}>FECHA DE EXPEDICIÓN</h3>
          <div style={row}>
            <Input label="Se imprimirá con fecha de:" type="date" name="fechaExpedicion" value={formData.fechaExpedicion || ''} onChange={onChange} />
            {esFormatoLimpio && <Input label="Lugar de Expedición" name="lugarExpedicion" value={formData.lugarExpedicion || 'Cabudare'} onChange={onChange} />}
          </div>
        </div>

        {/* NOTA MARGINAL (Oculta para formatos limpios) */}
        {!esFormatoLimpio && (
          <div style={gridSection}>
            <h3 style={sectionTitle}>NOTA MARGINAL</h3>
            <textarea name="observaciones" value={formData.observaciones || ''} onChange={onChange} style={textArea} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={guardarBorradorLocal} style={{ color: COLORS.gold, border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Borrador (.json)</button>
          <button onClick={onPreview} style={{ flex: 1, backgroundColor: COLORS.brown, color: 'white', border: 'none', padding: '15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>VISTA PREVIA →</button>
        </div>
      </div>
    </div>
  );
}

const gridSection = { display: 'flex', flexDirection: 'column', gap: '12px' };
const sectionTitle = { fontSize: '11px', fontWeight: 'bold', color: '#8D6E63', margin: 0, textTransform: 'uppercase' };
const row = { display: 'flex', gap: '15px' };
const textArea = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #E6DFD5', backgroundColor: '#FAF6F0', color: '#603828', minHeight: '80px', fontFamily: 'inherit' };

function Input({ label, value, onChange, name, type = "text" }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', fontSize: '11px', color: '#603828', marginBottom: '4px' }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E6DFD5', backgroundColor: '#FAF6F0', color: '#603828', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}