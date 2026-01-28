import React, { useState } from 'react';

const PlanGenerator = () => {
  const [premios, setPremios] = useState([]);
  const [form, setForm] = useState({ id: 1, titulo: '', valor: '', inputs: 6 });

  const agregarPremio = (e) => {
    e.preventDefault();
    if (!form.titulo || !form.valor) return;
    setPremios([...premios, form]);
    setForm({ ...form, id: form.id + 1, titulo: '' });
  };

  const eliminarPremio = (id) => {
    setPremios(premios.filter(p => p.id !== id));
  };

  const descargarJSON = () => {
    const blob = new Blob([JSON.stringify(premios, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "plan.json";
    link.click();
  };

  return (
    <div style={{ padding: '20px', color: '#000', background: '#f4f4f4', minHeight: '100vh', textAlign: 'left' }}>
      <h1>1. Generador de Plan de Premios</h1>
      <p>Agregue los 52 premios aquí. La lista crecerá hacia abajo.</p>
      
      <form onSubmit={agregarPremio} style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'sticky', top: 0, background: '#fff', padding: '15px', border: '1px solid #ccc' }}>
        <input placeholder="Título (Ej: SECO 1)" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required />
        <input placeholder="Valor (Ej: 20 MILLONES)" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required />
        <button type="submit" style={{ background: 'green', color: 'white', padding: '5px 15px' }}>+ Agregar</button>
        <button type="button" onClick={descargarJSON} style={{ background: '#0a1a4a', color: 'white' }}>💾 Descargar plan.json</button>
      </form>

      <div style={{ maxHeight: '60vh', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
        <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <thead><tr><th>#</th><th>Título</th><th>Valor</th><th>Acción</th></tr></thead>
          <tbody>
            {premios.map((p, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.titulo}</td>
                <td>{p.valor}</td>
                <td><button onClick={() => eliminarPremio(p.id)} style={{ color: 'red' }}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanGenerator;