import React, { useState } from 'react';

const SorteoGenerator = () => {
  const [config, setConfig] = useState({ numero_sorteo: '', fecha: '' });

  const descargarConfig = () => {
    if (!config.numero_sorteo || !config.fecha) {
      alert("Por favor completa ambos campos");
      return;
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "config_sorteo.json"; // NOMBRE EXACTO QUE BUSCA LA TV
    link.click();
  };

  return (
    <div style={{ 
      padding: '50px', 
      background: '#ffffff', 
      color: '#000', 
      minHeight: '100vh', 
      textAlign: 'left',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ color: '#0a1a4a' }}>2. Configuración del Sorteo</h1>
      <p>Ingresa los datos que aparecerán en la parte inferior de la TV.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', marginTop: '30px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Número de Sorteo:</label>
          <input 
            type="text" 
            placeholder="Ej: 4873" 
            value={config.numero_sorteo} 
            onChange={e => setConfig({...config, numero_sorteo: e.target.value})}
            style={{ width: '100%', padding: '10px', fontSize: '1.2rem' }}
          />
        </div>
        
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Fecha del Sorteo:</label>
          <input 
            type="text" 
            placeholder="Ej: 28 de Enero 2026" 
            value={config.fecha} 
            onChange={e => setConfig({...config, fecha: e.target.value})}
            style={{ width: '100%', padding: '10px', fontSize: '1.2rem' }}
          />
        </div>
        
        <button 
          onClick={descargarConfig} 
          style={{ 
            padding: '15px', 
            background: '#d4af37', 
            color: 'white', 
            border: 'none', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          💾 Descargar config_sorteo.json
        </button>
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#eee', borderRadius: '5px' }}>
        <strong>Instrucciones:</strong>
        <ol>
          <li>Escribe el número y la fecha.</li>
          <li>Haz clic en descargar.</li>
          <li>Copia el archivo descargado a la carpeta <strong>public</strong> de tu proyecto.</li>
          <li>Reinicia o refresca la página de la TV.</li>
        </ol>
      </div>
    </div>
  );
};

export default SorteoGenerator;