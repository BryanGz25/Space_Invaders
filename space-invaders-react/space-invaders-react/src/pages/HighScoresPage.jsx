import React, { useEffect, useState } from 'react';

export default function HighScoresPage() {
  const [scores, setScores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/scores')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo conectar con el servidor db.json');
        return res.json();
      })
      .then((data) => {
        setScores(data.sort((a, b) => b.puntaje - a.puntaje));
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
      <h2>🏆 Tabla de Clasificación</h2>

      {cargando && <p style={{ color: '#00ff00' }}>Cargando mejores puntajes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!cargando && !error && (
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '400px', margin: '0 auto' }}>
          {scores.map((s) => (
            <li key={s.id} style={{ background: '#222', margin: '10px 0', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #00ff00' }}>
              <strong>{s.nombre}</strong>: {s.puntaje} pts (Nivel {s.nivel}) - <em>{s.fecha}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}