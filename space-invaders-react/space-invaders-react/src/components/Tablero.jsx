import React, { useState, useEffect, useRef, useCallback } from 'react';
import ElementoJuego from './ElementoJuego';

export default function Tablero({ nivel, onGameOver, onPuntajeChange, onVidasChange }) {
  const [posNave, setPosNave] = useState(235);
  const [balasJugador, setBalasJugador] = useState([]);
  const [balasAliens, setBalasAliens] = useState([]);
  const [aliens, setAliens] = useState([]);
  const [direccionAlien, setDireccionAlien] = useState(1); // 1 = Derecha, -1 = Izquierda
  const [puntaje, setPuntaje] = useState(0);
  const [vidas, setVidas] = useState(3);

  const contenedorRef = useRef(null);

  // 1. Inicializar Oleada de Aliens
  useEffect(() => {
    const nuevosAliens = [];
    const filas = Math.min(2 + parseInt(nivel), 5);
    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < 7; c++) {
        nuevosAliens.push({
          id: `alien-${r}-${c}`,
          x: 30 + c * 55,
          y: 30 + r * 35,
          activo: true
        });
      }
    }
    setAliens(nuevosAliens);
  }, [nivel]);

  // 2. Controles de Teclado del Jugador
  const manejarTeclas = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      setPosNave((prev) => Math.max(prev - 20, 10));
    } else if (e.key === 'ArrowRight') {
      setPosNave((prev) => Math.min(prev + 20, 460));
    } else if (e.key === ' ') {
      setBalasJugador((prev) => [...prev, { id: Date.now(), x: posNave + 13, y: 330 }]);
    }
  }, [posNave]);

  useEffect(() => {
    window.addEventListener('keydown', manejarTeclas);
    return () => window.removeEventListener('keydown', manejarTeclas);
  }, [manejarTeclas]);

  // 3. Movimiento y Descenso en Bloque de los Aliens
  useEffect(() => {
    const velocidadAlien = Math.max(600 - parseInt(nivel) * 80, 200);

    const interval = setInterval(() => {
      setAliens((prevAliens) => {
        const activos = prevAliens.filter((a) => a.activo);
        if (activos.length === 0) return prevAliens;

        // Comprobar si algún alien activo toca los bordes laterales
        const tocaBordeDerecho = activos.some((a) => a.x >= 450 && direccionAlien === 1);
        const tocaBordeIzquierdo = activos.some((a) => a.x <= 15 && direccionAlien === -1);

        if (tocaBordeDerecho || tocaBordeIzquierdo) {
          setDireccionAlien((d) => -d);
          // Invertir dirección y BAJAR 15px toda la matriz
          return prevAliens.map((alien) => ({ ...alien, y: alien.y + 15 }));
        }

        // Avance horizontal
        return prevAliens.map((alien) => ({ ...alien, x: alien.x + 8 * direccionAlien }));
      });
    }, velocidadAlien);

    return () => clearInterval(interval);
  }, [direccionAlien, nivel]);

  // 4. Disparos Aleatorios de los Aliens
  useEffect(() => {
    const interval = setInterval(() => {
      setAliens((prevAliens) => {
        const activos = prevAliens.filter((a) => a.activo);
        if (activos.length > 0) {
          const alienAzar = activos[Math.floor(Math.random() * activos.length)];
          setBalasAliens((prev) => [...prev, { id: Date.now(), x: alienAzar.x + 12, y: alienAzar.y + 20 }]);
        }
        return prevAliens;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // 5. Bucle Principal (Movimiento de disparos y Detección de Colisiones)
  useEffect(() => {
    const interval = setInterval(() => {
      // Avanzar balas del jugador (hacia arriba)
      setBalasJugador((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 12 })).filter((b) => b.y > 0)
      );

      // Avanzar balas de aliens (hacia abajo)
      setBalasAliens((prev) =>
        prev.map((b) => ({ ...b, y: b.y + 8 })).filter((b) => b.y < 380)
      );

      // Colisión: Bala Jugador -> Alien
      setBalasJugador((prevBalas) => {
        let nuevasBalas = [...prevBalas];
        setAliens((prevAliens) =>
          prevAliens.map((alien) => {
            if (!alien.activo) return alien;
            const impacto = nuevasBalas.find(
              (b) => Math.abs(b.x - alien.x) < 22 && Math.abs(b.y - alien.y) < 20
            );
            if (impacto) {
              nuevasBalas = nuevasBalas.filter((b) => b.id !== impacto.id);
              setPuntaje((p) => {
                const nuevoP = p + 100;
                if (onPuntajeChange) onPuntajeChange(nuevoP);
                return nuevoP;
              });
              return { ...alien, activo: false };
            }
            return alien;
          })
        );
        return nuevasBalas;
      });

      // Colisión: Bala Alien -> Jugador
      setBalasAliens((prevBalas) => {
        const impactoJugador = prevBalas.find(
          (b) => Math.abs(b.x - (posNave + 15)) < 20 && Math.abs(b.y - 350) < 15
        );
        if (impactoJugador) {
          setVidas((v) => {
            const nuevasVidas = v - 1;
            if (onVidasChange) onVidasChange(nuevasVidas);
            return nuevasVidas;
          });
          return prevBalas.filter((b) => b.id !== impactoJugador.id);
        }
        return prevBalas;
      });

    }, 40);

    return () => clearInterval(interval);
  }, [posNave, onPuntajeChange, onVidasChange]);

  // 6. Condiciones de Fin de Juego (Derrota o Victoria)
  useEffect(() => {
    const restantes = aliens.filter((a) => a.activo);
    const alienLlegoAlSuelo = aliens.some((a) => a.activo && a.y >= 320);

    if (vidas <= 0 || alienLlegoAlSuelo) {
      onGameOver(puntaje, 'Derrota');
    } else if (aliens.length > 0 && restantes.length === 0) {
      onGameOver(puntaje, 'Victoria');
    }
  }, [aliens, vidas, puntaje, onGameOver]);

  return (
    <div 
      ref={contenedorRef} 
      style={{ 
        width: '500px', 
        height: '380px', 
        background: '#000', 
        position: 'relative', 
        overflow: 'hidden', 
        margin: '0 auto', 
        border: '3px solid #00ff00', 
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
      }}
    >
      {/* Nave Jugador */}
      <ElementoJuego tipo="jugador" x={posNave} y={350} />

      {/* Disparos Jugador */}
      {balasJugador.map((b) => (
        <ElementoJuego key={b.id} tipo="bala" x={b.x} y={b.y} />
      ))}

      {/* Disparos Enemigos */}
      {balasAliens.map((b) => (
        <ElementoJuego key={b.id} tipo="balaAlien" x={b.x} y={b.y} />
      ))}

      {/* Enemigos Aliens */}
      {aliens.filter((a) => a.activo).map((a) => (
        <ElementoJuego key={a.id} tipo="alien" x={a.x} y={a.y} />
      ))}
    </div>
  );
}