import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logoMoneda from '../assets/logo.png';
import textoLogo from '../assets/letras.png';

const TVPage = () => {
  const [plan, setPlan] = useState([]);
  const [config, setConfig] = useState({ numero_sorteo: '---', fecha: '---' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValues, setInputValues] = useState(Array(6).fill(""));
  
  const inputRefs = useRef([]);

  // Cargar configuraciones locales
  useEffect(() => {
    axios.get('./plan.json').then(res => setPlan(res.data)).catch(e => console.error("Error al cargar plan.json"));
    axios.get('./config_sorteo.json').then(res => setConfig(res.data)).catch(e => console.error("Error al cargar config_sorteo.json"));
  }, []);

  // Foco automático al cambiar de premio
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [currentIndex, plan]);

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
      
      if (val.length === maxLength && index < numInputs - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1].focus();
    if (e.key === 'ArrowRight' && index < numInputs - 1) inputRefs.current[index + 1].focus();
    
    // AVANZAR con Flecha Abajo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      avanzarSiguiente();
    }

    // REGRESAR con Flecha Arriba
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      regresarAnterior();
    }
  };

  const avanzarSiguiente = () => {
    if (currentIndex < plan.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInputValues(Array(6).fill(""));
    }
  };

  const regresarAnterior = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setInputValues(Array(6).fill("")); // Limpiar inputs al regresar
    }
  };

  if (plan.length === 0) return <div className="tv-container">Cargando Sorteo...</div>;

  return (
    <div className="tv-container">
      <header className="header-container">
        <div className="logo-wrapper">
          <img src={logoMoneda} className="coin-img" alt="Logo" />
          <img src={textoLogo} className="text-img" alt="Lotería" />
        </div>
      </header>

      <div className="prize-info">
        {/* <div className="prize-label">PREMIO</div> */}
        <div className="prize-title">{currentPrize.titulo}</div>
        <div className="prize-value">{currentPrize.valor}</div>
      </div>

      <div className="inputs-container">
        {inputValues.slice(0, numInputs).map((val, index) => (
          <React.Fragment key={index}>
            {/* Separador de 60px antes del 5to input si hay 6 en total */}
            {numInputs === 6 && index === 4 && <div className="serie-spacer" />}
            
            <input
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              className={`balota-input ${index === 4 ? 'input-doble' : ''}`}
              value={val}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoComplete="off"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="sorteo-footer-info">
        <div style={{ color: 'var(--color-oro-brillo)', fontSize: '3rem', fontWeight: '900' }}>
          SORTEO No. {config.numero_sorteo}
        </div>
        <div style={{ color: 'white', fontSize: '2rem', opacity: 0.9 }}>
          {config.fecha}
        </div>
      </div>
    </div>
  );
};

export default TVPage;