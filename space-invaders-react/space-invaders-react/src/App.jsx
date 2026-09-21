import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import HighScoresPage from './pages/HighScoresPage';
import PlayerProfile from './pages/PlayerProfile';
import { GameProvider } from './context/GameContext';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/juego/:num" element={<GamePage />} />
          <Route path="/puntajes" element={<HighScoresPage />} />
          <Route path="/jugador/:id" element={<PlayerProfile />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}