import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tablero from '../components/Tablero';
import Marcador from '../components/Marcador';
import { useGame } from '../context/GameContext';

export default function GamePage() {
  const { num } = useParams();
  const navigate = useNavigate();
  const { jugadorActual } = useGame();

  const nivelNum = parseInt(num || '1', 10);
  const NIVEL_FINAL = 4; // Definimos el nivel máximo del juego

  const [puntajeActual, setPuntajeActual] = useState(0);
  const [vidasActuales, setVidasActuales] = useState(3);
  const [partidaTerminada, setPartidaTerminada] = useState(false);
  const [resultado, setResultado] = useState('');
  const [claveReinicio, setClaveReinicio] = useState(0);

  // Reiniciar estado interno al cambiar de nivel vía URL
  useEffect(() => {
    setPartidaTerminada(false);
    setResultado('');
    setVidasActuales(3);
    setClaveReinicio((prev) => prev + 1);
  }, [num]);

  const guardarResultado = async (puntajeFinal) => {
    const datos = {
      nombre: jugadorActual,
      puntaje: puntajeFinal,
      nivel: nivelNum,
      fecha: new Date().toISOString().split('T')[0]
    };
    try {
      await fetch('http://localhost:5000/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      await fetch('YOUR_N8N_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
    } catch (e) {
      // Continuar si no está disponible el servidor mock
    }
  };

  const handleGameOver = (puntajeFinal, res) => {
    setPartidaTerminada(true);
    setResultado(res);
    guardarResultado(puntajeFinal);
  };

  // Pérdida: Reiniciar todo devolviendo al Nivel 1
  const reiniciarAlNivel1 = () => {
    setPuntajeActual(0);
    setVidasActuales(3);
    setPartidaTerminada(false);
    setResultado('');
    navigate('/juego/1');
  };

  const irSiguienteNivel = () => {
    navigate(`/juego/${nivelNum + 1}`);
  };

  const esVictoriaFinal = resultado === 'Victoria' && nivelNum === NIVEL_FINAL;

  return (
    <div style={{ textAlign: 'center', color: '#fff', width: '100%' }}>
      <Marcador puntaje={puntajeActual} vidas={vidasActuales} nivel={nivelNum} />

      {!partidaTerminada ? (
        <Tablero 
          nivel={nivelNum} 
          onGameOver={handleGameOver} 
          onPuntajeChange={setPuntajeActual} 
          onVidasChange={setVidasActuales}
          claveReinicio={claveReinicio}
        />
      ) : (
        <div style={{
          width: '500px',
          height: '380px',
          margin: '0 auto',
          background: '#050505',
          border: `4px solid ${resultado === 'Victoria' ? '#00ff00' : '#ff0055'}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: `0 0 25px ${resultado === 'Victoria' ? '#00ff00' : '#ff0055'}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* NOTIFICACIÓN ANIMADA DE FELICITACIONES (NIVEL FINAL GANADO) */}
          {esVictoriaFinal ? (
            <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px', animation: 'bounce 1s infinite alternate' }}>
                🎉 👾 🏆 🚀 ✨
              </div>
              <h2 style={{
                color: '#ffff00',
                fontSize: '18px',
                marginBottom: '15px',
                lineHeight: '1.4',
                textShadow: '0 0 10px #ffff00'
              }}>
                ¡FELICIDADES COMANDANTE!
              </h2>
              <p style={{ color: '#00ff00', fontSize: '11px', marginBottom: '10px' }}>
                ¡HAS COMPLETADO EL JUEGO Y SALVADO A LA TIERRA!
              </p>
              <p style={{ fontSize: '11px', marginBottom: '25px', color: '#ffffff' }}>
                PUNTAJE FINAL LEGENDARIO: {puntajeActual}
              </p>

              <div className="pixel-btn-container">
                <button onClick={reiniciarAlNivel1} className="pixel-btn-green">
                  🔄 JUGAR DE NUEVO (NIVEL 1)
                </button>
                <button onClick={() => navigate('/puntajes')} className="pixel-btn-yellow">
                  🏆 VER PUNTAJES
                </button>
              </div>
            </div>
          ) : (
            /* PANTALLAS ESTÁNDAR: VICTORIA PARCIAL O PÉRDIDA */
            <div>
              <h2 style={{
                color: resultado === 'Victoria' ? '#00ff00' : '#ff0055',
                fontSize: '16px',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                {resultado === 'Victoria' ? `¡NIVEL ${nivelNum} COMPLETADO!` : '¡GAME OVER! HAS SIDO DESTRUIDO'}
              </h2>

              <p style={{ fontSize: '11px', marginBottom: '30px', color: '#ffffff' }}>
                {resultado === 'Victoria' ? `PUNTAJE ACUMULADO: ${puntajeActual}` : `PUNTAJE CONSEGUIDO: ${puntajeActual}`}
              </p>

              <div className="pixel-btn-container">
                {resultado === 'Victoria' ? (
                  <button onClick={irSiguienteNivel} className="pixel-btn-green">
                    ⏩ SIGUIENTE NIVEL ({nivelNum + 1})
                  </button>
                ) : (
                  <button onClick={reiniciarAlNivel1} className="pixel-btn-green" style={{ borderColor: '#ff0055', color: '#ff0055' }}>
                    🔄 REINICIAR (VOLVER AL NIVEL 1)
                  </button>
                )}

                <button onClick={() => navigate('/puntajes')} className="pixel-btn-yellow">
                  🏆 TABLA DE PUNTAJES
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}