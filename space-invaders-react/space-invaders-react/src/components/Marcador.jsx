import React from 'react';
import ElementoJuego from './ElementoJuego';

export default function Marcador({ puntaje, vidas, nivel }) {
  return (
    <div style={{
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      padding: '10px 15px',
      background: '#000000',
      border: '3px solid #00ff00',
      borderRadius: '6px',
      width: '500px',
      margin: '0 auto 12px auto',
      color: '#00ff00',
      fontSize: '10px',
      letterSpacing: '1px'
    }}>
      <div>PTS: {puntaje.toString().padStart(5, '0')}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>VIDAS:</span>
        {Array.from({ length: Math.max(vidas, 0) }).map((_, i) => (
          <ElementoJuego key={i} tipo="corazon" />
        ))}
      </div>
      <div>NVL: {nivel}</div>
    </div>
  );
}