// src/components/PreviewBautizo.jsx
import React from 'react';

export default function PreviewBautizo({ data }) {
  // Función auxiliar para formatear fechas a texto legible
  const formatDateText = (dateString) => {
    if (!dateString) return '______________________';
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const [year, month, day] = dateString.split('-');
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  return (
    <div 
      className="print-page" 
      style={{ 
        width: '21.59cm', 
        height: '27.94cm', 
        backgroundColor: '#fff', 
        padding: '2.5cm', 
        boxSizing: 'border-box', 
        position: 'relative', 
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        color: '#000',
        border: '1px solid #E6DFD5',
        backgroundImage: 'radial-gradient(#FAF6F0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        margin: '0 auto'
      }}
    >
      {/* Margen Interior Elegante (Estilo Acta Antigua) */}
      <div style={{ border: '2px solid #C49E65', height: '100%', padding: '1.5cm', boxSizing: 'border-box', position: 'relative' }}>
        
        {/* Cruz Superior */}
        <div style={{ textAlign: 'center', fontSize: '32px', color: '#C49E65', marginBottom: '10px' }}>†</div>

        {/* Encabezado Arquidiócesis */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ fontSize: '15px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px 0', fontWeight: 'normal' }}>
            Arquidiócesis de Barquisimeto
          </h2>
          <h3 style={{ fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0, color: '#555' }}>
            Parroquia Sta. Teresita del Niño Jesús
          </h3>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px', marginTop: '20px', color: '#603828' }}>
            CERTIFICADO DE BAUTIZO
          </h1>
        </div>

        {/* Cuerpo del Certificado Relacional */}
        <div style={{ fontSize: '16px', lineHeight: '2.3', textAlign: 'justify', marginTop: '40px' }}>
          <p style={{ textIndent: '1.5cm', margin: '0 0 24px 0' }}>
            En el Libro de Bautizos N° <strong style={{fontSize: '17px'}}>{data.libro || '_____'}</strong>, 
            Folio N° <strong style={{fontSize: '17px'}}>{data.folio || '_____'}</strong>, se encuentra asentado el Bautizo de:
          </p>

          <p style={{ textAlign: 'center', fontSize: '26px', fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '30px 0', color: '#603828', fontWeight: '600' }}>
            {data.nombres || '_____________________________________'}
          </p>

          <p style={{ margin: '0 0 16px 0' }}>
            Nacido el día <strong>{formatDateText(data.fechaNacimiento)}</strong>, en <strong>{data.lugarNacimiento || '___________________________'}</strong>.
          </p>

          <p style={{ margin: '0 0 16px 0' }}>
            Bautizado el día <strong>{formatDateText(data.fechaBautizo)}</strong> en la Parroquia Sta. Teresita del Niño Jesús.
          </p>

          <p style={{ margin: '0 0 16px 0' }}>
            Hijo de: <strong>{data.padre || '___________________________'}</strong> y <strong>{data.madre || '___________________________'}</strong>.
          </p>

          <p style={{ margin: '0 0 16px 0' }}>
            Ministro que bautizó: <strong>{data.celebrante || '_____________________________________'}</strong>.
          </p>

          {data.observaciones && (
            <p style={{ margin: '20px 0 0 0', fontSize: '14px', fontStyle: 'italic', lineHeight: '1.5' }}>
              <strong>Observaciones:</strong> {data.observaciones}
            </p>
          )}

          <p style={{ marginTop: '40px', textAlign: 'right' }}>
            Se expide el presente certificado a petición de los interesados.
          </p>
        </div>

        {/* Sección de Firma e Info Inferior */}
        <div style={{ position: 'absolute', bottom: '1cm', left: '1.5cm', right: '1.5cm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Sello Simulado */}
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px dashed #C49E65', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#C49E65', textAlign: 'center', transform: 'rotate(-15deg)', padding: '5px', boxSizing: 'border-box' }}>
            SELLO PARROQUIAL
          </div>
          
          <div style={{ textAlign: 'center', width: '250px' }}>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#000', marginBottom: '8px' }}></div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{data.celebrante || 'Pbro. Freddy J. Rodriguéz J.'}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>Párroco</p>
          </div>
        </div>

      </div>
    </div>
  );
}