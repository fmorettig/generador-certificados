import React from 'react';

const COLORS = {
  brown: '#603828',
  gold: '#C49E65',
  cream: '#FAF6F0',
  white: '#FFFFFF',
  border: '#E6DFD5'
};

export default function Formulario({ certType, formData, onChange, onBack, onPreview }) {
  
  const guardarBorradorLocal = () => {
    const archivoDatos = { certType, formData };
    const blob = new Blob([JSON.stringify(archivoDatos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    const nombreSujeto = formData.nombres || formData.novio || 'Borrador';
    const nombreSugerido = `${certType.toUpperCase()}_${nombreSujeto.replace(/\s+/g, '_')}.json`;
    
    link.download = nombreSugerido;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: COLORS.white, width: '100%', maxWidth: '750px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, padding: '35px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      
      {/* ENCABEZADO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: `1px solid ${COLORS.cream}`, paddingBottom: '15px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: COLORS.brown, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
          ← Volver al Inicio
        </button>
        <h2 style={{ margin: 0, fontSize: '16px', color: COLORS.brown, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Georgia', serif" }}>
          Certificado de {certType}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* TITULARES */}
        <div>
          <h3 style={sectionTitleStyle}>{certType === 'matrimonio' ? "DATOS DE LOS CONTRAYENTES" : "DATOS DEL TITULAR"}</h3>
          {certType !== 'matrimonio' ? (
            <>
              <Input label="Nombre completo" name="nombres" value={formData.nombres || ''} onChange={onChange} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '12px' }}>
                <Input label="Fecha de nacimiento" type="date" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={onChange} />
                <Input label="Lugar de nacimiento" name="lugarNacimiento" value={formData.lugarNacimiento || ''} onChange={onChange} />
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <Input label="Nombre completo del Novio" name="novio" value={formData.novio || ''} onChange={onChange} />
              <Input label="Nombre completo de la Novia" name="novia" value={formData.novia || ''} onChange={onChange} />
            </div>
          )}
        </div>

        {/* PADRES */}
        <div>
          <h3 style={sectionTitleStyle}>DATOS DE LOS PADRES</h3>
          {certType !== 'matrimonio' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <Input label="Nombre del Padre" name="padre" value={formData.padre || ''} onChange={onChange} />
              <Input label="Nombre de la Madre" name="madre" value={formData.madre || ''} onChange={onChange} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Input label="Padre del Novio" name="padreNovio" value={formData.padreNovio || ''} onChange={onChange} />
                <Input label="Madre del Novio" name="madreNovio" value={formData.madreNovio || ''} onChange={onChange} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Input label="Padre de la Novia" name="padreNovia" value={formData.padreNovia || ''} onChange={onChange} />
                <Input label="Madre de la Novia" name="madreNovia" value={formData.madreNovia || ''} onChange={onChange} />
              </div>
            </div>
          )}
        </div>

        {/* SACRAMENTO */}
        <div>
          <h3 style={sectionTitleStyle}>DATOS DEL SACRAMENTO</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
            <Input label="Fecha de celebración" type="date" name="fechaSacramento" value={formData.fechaSacramento || ''} onChange={onChange} />
            <Input label="Lugar de celebración" name="lugarSacramento" value={formData.lugarSacramento || ''} onChange={onChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <Input label={certType === 'matrimonio' ? "Testigos" : "Padrinos"} name="padrinos" value={formData.padrinos || ''} onChange={onChange} />
            <Input label="Ministro / Celebrante" name="celebrante" value={formData.celebrante || ''} onChange={onChange} />
          </div>
        </div>

        {/* LIBROS */}
        <div>
          <h3 style={sectionTitleStyle}>ARCHIVO PARROQUIAL Y REGISTRO CIVIL</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '12px' }}>
            <Input label="Libro" name="libro" value={formData.libro || ''} onChange={onChange} />
            <Input label="Folio" name="folio" value={formData.folio || ''} onChange={onChange} />
            <Input label="Partida" name="partida" value={formData.partida || ''} onChange={onChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <Input label="Oficina / Prefectura" name="civilPrefectura" value={formData.civilPrefectura || ''} onChange={onChange} />
            <Input label="Fecha Reg. Civil" type="date" name="civilFecha" value={formData.civilFecha || ''} onChange={onChange} />
            <Input label="Acta Civil Nº" name="civilActa" value={formData.civilActa || ''} onChange={onChange} />
          </div>
        </div>

        {/* OBSERVACIONES */}
        <div>
          <h3 style={sectionTitleStyle}>OBSERVACIONES / NOTAS MARGINALES</h3>
          <textarea 
            name="observaciones"
            value={formData.observaciones || ''}
            onChange={onChange}
            placeholder="Anotaciones marginales correspondientes..."
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, backgroundColor: '#FAF6F0', color: COLORS.brown, minHeight: '75px', fontFamily: 'inherit', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button onClick={guardarBorradorLocal} type="button" style={{ backgroundColor: 'transparent', color: COLORS.gold, border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            Guardar Borrador (.json)
          </button>
          <button onClick={onPreview} type="button" style={{ flex: 1, backgroundColor: COLORS.brown, color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            VISTA PREVIA DEL CERTIFICADO →
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionTitleStyle = {
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#8D6E63',
  letterSpacing: '0.5px',
  marginBottom: '10px',
  marginTop: 0
};

function Input({ label, value, onChange, name, type = "text" }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', fontSize: '11px', color: '#603828', marginBottom: '4px', fontWeight: '500' }}>{label}</label>
      <input 
        type={type} 
        name={name}
        value={value} 
        onChange={onChange}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E6DFD5', backgroundColor: '#FAF6F0', color: '#603828', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} 
      />
    </div>
  );
}