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

  // 1. Carga de datos iniciales
  useEffect(() => {
    axios.get('./plan.json')
      .then(res => setPlan(res.data))
      .catch(e => console.error("Error al cargar plan.json"));

    axios.get('./sorteo.json')
      .then(res => setConfig(res.data))
      .catch(e => console.error("Error al cargar sorteo.json"));
  }, []);

  // 2. Manejador Global de Teclado (WASD + Enter Toggle)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Acción Toggle Foco con ENTER (Alternar entre quitar foco o ir al primer input)
      if (key === 'enter') {
        e.preventDefault();
        const isAnyFocused = document.activeElement.tagName === 'INPUT';
        
        if (isAnyFocused) {
          document.activeElement.blur(); // Quita el foco si está activo
        } else {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus(); // Pone foco en el extremo izquierdo si estaba inactivo
          }
        }
        return;
      }

      // Navegación de Premios: W (Arriba) y S (Abajo)
      if (key === 'arrowdown' || key === 's') {
        if (currentIndex < plan.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setInputValues(Array(6).fill("")); // Limpia para el nuevo premio
        }
        return;
      }

      if (key === 'arrowup' || key === 'w') {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setInputValues(Array(6).fill("")); // Limpia para el premio anterior
        }
        return;
      }

      // Navegación lateral global (A y D) cuando no se está escribiendo
      const isAnyFocused = document.activeElement.tagName === 'INPUT';
      if (!isAnyFocused) {
        if (key === 'a' && inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
        if (key === 'd') {
          const currentNumInputs = plan[currentIndex] ? parseInt(plan[currentIndex].inputs) : 6;
          if (inputRefs.current[currentNumInputs - 1]) {
            inputRefs.current[currentNumInputs - 1].focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentIndex, plan]);

  // 3. Foco inicial automático al cargar el componente o cambiar premio
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [currentIndex, plan]);

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
      
      // Salto automático al siguiente input
      if (val.length === maxLength && index < numInputs - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleInputKeyDown = (e, index) => {
    const key = e.key.toLowerCase();
    
    // Navegación lateral entre balotas (A y D)
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
