import React from 'react';

export default function VistaImpresion({ certType, formData, onBack }) {
  
  // Función auxiliar para convertir "2026-06-13" en "13 de junio de 2026"
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '__________';
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return fechaStr;
    
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const dia = parseInt(partes[2], 10);
    const mes = meses[parseInt(partes[1], 10) - 1];
    const anio = partes[0];
    
    return `${dia} de ${mes} de ${anio}`;
  };

  const redactarTexto = () => {
    const celebrante = formData.celebrante || "____________________";
    const fechaSacramentoFormateada = formatearFecha(formData.fechaSacramento);
    const fechaNacimientoFormateada = formatearFecha(formData.fechaNacimiento);

    if (certType === 'matrimonio') {
      return `Yo, el suscrito Párroco, certifico que en los libros de esta Parroquia consta el lazo matrimonial contraído legítimamente por el Sr. ${formData.novio || '____________________'} y la Sra. ${formData.novia || '____________________'}, cuyo acto fue solemnizado el día ${fechaSacramentoFormateada} por el ministro ${celebrante}, habiendo actuado como testigos del compromiso ${formData.padrinos || '____________________'}.`;
    }
    
    const accion = certType === 'bautizo' ? 'recibió el Santo Sacramento del Bautismo' :
                   certType === 'comunion' ? 'realizó la Sagrada Comunión' : 'recibió el Sacramento de la Confirmación';

    return `Yo, el suscrito Párroco, certifico que en los registros correspondientes a esta comunidad eclesiástica consta que ${formData.nombres || '________________________________________'}, nacido(a) en ${formData.lugarNacimiento || '____________________'} el día ${fechaNacimientoFormateada}, hijo(a) de ${formData.padre || '____________________'} y de ${formData.madre || '____________________'}, ${accion} de manera solemne el día ${fechaSacramentoFormateada}. Fue ministro del acto el Pbro. ${celebrante} y actuaron como padrinos ${formData.padrinos || '____________________'}.`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* PANEL DE CONTROL SUPERIOR */}
      <div className="no-print" style={{ width: '21.59cm', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ border: '1px solid #E6DFD5', backgroundColor: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          ← VOLVER A EDITAR
        </button>
        <button onClick={() => window.print()} style={{ backgroundColor: '#603828', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          IMPRIMIR DOCUMENTO
        </button>
      </div>

      {/* ÁREA DE IMPRESIÓN (Formato Carta Estricto) */}
      <div className="print-area" style={{ width: '21.59cm', minHeight: '27.94cm', backgroundColor: '#FFFFFF', color: '#000000', padding: '2.2cm', boxSizing: 'border-box', fontFamily: "'Georgia', 'Times New Roman', serif", position: 'relative' }}>
        
        {/* BORDES GRÁFICOS */}
        <div style={{ border: '1px solid #000000', position: 'absolute', top: 0, left: 0, boxSizing: 'border-box', margin: '1cm', pointerEvents: 'none', width: 'calc(100% - 2cm)', height: 'calc(100% - 2cm)' }}></div>

        {/* ENCABEZADO FORMAL */}
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '1.5cm' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>†</span>
          <h3 style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '2px', margin: '0 0 5px 0', fontWeight: 'bold' }}>Arquidiócesis de Barquisimeto</h3>
          <h4 style={{ textTransform: 'uppercase', fontSize: '12px', margin: '0 0 5px 0', letterSpacing: '1px' }}>Parroquia Sta. Teresita del Niño Jesús</h4>
          <p style={{ fontSize: '10px', margin: 0, fontFamily: 'sans-serif', opacity: 0.7 }}>Cabudare, Estado Lara • Venezuela</p>
        </div>

        <h1 style={{ textTransform: 'uppercase', fontSize: '18px', textAlign: 'center', margin: '40px 0 35px 0', letterSpacing: '1.5px', fontWeight: 'bold' }}>
          Certificado de {certType}
        </h1>

        {/* ESTRUCTURA A DOS COLUMNAS */}
        <div style={{ display: 'flex', gap: '35px', minHeight: '10.5cm', marginTop: '20px' }}>
          
          {/* CUERPO TEXTUAL */}
          <div style={{ flex: 2.2, textAlign: 'justify', fontSize: '15px', lineHeight: '2.3', paddingRight: '10px' }}>
            {redactarTexto()}
          </div>

          {/* METADATOS LATERALES */}
          <div style={{ flex: 1, borderLeft: '1px solid #000000', paddingLeft: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Reg. Eclesiástico</h5>
              <p style={{ margin: '6px 0' }}><b>Libro:</b> {formData.libro || '___________'}</p>
              <p style={{ margin: '6px 0' }}><b>Folio:</b> {formData.folio || '___________'}</p>
              <p style={{ margin: '6px 0' }}><b>Partida:</b> {formData.partida || '___________'}</p>
            </div>

            <div>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>Inscripción Civil</h5>
              <p style={{ margin: '6px 0' }}><b>Oficina:</b> {formData.civilPrefectura || '___________'}</p>
              <p style={{ margin: '6px 0' }}><b>Fecha:</b> {formatearFecha(formData.civilFecha)}</p>
              <p style={{ margin: '6px 0' }}><b>Acta Nº:</b> {formData.civilActa || '___________'}</p>
            </div>
          </div>
        </div>

        {/* NOTAS MARGINALES DE PIE */}
        {formData.observaciones && (
          <div style={{ marginTop: '25px', border: '1px solid #000000', padding: '12px', fontSize: '12px', textAlign: 'justify', lineHeight: '1.5' }}>
            <b style={{ textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontSize: '10px' }}>Notas Marginales:</b>
            <i>{formData.observaciones}</i>
          </div>
        )}

        {/* SECCIÓN DE FIRMAS */}
        <div style={{ position: 'absolute', bottom: '2.5cm', left: 0, right: 0, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '260px', borderTop: '1px solid #000000', paddingTop: '8px' }}>
            <b style={{ fontSize: '14px' }}>{formData.celebrante || '___________________________'}</b><br />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.7 }}>Párroco</span>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          .print-area { box-shadow: none !important; margin: 0 !important; border: none !important; padding: 2cm !important; }
        }
      `}</style>
    </div>
  );
}