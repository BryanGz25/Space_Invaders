import React from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <nav style={{ background: '#1a1a1a', padding: '15px', textAlign: 'center', borderBottom: '2px solid #333' }}>
      <Link to="/" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold' }}>Inicio</Link> | 
      <Link to="/juego/1" style={{ color: '#00ff00', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold' }}>Jugar (Nivel 1)</Link> | 
      <Link to="/puntajes" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold' }}>Tabla de Puntajes</Link>
    </nav>
  );
}