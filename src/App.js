import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TVPage from './pages/TVPage';
import PlanGenerator from './pages/PlanGenerator'; // <-- ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ
import SorteoGenerator from './pages/SorteoGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TVPage />} />
        <Route path="/admin-plan" element={<PlanGenerator />} />
        <Route path="/admin-sorteo" element={<SorteoGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;