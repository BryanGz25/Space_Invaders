import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [jugadorActual, setJugadorActual] = useState('Jugador_1');
  const [dificultad, setDificultad] = useState('Normal');

  return (
    <GameContext.Provider value={{ jugadorActual, setJugadorActual, dificultad, setDificultad }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);