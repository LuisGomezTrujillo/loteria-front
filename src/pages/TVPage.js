import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logoMoneda from '../assets/logo.png';
import textoLogo from '../assets/letras.png';

const TVPage = () => {
  const [plan, setPlan] = useState([]);
  const [config, setConfig] = useState({ numero_sorteo: '---', fecha: '---' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValues, setInputValues] = useState(Array(6).fill(""));
  const [isFocusEnabled, setIsFocusEnabled] = useState(true); 
  
  const inputRefs = useRef([]);

  useEffect(() => {
    axios.get('./plan.json')
      .then(res => setPlan(res.data))
      .catch(e => console.error("Error al cargar plan.json"));

    axios.get('./sorteo.json')
      .then(res => setConfig(res.data))
      .catch(e => console.error("Error al cargar sorteo.json"));
  }, []);

  // Manejador Global de Teclado
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // TOGGLE FOCUS con la tecla 'Q'
      if (key === 'q') {
        e.preventDefault();
        setIsFocusEnabled(prev => !prev);
        return;
      }

      // Navegación de Premios: W (Arriba) y S (Abajo)
      if (key === 'arrowdown' || key === 's') {
        if (currentIndex < plan.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setInputValues(Array(6).fill(""));
        }
        return;
      }

      if (key === 'arrowup' || key === 'w') {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setInputValues(Array(6).fill(""));
        }
        return;
      }

      // Navegación lateral (A y D) solo si el foco está permitido
      if (isFocusEnabled) {
        if (key === 'a') {
          const activeIdx = inputRefs.current.indexOf(document.activeElement);
          if (activeIdx > 0) inputRefs.current[activeIdx - 1].focus();
          else inputRefs.current[0].focus();
        }
        if (key === 'd') {
          const activeIdx = inputRefs.current.indexOf(document.activeElement);
          const max = (plan[currentIndex] ? parseInt(plan[currentIndex].inputs) : 6) - 1;
          if (activeIdx >= 0 && activeIdx < max) inputRefs.current[activeIdx + 1].focus();
          else inputRefs.current[0].focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentIndex, plan, isFocusEnabled]);

  // Efecto para aplicar el foco/blur real basado en el estado isFocusEnabled
  useEffect(() => {
    if (isFocusEnabled) {
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } else {
      if (document.activeElement) document.activeElement.blur();
    }
  }, [isFocusEnabled, currentIndex]);

  const currentPrize = plan[currentIndex];
  const numInputs = currentPrize ? parseInt(currentPrize.inputs) : 6;

  const handleChange = (e, index) => {
    const val = e.target.value;
    const isDouble = index === 4; 
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

  const handleInputKeyDown = (e, index) => {
    const key = e.key.toLowerCase();
    if ((key === 'arrowleft' || key === 'a') && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if ((key === 'arrowright' || key === 'd') && index < numInputs - 1) {
      inputRefs.current[index + 1].focus();
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
        <div className="prize-label"> </div>
        <div className="prize-title">{currentPrize.titulo}</div>
        <div className="prize-value">{currentPrize.valor}</div>
      </div>

      <div className="inputs-container">
        {inputValues.slice(0, numInputs).map((val, index) => (
          <React.Fragment key={index}>
            {numInputs === 6 && index === 4 && <div className="serie-spacer" />}
            <input
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              className={`balota-input ${index === 4 ? 'input-doble' : ''}`}
              value={val}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleInputKeyDown(e, index)}
              autoComplete="off"
              // Usamos readOnly en lugar de disabled para evitar que el navegador cambie el color del texto
              readOnly={!isFocusEnabled}
            />
          </React.Fragment>
        ))}
      </div>

      <div className="sorteo-footer-info">
        <div style={{ color: 'var(--color-oro-brillo)', fontSize: '3rem', fontWeight: '900' }}>
          SORTEO No. {config.numero_sorteo}
        </div>
        <div style={{ color: 'white', fontSize: '2.5rem', opacity: 0.9 }}>
          {config.fecha}
        </div>
      </div>
    </div>
  );
};

export default TVPage;
