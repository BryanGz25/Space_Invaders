import React, { useEffect, useState } from 'react';

export default function HighScoresPage() {
  const [scores, setScores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);

  useEffect(() => {
    // Intentar obtener datos de json-server
    fetch('http://localhost:5000/scores')
      .then((res) => {
        if (!res.ok) throw new Error('Servidor offline');
        return res.json();
      })
      .then((data) => {
        setScores(data.sort((a, b) => b.puntaje - a.puntaje));
        setCargando(false);
      })
      .catch(() => {
        // Si json-server no está corriendo, mostrar datos por defecto para que la pantalla NUNCA quede en blanco
        setScores([
          { id: '1', nombre: 'ComandanteAlpha', puntaje: 2400, nivel: 3, fecha: '2026-09-20' },
          { id: '2', nombre: 'StarDefender', puntaje: 1500, nivel: 2, fecha: '2026-09-21' },
          { id: '3', nombre: 'PilotoCadete', puntaje: 800, nivel: 1, fecha: '2026-09-21' }
        ]);
        setUsandoMock(true);
        setCargando(false);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#00ff00',
      padding: '40px 20px',
      fontFamily: 'monospace',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>🏆 TABLA DE PUNTAJES 🏆</h2>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>
        {usandoMock ? '⚠️ json-server no detectado (mostrando datos simulados localmente)' : 'Conectado a json-server en puerto 5000'}
      </p>

      {cargando ? (
        <p style={{ color: '#fff' }}>Cargando puntajes...</p>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {scores.map((s, index) => (
            <div 
              key={s.id || index} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#151515',
                border: '1px solid #00ff00',
                borderRadius: '6px',
                padding: '12px 20px',
                margin: '10px 0',
                boxShadow: '0 0 8px rgba(0,255,0,0.2)'
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                #{index + 1} {s.nombre}
              </span>
              <span style={{ color: '#fff' }}>
                {s.puntaje} pts (Nvl {s.nivel})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}