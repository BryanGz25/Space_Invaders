import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import HighScoresPage from './pages/HighScoresPage';
import PlayerProfile from './pages/PlayerProfile';
import { GameProvider } from './context/GameContext';
import './index.css';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="arcade-cabinet">
          {/* MARQUESINA SUPERIOR DE LA MÁQUINA ARCADE */}
          <div style={{
            width: '100%',
            backgroundColor: '#000',
            borderBottom: '3px solid #00ffcc',
            padding: '12px 5px',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            <h1 style={{
              margin: 0,
              color: '#ff0055',
              fontSize: '14px',
              letterSpacing: '1px',
              textShadow: '2px 2px #00ffcc'
            }}>
              👾 SPACE INVADERS ARCADE 🚀
            </h1>
          </div>

          <Menu />

          {/* ÁREA DE PANTALLA PRINCIPAL */}
          <div style={{
            backgroundColor: '#000',
            padding: '15px 10px',
            borderRadius: '8px',
            border: '2px solid #333',
            minHeight: '460px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/juego/:num" element={<GamePage />} />
              <Route path="/puntajes" element={<HighScoresPage />} />
              <Route path="/jugador/:id" element={<PlayerProfile />} />
            </Routes>
          </div>

          {/* PANEL INFERIOR ARCADE */}
          <div style={{
            width: '100%',
            padding: '12px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '8px',
            color: '#00ffcc',
            marginTop: '10px'
          }}>
            <span>[◀] [▶] MOVER | [ESPACIO] DISPARAR</span>
            <span style={{ color: '#ffff00' }}>CRÉDITOS: 99</span>
          </div>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}