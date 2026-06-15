import React from 'react';

export default function VistaImpresion({ certType, formData, onBack }) {
  
  // Función para rellenar con ceros a la izquierda hasta cumplir un tamaño (por defecto 3 dígitos)
  const formatearTresDigitos = (valor) => {
    if (!valor) return '___';
    const limpio = valor.toString().trim();
    if (!isNaN(limpio) && limpio !== '') {
      return limpio.padStart(3, '0');
    }
    return limpio;
  };

  // Función eclesiástica para formatter fechas completas de forma continua
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

  // Función para las fechas cortas del registro civil
  const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return '__________';
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return '__________';
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* BOTONERA SUPERIOR (OCULTA EN IMPRESIÓN) */}
      <div className="no-print" style={{ width: '21.59cm', display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '0 5px', boxSizing: 'border-box' }}>
        <button onClick={onBack} style={{ border: '1px solid #E6DFD5', background: 'white', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#603828' }}>
          ← VOLVER AL FORMULARIO
        </button>
        <button onClick={() => window.print()} style={{ backgroundColor: '#603828', color: 'white', padding: '8px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
          IMPRIMIR CERTIFICADO
        </button>
      </div>

      {/* CONTENEDOR CARTA TOTALMENTE LIMPIO */}
      <div className="print-area" style={{ width: '21.59cm', height: '27.94cm', backgroundColor: '#FFFFFF', color: '#000000', padding: '1.2cm 1.5cm 1.0cm 1.5cm', boxSizing: 'border-box', fontFamily: "'Georgia', serif", position: 'relative' }}>
        
        {/* ENCABEZADO / MEMBRETE PARROQUIAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <img src="/arquibqto.png" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} alt="Arquidiócesis" />
          
          <div style={{ textAlign: 'center', flex: 1, padding: '0 10px' }}>
            <h2 style={{ margin: 0, fontSize: '23px', fontWeight: 'bold', letterSpacing: '0.3px', fontFamily: "'Georgia', serif" }}>Arquidiócesis de Barquisimeto</h2>
            
            {/* LÍNEA AZUL MARCADOR */}
            <div style={{ width: '100%', height: '0px', borderTop: '2px solid #0056b3', margin: '3px 0 5px 0' }}></div>
            
            <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              PARROQUIA SANTA TERESITA DEL NIÑO JESÚS
            </h3>
            
            <p style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: 'bold' }}>
              Urb. del Este - Barquisimeto
            </p>
            
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold' }}>
              Edo. Lara - Venezuela
            </p>
            
            <p style={{ margin: '0 0 2px 0', fontSize: '10.5px', lineHeight: '1.3' }}>
              <b>Dirección:</b> <span style={{ fontStyle: 'italic' }}>Calle 7 Urb. del Este. Barquisimeto - Venezuela</span>
            </p>
            
            <p style={{ margin: 0, fontSize: '10.5px', fontStyle: 'italic', color: '#000000', lineHeight: '1.3' }}>
              RIF: G - 20017783-7 &nbsp;&nbsp; pqsantateresitabarquisimeto@gmail.com &nbsp;&nbsp; Teléfono: +58 4141590572
            </p>
          </div>          
          
          {/* LOGO SANTA TERESITA AGRANDADO FIJO */}
          <img src="/stateresita.png" style={{ height: '110px', width: 'auto', objectFit: 'contain' }} alt="Santa Teresita" />
        </div>

        {/* LÍNEA SEPARADORA NEGRA: SIN MÁRGENES NEGATIVOS PARA EVITAR BUGS DE COLOR */}
        <div style={{ width: '68%', height: '1px', backgroundColor: '#000000', margin: '15px auto 20px auto' }}></div>

        {/* TÍTULO DEL DOCUMENTO */}
        <h2 style={{ textAlign: 'center', fontSize: '17px', marginBottom: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          CERTIFICADO DE MATRIMONIO
        </h2>

        {/* SECCIÓN CENTRAL: TEXTO FLUIDO + COLUMNA REGISTROS */}
        <div style={{ display: 'flex', gap: '20px', width: '100%', alignItems: 'stretch', marginBottom: '15px' }}>
          
          {/* COLUMNA IZQUIERDA: CON LÍNEA VERTICAL DERECHA */}
          {/* AJUSTE DE LÍNEA VERTICAL: Puedes cambiar '1px solid #000000' y la cercanía con 'paddingRight' */}
          <div style={{ flex: 2.3, fontSize: '14px', lineHeight: '2.1', textAlign: 'justify', borderRight: '1px solid #000000', paddingRight: '14px' }}>
            El Presbítero <b>Freddy José Rodríguez Jiménez</b>, Párroco de esta comunidad eclesial, certifica que según consta en el Acta reseñada al margen, correspondiente al libro de Matrimonios contrajeron nupcias, según el rito de la Santa Madre Iglesia, en esta Parroquia, el día: <b>{formatearFecha(formData.fechaSacramento)}</b>.
            <br />
            El Sr. <span style={{ fontSize: '14.5px', fontWeight: 'bold', textDecoration: 'underline' }}>{formData.esposoNombre || '________________________________________'}</span>, de estado civil <b>{formData.esposoEstadoCivil || 'Soltero'}</b>, de <b>{formData.esposoEdad || '___'}</b> años de edad, natural de <b>{formData.esposoNaturalDe || '_______________'}</b>, vecino de <b>{formData.esposoVecinoDe || '_______________'}</b>, hijo de: <b>{formData.esposoPadre || '________________________________________'}</b> Y de: <b>{formData.esposoMadre || '________________________________________'}</b>.
            <br />
            y la Sra. <span style={{ fontSize: '14.5px', fontWeight: 'bold', textDecoration: 'underline' }}>{formData.esposaNombre || '________________________________________'}</span>, de estado civil <b>{formData.esposaEstadoCivil || 'Soltera'}</b>, de <b>{formData.esposaEdad || '___'}</b> años de edad, natural de <b>{formData.esposaNaturalDe || '_______________'}</b>, vecina de <b>{formData.esposaVecinaDe || '_______________'}</b>, hija de: <b>{formData.esposaPadre || '________________________________________'}</b> Y de: <b>{formData.esposaMadre || '________________________________________'}</b>.
            <br />
            <span style={{ fontWeight: 'bold', letterSpacing: '0.3px' }}>PADRINOS:</span> <b>{formData.padrino || '________________________________________'}</b> y <b>{formData.madrina || '________________________________________'}</b>.
            <br />
            <span style={{ fontWeight: 'bold', letterSpacing: '0.3px' }}>MINISTRO:</span> <b>{formData.ministro || '________________________________________'}</b>.
            <br /><br />
            Se expide el presente certificado para fines: <span style={{ fontWeight: 'bold' }}>{formData.motivo || 'Nulidad Matrimonial'}</span>.
          </div>

          {/* COLUMNA DERECHA: LOS 3 BLOQUES COMPACTOS */}
          <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '5.2cm' }}>
            
            {/* BLOQUE 1: REGISTRO ECLESIÁSTICO CON TEXTOS EN NEGRITA */}
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
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #000000', textAlign: 'center', fontWeight: 'bold' }}>{formatearTresDigitos(formData.partida || formData.tecnicoMun)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 6px', borderRight: '1px solid #000000', fontWeight: 'bold' }}>AÑO</td>
                  <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>{formData.tecnicoAnio || '____'}</td>
                </tr>
              </tbody>
            </table>

            {/* BLOQUE 2: INSCRIPCIÓN Y REGISTRO CIVIL */}
            <div style={{ border: '1.5px solid #000000', display: 'flex', flexDirection: 'column', fontSize: '11px' }}>
              <div style={{ backgroundColor: '#e6e6e6', borderBottom: '1px solid #000000', padding: '4px', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                INSCRIPCION CIVIL
              </div>
              <div style={{ padding: '5px 6px', lineHeight: '1.35' }}>
                <b>N°</b> {formData.civilActa || '__________'} <br />
                <b>Fecha:</b> {formatearFechaCorta(formData.civilFecha)}
              </div>
              
              <div style={{ backgroundColor: '#e6e6e6', borderTop: '1px solid #000000', borderBottom: '1px solid #000000', padding: '4px', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                REGISTRO CIVIL
              </div>
              <div style={{ padding: '4px 6px', fontSize: '10.5px' }}>
                {formData.civilNombreRegistro || 'Municipio Iribarren'}
              </div>
              
              <div style={{ backgroundColor: '#e6e6e6', borderTop: '1px solid #000000', borderBottom: '1px solid #000000', padding: '2px 4px', fontWeight: 'bold', textAlign: 'center', fontSize: '9.5px' }}>
                MUNICIPIO
              </div>
              <div style={{ padding: '4px 6px', fontSize: '10.5px' }}>
                {formData.civilMunicipio || 'Iribarren'}
              </div>
              
              <div style={{ backgroundColor: '#e6e6e6', borderTop: '1px solid #000000', borderBottom: '1px solid #000000', padding: '2px 4px', fontWeight: 'bold', textAlign: 'center', fontSize: '9.5px' }}>
                ESTADO
              </div>
              <div style={{ padding: '4px 6px', fontSize: '10.5px' }}>
                {formData.civilEstado || 'Lara'}
              </div>
            </div>

            {/* BLOQUE 3: NOTA MARGINAL CONTENIDA */}
            <div style={{ border: '1.5px solid #000000', display: 'flex', flexDirection: 'column', fontSize: '11px', maxHeight: '90px', minHeight: '70px', flex: 1 }}>
              <div style={{ backgroundColor: '#e6e6e6', borderBottom: '1px solid #000000', padding: '4px', fontWeight: 'bold', textAlign: 'center', fontSize: '10.5px', letterSpacing: '0.5px' }}>
                NOTA MARGINAL:
              </div>
              <div style={{ padding: '6px', lineHeight: '1.3', fontStyle: 'italic', textAlign: 'justify', fontSize: '10px', overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
                {formData.observaciones || ''}
              </div>
            </div>

          </div>
        </div>

        {/* PIE DE FE Y FIRMAS CONTROLADO EN RECORRIDO INFERIOR FIJO */}
        <div style={{ position: 'absolute', bottom: '2.2cm', left: '1.5cm', right: '1.5cm', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: 'calc(100% - 3.0cm)' }}>
          
          {/* LADO IZQUIERDO: FECHA DE EXPEDICIÓN Y DOY FE (SUBIDO) */}
          <div style={{ fontSize: '13.5px', lineHeight: '1.7', maxWidth: '55%', textAlign: 'left', paddingBottom: '5px' }}>
            En Barquisimeto, {formatearFecha(formData.fechaExpedicion)}.
            <br />
            Doy fe de lo anteriormente expuesto.
          </div>
          
          {/* LADO DERECHO: FIRMA DEL PÁRROCO */}
          <div style={{ position: 'relative', textAlign: 'center', width: '250px' }}>
            <img src="/firma.png" onError={(e) => e.target.style.display='none'} style={{ height: '55px', position: 'absolute', top: '-45px', left: '50%', transform: 'translateX(-50%)', zIndex: 1, pointerEvents: 'none' }} alt="" />
            
            <div style={{ borderTop: '1px solid #000000', width: '100%', paddingTop: '4px', fontWeight: 'bold', fontSize: '13.5px', position: 'relative', zIndex: 2 }}>
              Pbro. Freddy J. Rodríguez J.
            </div>
            <div style={{ fontSize: '11.5px', marginTop: '1px' }}>Párroco</div>
          </div>

        </div>

        {/* ADVERTENCIA LEGAL LEGAL (LÍMITE INFERIOR ABSOLUTO) */}
        <div style={{ position: 'absolute', bottom: '0.6cm', left: '1.5cm', right: '1.5cm', fontSize: '9px', borderTop: '1px solid #e0e0e0', paddingTop: '5px', textAlign: 'justify', lineHeight: '1.25' }}>
          <b>NOTA:</b> Si este certificado va a ser utilizado fuera de la Arquidiócesis debe ser autenticado en la Cancillería de la Curia Arquidiocesana.
        </div>

      </div>

      {/* ESTILOS CSS REFORZADOS PARA FORZAR BLANCO ABSOLUTO Y UNA SOLA HOJA */}
      <style>{`
        @page {
          size: letter;
          margin: 0mm !important;
        }
        @media print {
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            overflow: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            margin: 0 auto !important;
            position: relative !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}