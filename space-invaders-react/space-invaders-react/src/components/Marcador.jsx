import React from 'react';

export default function Marcador({ puntaje, vidas, nivel }) {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '12px 20px', 
      background: '#0a0a0a', 
      color: '#00ff00', 
      fontFamily: 'monospace',
      fontSize: '18px',
      fontWeight: 'bold',
      border: '2px solid #00ff00',
      marginBottom: '15px',
      borderRadius: '8px',
      maxWidth: '500px',
      margin: '0 auto 15px auto'
    }}>
      <span>PUNTOS: {puntaje}</span>
      <span>VIDAS: {"❤️".repeat(vidas)}</span>
      <span>NIVEL: {nivel}</span>
    </div>
  );
}