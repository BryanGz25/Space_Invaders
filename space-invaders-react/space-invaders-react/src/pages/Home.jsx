import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function Home() {
  const { jugadorActual, setJugadorActual } = useGame();
  const navigate = useNavigate();

  const iniciarJuego = (e) => {
    e.preventDefault();
    if (jugadorActual.trim() !== '') {
      navigate('/juego/1');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>
      <h1>👾 Space Invaders React 🚀</h1>
      <p>Defiende la tierra consumiendo APIs y procesando workflows con n8n.</p>
      
      <form onSubmit={iniciarJuego} style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          value={jugadorActual} 
          onChange={(e) => setJugadorActual(e.target.value)} 
          placeholder="Nombre del Jugador" 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
          required 
        />
        <br /><br />
        <button type="submit" style={{ padding: '10px 20px', background: '#00ff00', color: '#000', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
          ¡Comenzar Partida!
        </button>
      </form>
    </div>
  );
}