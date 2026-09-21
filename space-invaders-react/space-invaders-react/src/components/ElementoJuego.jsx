import React from 'react';

export default function ElementoJuego({ tipo, x, y }) {
  const estilosBase = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    transition: 'all 0.05s linear',
    userSelect: 'none'
  };

  // Nave Retro Verde (Jugador)
  if (tipo === 'jugador') {
    return (
      <div style={{ ...estilosBase, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px' }}>
        <div style={{ width: '4px', height: '6px', background: '#00ff00' }} />
        <div style={{ width: '16px', height: '6px', background: '#00ff00' }} />
        <div style={{ width: '28px', height: '10px', background: '#00ff00', borderRadius: '2px 2px 0 0' }} />
      </div>
    );
  }

  // Marcianito Alien
  if (tipo === 'alien') {
    return (
      <div style={{ ...estilosBase, fontSize: '22px', lineHeight: '1' }}>
        👾
      </div>
    );
  }

  // Disparo Verde Jugador
  if (tipo === 'bala') {
    return (
      <div style={{
        ...estilosBase,
        width: '4px',
        height: '14px',
        background: '#00ff00',
        boxShadow: '0 0 6px #00ff00',
        borderRadius: '2px'
      }} />
    );
  }

  // Disparo Rojo Alien
  if (tipo === 'balaAlien') {
    return (
      <div style={{
        ...estilosBase,
        width: '4px',
        height: '12px',
        background: '#ff0055',
        boxShadow: '0 0 6px #ff0055',
        borderRadius: '2px'
      }} />
    );
  }

  return null;
}