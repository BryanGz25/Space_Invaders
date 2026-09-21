import React from 'react';

export default function ElementoJuego({ tipo, x, y, subtipo = 0, vidaBunker = 4 }) {
  const estilosBase = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: 10
  };

  // Nave Pixel Art Jugador
  if (tipo === 'jugador') {
    return (
      <svg width="32" height="20" viewBox="0 0 16 10" style={estilosBase}>
        <path fill="#00ff00" d="M7 0h2v1H7zM7 1h2v1H7zM6 2h4v1H6zM1 3h14v1H1zM0 4h16v6H0z" />
      </svg>
    );
  }

  // Aliens Pixel Art (3 clases)
  if (tipo === 'alien') {
    const colores = ['#ff00ff', '#00ffff', '#ffff00'];
    const color = colores[subtipo % 3];
    return (
      <svg width="28" height="20" viewBox="0 0 12 8" style={estilosBase}>
        <path fill={color} d="M3 0h6v1H3zM2 1h8v1H2zM0 2h12v3H0zM2 5h2v2H2zM8 5h2v2H8zM0 7h2v1H0zM10 7h2v1h-2z" />
      </svg>
    );
  }

  // Corazón Pixel Art para las Vidas
  if (tipo === 'corazon') {
    return (
      <svg width="18" height="18" viewBox="0 0 9 8" style={{ display: 'inline-block', margin: '0 3px' }}>
        <path fill="#ff0055" d="M1 0h2v1H1zM6 0h2v1H6zM0 1h4v2H0zM5 1h4v2H5zM1 3h7v1H1zM2 4h5v1H2zM3 5h3v1H3zM4 6h1v1H4z" />
      </svg>
    );
  }

  // Barrera/Búnker Defensivo Destructible
  if (tipo === 'bunker') {
    const opacidad = vidaBunker / 4;
    return (
      <div style={{
        ...estilosBase,
        width: '36px',
        height: '24px',
        backgroundColor: '#00ff00',
        opacity: opacidad,
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        boxShadow: '0 0 6px #00ff00'
      }} />
    );
  }

  // Disparos Retro
  if (tipo === 'bala') {
    return <div style={{ ...estilosBase, width: '4px', height: '12px', background: '#00ff00', boxShadow: '0 0 6px #00ff00' }} />;
  }

  if (tipo === 'balaAlien') {
    return <div style={{ ...estilosBase, width: '4px', height: '12px', background: '#ff0055', boxShadow: '0 0 6px #ff0055' }} />;
  }

  return null;
}