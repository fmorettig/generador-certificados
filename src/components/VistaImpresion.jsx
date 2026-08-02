import React from 'react';

export default function VistaImpresion({ certType, formData, onBack }) {
  
  const formatearTresDigitos = (valor) => {
    if (!valor) return '___';
    const limpio = valor.toString().trim();
    if (!isNaN(limpio) && limpio !== '') {
      return limpio.padStart(3, '0');
    }
    return limpio;
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '____________________';
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return '____________________';
    const anio = partes[0];
    const mes = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);
    return `${dia} de ${meses[mes]} de ${anio}`;
  };

  const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return '__________';
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return '__________';
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const obtenerTituloDocumento = () => {
    if (certType === 'bautizo') return 'CERTIFICADO DE BAUTISMO';
    if (certType === 'comunion') return 'CERTIFICADO DE PRIMERA COMUNIÓN';
    if (certType === 'confirmacion') return 'CERTIFICADO DE CONFIRMACIÓN';
    return 'CERTIFICADO DE MATRIMONIO';
  };

  // Helper para concatenar nombres y apellidos limpiando espacios dobles
  const obtenerNombreCompleto = (nombres = '', apellidos = '') => {
    const completo = `${nombres} ${apellidos}`.trim();
    return completo !== '' ? completo.toUpperCase() : '';
  };

  const esMatrimonio = certType === 'matrimonio';
  const esBautizo = certType === 'bautizo';
  const esComunion = certType === 'comunion';
  const esConfirmacion = certType === 'confirmacion';
  
  const esFormatoLimpio = esComunion || esConfirmacion;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* BOTONERA SUPERIOR */}
      <div className="no-print" style={{ width: '21.59cm', display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '0 5px', boxSizing: 'border-box' }}>
        <button onClick={onBack} style={{ border: '1px solid #E6DFD5', background: 'white', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#603828' }}>
          ← VOLVER AL FORMULARIO
        </button>
        <button onClick={() => window.print()} style={{ backgroundColor: '#603828', color: 'white', padding: '8px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
          IMPRIMIR CERTIFICADO
        </button>
      </div>

      {/* CONTENEDOR CARTA ORIGINAL */}
      <div className="print-area" style={{ width: '21.59cm', height: '27.94cm', backgroundColor: '#FFFFFF', color: '#000000', padding: '1.2cm 1.5cm 1.0cm 1.5cm', boxSizing: 'border-box', fontFamily: "'Georgia', serif", position: 'relative' }}>
        
        {/* ENCABEZADO / MEMBRETE PARROQUIAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <img src="/arquibqto.png" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} alt="Arquidiócesis" />
          
          <div style={{ textAlign: 'center', flex: 1, padding: '0 10px' }}>
            <h2 style={{ margin: 0, fontSize: '23px', fontWeight: 'bold', letterSpacing: '0.3px' }}>Arquidiócesis de Barquisimeto</h2>
            <div style={{ width: '100%', height: '0px', borderTop: '2px solid #0056b3', margin: '3px 0 5px 0' }}></div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>PARROQUIA SANTA TERESITA DEL NIÑO JESÚS</h3>
            <p style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: 'bold' }}>Urb. del Este - Barquisimeto</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold' }}>Edo. Lara - Venezuela</p>
            <p style={{ margin: '0 0 2px 0', fontSize: '10.5px', lineHeight: '1.3' }}>
              <b>Dirección:</b> <span style={{ fontStyle: 'italic' }}>Calle 7 Urb. del Este. Barquisimeto - Venezuela</span>
            </p>
            <p style={{ margin: 0, fontSize: '10.5px', fontStyle: 'italic', lineHeight: '1.3' }}>
              RIF: G - 20017783-7 &nbsp;&nbsp; pqsantateresitabarquisimeto@gmail.com &nbsp;&nbsp; Teléfono: +58 4141590572
            </p>
          </div>          
          <img src="/stateresita.png" style={{ height: '110px', width: 'auto', objectFit: 'contain' }} alt="Santa Teresita" />
        </div>

        <div style={{ width: '65%', height: '1px', backgroundColor: '#000000', margin: '15px auto 20px auto' }}></div>

        {/* TÍTULO DEL DOCUMENTO */}
        <h2 style={{ textAlign: 'center', fontSize: '17px', marginBottom: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          {obtenerTituloDocumento()}
        </h2>

        {/* SECCIÓN CENTRAL */}
        <div style={{ display: 'flex', gap: '20px', width: '100%', alignItems: 'stretch', marginBottom: '15px' }}>
          
          {/* COLUMNA IZQUIERDA: TEXTO CONTINUO */}
          <div style={{ flex: 2.3, fontSize: '12px', lineHeight: '2.1', textAlign: 'justify', borderRight: '1px solid #000000', paddingRight: '15px' }}>
            El Presbítero <b>Freddy José Rodríguez Jiménez</b>, Párroco de esta comunidad eclesial, certifica que según consta en los datos del acta reseñados al margen, correspondiente al Libro de {esComunion ? 'Primeras Comuniones' : esConfirmacion ? 'Confirmaciones' : esMatrimonio ? 'Matrimonios' : 'Bautismos'} de esta parroquia:
            <br /><br />
            
            {esMatrimonio ? (
              <>
                contrajeron nupcias, según el rito de la Santa Madre Iglesia, en esta Parroquia, el día: <b>{formatearFecha(formData.fechaSacramento)}</b>.
                <br />
                El Sr: <span style={{ fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'underline' }}>{obtenerNombreCompleto(formData.esposoNombres, formData.esposoApellidos) || '________________________________________'}</span>.
                <br />
                de estado civil <b>{formData.esposoEstadoCivil || 'Soltero'}</b>, de <b>{formData.esposoEdad || '___'}</b> años de edad, natural de <b>{formData.esposoNaturalDe || '_______________'}</b> vecino de <b>{formData.esposoVecinoDe || '_______________'}</b>.
                <br />
                Hijo de: <b>{formData.esposoPadre || '________________________________________'}</b> y de: <b>{formData.esposoMadre || '________________________________________'}</b>.
                <br />
                y la Sra. <span style={{ fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'underline' }}>{obtenerNombreCompleto(formData.esposaNombres, formData.esposaApellidos) || '________________________________________'}</span>.
                <br />
                de estado civil <b>{formData.esposaEstadoCivil || 'Soltera'}</b>, de <b>{formData.esposaEdad || '___'}</b> años de edad, natural de <b>{formData.esposaNaturalDe || '_______________'}</b> vecina de <b>{formData.esposaVecinaDe || '_______________'}</b>.
                <br />
                Hija de: <b>{formData.esposaPadre || '________________________________________'}</b> y de: <b>{formData.esposaMadre || '________________________________________'}</b>.
              </>
            ) : esComunion ? (
              <>
                <div style={{ textAlign: 'center', width: '100%', margin: '10px 0', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  {obtenerNombreCompleto(formData.bautizadoNombres, formData.bautizadoApellidos) || '________________________________________'}
                </div>
                De <b>{formData.edad || '___ años'}</b> de edad, recibió el Sacramento de la Eucaristía el día <b>{formatearFecha(formData.fechaSacramento)}</b>.
                <br /><br />
                
                {/* ALINEACIÓN DE PADRES */}
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  <span style={{ fontWeight: 'bold', width: '85px', flexShrink: 0 }}>PADRES:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <b>{formData.padreNombre || '________________________________________'}</b>
                    <b>{formData.madreNombre || '________________________________________'}</b>
                  </div>
                </div>
              </>
            ) : esConfirmacion ? (
              <>
                <div style={{ textAlign: 'center', width: '100%', margin: '10px 0', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  {obtenerNombreCompleto(formData.bautizadoNombres, formData.bautizadoApellidos) || '________________________________________'}
                </div>
                De <b>{formData.edad || '___ años'}</b> de edad, recibió el Sacramento de la Confirmación el día <b>{formatearFecha(formData.fechaSacramento)}</b>.
                <br /><br />
                
                {/* ALINEACIÓN DE PADRES */}
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  <span style={{ fontWeight: 'bold', width: '85px', flexShrink: 0 }}>PADRES:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <b>{formData.padreNombre || '________________________________________'}</b>
                    <b>{formData.madreNombre || '________________________________________'}</b>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', width: '100%', margin: '10px 0', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  {obtenerNombreCompleto(formData.bautizadoNombres, formData.bautizadoApellidos) || '________________________________________'}
                </div>
                Fue bautizado(a) el día: <b>{formatearFecha(formData.fechaSacramento)}</b>.
                <br />
                Nació en <b>{formData.lugarNacimiento || '____________________'}</b>, el día: <b>{formatearFecha(formData.fechaNacimiento)}</b>.
                <br /><br />
                
                {/* ALINEACIÓN DE PADRES */}
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  <span style={{ fontWeight: 'bold', width: '85px', flexShrink: 0 }}>PADRES:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <b>{formData.padreNombre || '________________________________________'}</b>
                    <b>{formData.madreNombre || '________________________________________'}</b>
                  </div>
                </div>
              </>
            )}
            
            <br />
            
            {/* ALINEACIÓN DE PADRINOS (PARA BAUTIZO Y CONFIRMACIÓN) */}
            {!esComunion && (
              <div style={{ display: 'flex', marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', width: '85px', flexShrink: 0 }}>PADRINOS:</span>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <b>{formData.padrino || '________________________________________'}</b>
                  <b>{formData.madrina || '________________________________________'}</b>
                </div>
              </div>
            )}

            <span style={{ fontWeight: 'bold' }}>MINISTRO:</span> <b>{formData.ministro || '________________________________________'}</b>.
            <br /><br />
            Se expide el presente certificado, a solicitud de parte interesada, para fines única y exclusivamente: <span style={{ fontWeight: 'bold' }}>{(formData.motivo || '').toUpperCase()}</span>.
          </div>

          {/* COLUMNA DERECHA SELECTIVA */}
          <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '5.2cm' }}>
            
            {/* BLOQUE 1: REGISTRO ECLESIÁSTICO */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000000', fontSize: '11px' }}>
              <thead>
                <tr>
                  <th colSpan="2" style={{ borderBottom: '1.5px solid #000000', padding: '4px', backgroundColor: '#e6e6e6', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                    REG. ECLESIÁSTICO
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', borderRight: '1px solid #000000', width: '45%', fontWeight: 'bold' }}>LIBRO</td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', textAlign: 'center', fontWeight: 'bold' }}>{formatearTresDigitos(formData.libro)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', borderRight: '1px solid #000000', fontWeight: 'bold' }}>FOLIO</td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', textAlign: 'center', fontWeight: 'bold' }}>{formatearTresDigitos(formData.folio)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', borderRight: '1px solid #000000', fontWeight: 'bold' }}>NUM.</td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', textAlign: 'center', fontWeight: 'bold' }}>{formatearTresDigitos(formData.numero)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 6px', borderRight: '1px solid #000000', fontWeight: 'bold' }}>AÑO</td>
                  <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>{formData.anio || '____'}</td>
                </tr>
              </tbody>
            </table>

            {/* BLOQUES OPCIONALES OCULTOS PARA COMUNIÓN Y CONFIRMACIÓN */}
            {!esFormatoLimpio && (
              <>
                <div style={{ border: '1.5px solid #000000', display: 'flex', flexDirection: 'column', fontSize: '11px' }}>
                  <div style={{ backgroundColor: '#e6e6e6', borderBottom: '1px solid #000000', padding: '4px', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                    INSCRIPCION CIVIL
                  </div>
                  <div style={{ padding: '4px 6px', lineHeight: '1.3' }}>
                    <b>N°:</b> {formData.actaCivil || '__________'} <br />
                    <b>Fecha:</b> {formatearFechaCorta(formData.fechaCivil)} <br />
                    {esBautizo && <b>Certificado:</b>} {esBautizo && (formData.municipioCivil || '__________')}
                  </div>
                  
                  <div style={{ backgroundColor: '#e6e6e6', borderTop: '1px solid #000000', borderBottom: '1px solid #000000', padding: '4px', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                    REGISTRO CIVIL
                  </div>
                  <div style={{ padding: '4px 6px', fontSize: '10.5px' }}>
                    {formData.registroCivil || ''}
                  </div>
                  
                  {esMatrimonio && (
                    <>
                      <div style={{ backgroundColor: '#e6e6e6', borderTop: '1px solid #000000', borderBottom: '1px solid #000000', padding: '2px 4px', fontWeight: 'bold', textAlign: 'center', fontSize: '9.5px' }}>
                        MUNICIPIO
                      </div>
                      <div style={{ padding: '4px 6px', fontSize: '10.5px' }}>
                        {formData.municipioCivil || ''}
                      </div>
                    </>
                  )}
                  
                  <div style={{ backgroundColor: '#e6e6e6', borderTop: '1px solid #000000', borderBottom: '1px solid #000000', padding: '2px 4px', fontWeight: 'bold', textAlign: 'center', fontSize: '9.5px' }}>
                    ESTADO
                  </div>
                  <div style={{ padding: '4px 6px', fontSize: '10.5px' }}>
                    {formData.estadoCivilRegistro || ''}
                  </div>
                </div>

                <div style={{ border: '1.5px solid #000000', display: 'flex', flexDirection: 'column', fontSize: '11px', maxHeight: '100px', minHeight: '80px', flex: 1 }}>
                  <div style={{ backgroundColor: '#e6e6e6', borderBottom: '1px solid #000000', padding: '4px', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                    NOTA MARGINAL:
                  </div>
                  <div style={{ padding: '6px', lineHeight: '1.3', fontStyle: 'italic', textAlign: 'justify', fontSize: '10px', overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
                    {formData.observaciones || ''}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* PIE DE FE Y FIRMAS */}
        <div style={{ position: 'absolute', bottom: '2.4cm', left: '1.5cm', right: '1.5cm', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: 'calc(100% - 3.0cm)' }}>
          <div style={{ fontSize: '12px', lineHeight: '1.8', maxWidth: '55%', textAlign: 'left', paddingBottom: '5px' }}>
            En {formData.lugarExpedicion || 'Barquisimeto'}, {formatearFecha(formData.fechaExpedicion)}.
            <br />
            Doy fe de lo anteriormente expuesto.
          </div>
          
          <div style={{ position: 'relative', textAlign: 'center', width: '250px' }}>
            <img src="/firma.png" onError={(e) => e.target.style.display='none'} style={{ height: '55px', position: 'absolute', top: '-45px', left: '50%', transform: 'translateX(-50%)', zIndex: 1, pointerEvents: 'none' }} alt="" />
            <div style={{ borderTop: '1px solid #000000', width: '100%', paddingTop: '4px', fontWeight: 'bold', fontSize: '13.5px', position: 'relative', zIndex: 2 }}>
              Pbro. Freddy J. Rodríguez J.
            </div>
            <div style={{ fontSize: '11.5px', marginTop: '1px' }}>Párroco</div>
          </div>
        </div>

      </div>

      <style>{`
        @page { 
          size: letter portrait; 
          margin: 0 !important; 
        }
        @media print {
          html, body { 
            width: 21.59cm !important;
            height: 27.94cm !important;
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: hidden !important; 
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          .no-print { 
            display: none !important; 
          }
          .print-area { 
            width: 100% !important;
            height: 100% !important;
            border: none !important; 
            box-shadow: none !important; 
            background: #ffffff !important; 
            margin: 0 !important; 
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            page-break-inside: avoid !important; 
            page-break-after: avoid !important; 
          }
        }
      `}</style>
    </div>
  );
}