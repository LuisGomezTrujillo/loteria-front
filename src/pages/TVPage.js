import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logoMoneda from '../assets/logo.png';
import textoLogo from '../assets/letras.png';

const TVPage = () => {
  const [plan, setPlan] = useState([]);
  const [config, setConfig] = useState({ numero_sorteo: '---', fecha: '---' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValues, setInputValues] = useState(Array(6).fill(""));
  const [isSaved, setIsSaved] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  
  const inputRefs = useRef([]);

  const API_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:8000/resultados/" 
    : "https://tu-backend-loteria.onrender.com/resultados/";

  useEffect(() => {
    axios.get('./plan.json')
      .then(res => setPlan(res.data))
      .catch(e => console.error("Falta plan.json"));

    axios.get('./config_sorteo.json')
      .then(res => setConfig(res.data))
      .catch(e => console.error("Falta config_sorteo.json"));
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
    setIsSaved(false);
  }, [currentIndex, plan]);

  // Obtener cuántos inputs mostrar para el premio actual (4 o 6)
  const currentPrize = plan[currentIndex];
  const numInputs = currentPrize ? parseInt(currentPrize.inputs) : 6;

  const handleChange = (e, index) => {
    const val = e.target.value;
    const isDouble = index === 4; // Quinto input (índice 4)
    const maxLength = isDouble ? 2 : 1;

    if (/^\d*$/.test(val) && val.length <= maxLength) {
      const newValues = [...inputValues];
      newValues[index] = val;
      setInputValues(newValues);
      
      // Auto-foco al siguiente si completó el actual
      if (val.length === maxLength && index < numInputs - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = async (e, index) => {
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1].focus();
    if (e.key === 'ArrowRight' && index < numInputs - 1) inputRefs.current[index + 1].focus();
    
    if (e.key.toLowerCase() === 's') {
      e.preventDefault();
      await guardarResultado();
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      avanzarSiguiente();
    }
  };

  const guardarResultado = async () => {
    const validInputs = inputValues.slice(0, numInputs);
    const resultadoString = validInputs.join("");
    
    // Validar que se hayan llenado los campos mínimos
    if (resultadoString.length < numInputs) return;

    const body = {
      numero_sorteo: config.numero_sorteo,
      fecha_sorteo: config.fecha,
      titulo_premio: currentPrize.titulo,
      resultado_concatenado: resultadoString,
      inputs_usados: numInputs
    };

    try {
      await axios.post(API_URL, body);
      setIsSaved(true);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
    } catch (error) {
      alert("Error al conectar con el servidor local");
    }
  };

  const avanzarSiguiente = () => {
    if (currentIndex < plan.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInputValues(Array(6).fill(""));
      setIsSaved(false);
    } else {
      alert("Sorteo Finalizado");
    }
  };

  if (plan.length === 0) return <div className="tv-container">Cargando...</div>;

  return (
    <div className="tv-container">
      {showCheck && (
        <div className="check-overlay">
          <div className="check-circle">✓</div>
        </div>
      )}

      <header className="header-container">
        <div className="logo-wrapper">
          <img src={logoMoneda} className="coin-img" alt="Logo" />
          <img src={textoLogo} className="text-img" alt="Lotería" />
        </div>
      </header>

      <div className="prize-info">
        <div className="prize-label">PREMIO</div>
        <div className="prize-title">{currentPrize.titulo}</div>
        <div className="prize-value">{currentPrize.valor}</div>
      </div>

      <div className="inputs-container">
        {inputValues.slice(0, numInputs).map((val, index) => (
          <React.Fragment key={index}>
            {/* Si hay 6 inputs, añadir el espacio extra antes del quinto (serie) */}
            {numInputs === 6 && index === 4 && <div className="serie-spacer" />}
            
            <input
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              className={`balota-input 
                ${isSaved ? 'saved-style' : ''} 
                ${index === 4 ? 'input-doble' : ''}`}
              value={val}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoComplete="off"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="sorteo-footer-info">
        <div style={{ color: 'var(--color-oro-brillo)', fontSize: '2rem', fontWeight: '900' }}>
          SORTEO No. {config.numero_sorteo}
        </div>
        <div style={{ color: 'white', fontSize: '1.5rem', opacity: 0.9 }}>
          {config.fecha}
        </div>
      </div>
    </div>
  );
};

export default TVPage;