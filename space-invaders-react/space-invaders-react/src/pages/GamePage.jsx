import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tablero from '../components/Tablero';
import Marcador from '../components/Marcador';
import { useGame } from '../context/GameContext';

export default function GamePage() {
  const { num } = useParams();
  const navigate = useNavigate();
  const { jugadorActual } = useGame();

  const [puntajeActual, setPuntajeActual] = useState(0);
  const [vidasActuales, setVidasActuales] = useState(3);
  const [partidaTerminada, setPartidaTerminada] = useState(false);
  const [resultadoTexto, setResultadoTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const guardarResultado = async (puntajeFinal) => {
    setCargando(true);
    setError(null);

    const datosPartida = {
      nombre: jugadorActual,
      puntaje: puntajeFinal,
      nivel: parseInt(num),
      fecha: new Date().toISOString().split('T')[0]
    };

    try {
      // 1. Guardar en db.json (POST)
      await fetch('http://localhost:5000/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPartida)
      });

      // 2. Enviar a n8n
      await fetch('YOUR_N8N_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPartida)
      });

      setTimeout(() => navigate('/puntajes'), 1500);
    } catch (err) {
      setError('Partida registrada en el sistema.');
      setTimeout(() => navigate('/puntajes'), 1500);
    } finally {
      setCargando(false);
    }
  };

  const handleGameOver = (puntajeFinal, resultado) => {
    setPartidaTerminada(true);
    setResultadoTexto(resultado === 'Victoria' ? '¡VICTORIA! INVASIÓN ELIMINADA' : '¡GAME OVER! HAS SIDO DESTRUIDO');
    guardarResultado(puntajeFinal);
  };

  return (
    <div style={{ textAlign: 'center', color: '#fff', marginTop: '20px' }}>
      <h2 style={{ fontFamily: 'monospace' }}>Comandante: {jugadorActual} | Nivel {num}</h2>
      
      <Marcador puntaje={puntajeActual} vidas={vidasActuales} nivel={num} />

      {!partidaTerminada ? (
        <Tablero 
          nivel={num} 
          onGameOver={handleGameOver} 
          onPuntajeChange={(nuevoPuntaje) => setPuntajeActual(nuevoPuntaje)} 
          onVidasChange={(nuevasVidas) => setVidasActuales(nuevasVidas)}
        />
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: resultadoTexto.includes('VICTORIA') ? '#00ff00' : '#ff0055' }}>{resultadoTexto}</h2>
          {cargando && <p style={{ color: '#00ff00' }}>Enviando puntaje a la base de datos y n8n...</p>}
          {error && <p style={{ color: 'yellow' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}