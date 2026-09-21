import React from 'react';
import { useParams } from 'react-router-dom';

export default function PlayerProfile() {
  const { id } = useParams();

  return (
    <div style={{ color: '#fff', textAlign: 'center', marginTop: '30px' }}>
      <h2>Perfil del Jugador ID: {id}</h2>
      <p>Estadísticas e historial de partidas registradas.</p>
    </div>
  );
}