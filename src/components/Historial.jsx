import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  User, 
  ExternalLink, 
  Trash2, 
  ArrowLeft 
} from 'lucide-react';

const COLORS = { 
  brown: '#603828', 
  gold: '#C49E65', 
  cream: '#FAF6F0', 
  white: '#FFFFFF', 
  border: '#E6DFD5',
  text: '#2D3748',
  subtext: '#718096',
  danger: '#E53E3E'
};

export default function Historial({ historial, onCargar, onEliminar, onVaciar, onVolver }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Filtrado dinámico
  const historialFiltrado = historial.filter(item => {
    const cumpleTipo = filtroTipo === 'todos' || item.certType === filtroTipo;
    
    const nombrePrincipal = item.formData.bautizadoNombre || item.formData.esposoNombre || '';
    const esposo = item.formData.esposoNombre || '';
    const esposa = item.formData.esposaNombre || '';
    const libro = item.formData.libro || '';
    const folio = item.formData.folio || '';
    
    const termino = busqueda.toLowerCase();
    const cumpleBusqueda = 
      nombrePrincipal.toLowerCase().includes(termino) ||
      esposo.toLowerCase().includes(termino) ||
      esposa.toLowerCase().includes(termino) ||
      libro.toLowerCase().includes(termino) ||
      folio.toLowerCase().includes(termino);

    return cumpleTipo && cumpleBusqueda;
  });

  const getBadgeLabel = (type) => {
    switch (type) {
      case 'bautizo': return 'CERTIFICADO BAUTISMAL';
      case 'matrimonio': return 'ACTA DE MATRIMONIO';
      case 'confirmacion': return 'CERTIFICADO DE CONFIRMACIÓN';
      case 'comunion': return 'PRIMERA COMUNIÓN';
      default: return 'CERTIFICADO';
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.white, width: '100%', maxWidth: '1000px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      
      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <button 
            onClick={onVolver} 
            style={{ background: 'none', border: 'none', color: COLORS.brown, fontWeight: 'bold', cursor: 'pointer', padding: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} color={COLORS.brown} /> INICIO
          </button>
          <h2 style={{ margin: 0, fontSize: '18px', color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color={COLORS.brown} /> Historial de Certificados Guardados ({historialFiltrado.length})
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: COLORS.subtext }}>
            Consulte y reabra actas generadas previamente guardadas localmente en este dispositivo
          </p>
        </div>

        {historial.length > 0 && (
          <button 
            onClick={onVaciar} 
            style={{ border: '1px solid #FEB2B2', backgroundColor: '#FFF5F5', color: COLORS.danger, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
          >
            Vaciar Historial
          </button>
        )}
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: COLORS.subtext, display: 'flex', alignItems: 'center' }}>
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Buscar por nombre del sacramentado, libro o folio..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, outline: 'none', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>

        <select 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, outline: 'none', fontSize: '13px', backgroundColor: COLORS.white, color: COLORS.text, cursor: 'pointer' }}
        >
          <option value="todos">Todos los Sacramentos</option>
          <option value="bautizo">Bautizos</option>
          <option value="confirmacion">Confirmaciones</option>
          <option value="comunion">Comuniones</option>
          <option value="matrimonio">Matrimonios</option>
        </select>
      </div>

      {/* GRID DE CARDS */}
      {historialFiltrado.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: COLORS.subtext, border: `2px dashed ${COLORS.border}`, borderRadius: '12px' }}>
          No se encontraron certificados guardados en el historial.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(430px, 1fr))', gap: '20px' }}>
          {historialFiltrado.map((item) => {
            const { formData, certType } = item;
            const esMatrimonio = certType === 'matrimonio';

            return (
              <div 
                key={item.id} 
                style={{ border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '18px', backgroundColor: COLORS.white, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.01)' }}
              >
                <div>
                  {/* Título Badge y Libro/Folio */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#EDF2F7', color: '#4A5568', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {getBadgeLabel(certType)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#A0AEC0', fontWeight: '500' }}>
                      Libro {formData.libro || '---'} / Folio {formData.folio || '---'}
                    </span>
                  </div>

                  {/* Nombre(s) principal(es) */}
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: COLORS.text, fontWeight: 'bold' }}>
                    {esMatrimonio ? (
                      <>
                        {formData.esposoNombre || '---'}
                        <div style={{ fontSize: '12px', color: COLORS.subtext, fontWeight: 'normal', marginTop: '2px' }}>
                          con {formData.esposaNombre || '---'}
                        </div>
                      </>
                    ) : (
                      formData.bautizadoNombre || 'Sin nombre registrado'
                    )}
                  </h3>

                  {/* Metadata: Fecha Sacramento y Celebrante/Ministro */}
                  <div style={{ fontSize: '12px', color: COLORS.subtext, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color={COLORS.subtext} /> 
                      <span>Fecha Sacramento: {formData.fechaSacramento || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color={COLORS.subtext} /> 
                      <span>Celebrante: {formData.ministro || formData.celebrante || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN (Cargar y Eliminar) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${COLORS.cream}`, paddingTop: '12px', marginTop: '5px' }}>
                  <button 
                    onClick={() => onCargar(item)}
                    style={{ background: 'none', border: 'none', color: '#2B6CB0', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
                  >
                    <ExternalLink size={15} /> Cargar en Vista Previa
                  </button>

                  <button 
                    onClick={() => onEliminar(item.id)}
                    title="Eliminar del historial"
                    style={{ background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    onMouseOver={(e) => e.currentTarget.style.color = COLORS.danger}
                    onMouseOut={(e) => e.currentTarget.style.color = '#A0AEC0'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}