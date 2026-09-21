import React, { useState, useEffect, useRef, useCallback } from 'react';
import ElementoJuego from './ElementoJuego';

export default function Tablero({ nivel, onGameOver, onPuntajeChange, onVidasChange, claveReinicio }) {
  // Renderizado Visual
  const [posNave, setPosNave] = useState(234);
  const [balasJugadorVis, setBalasJugadorVis] = useState([]);
  const [balasAliensVis, setBalasAliensVis] = useState([]);
  const [aliensVis, setAliensVis] = useState([]);
  const [bunkersVis, setBunkersVis] = useState([]);
  const [invulnerable, setInvulnerable] = useState(false);

  // Estado de juego reactivo
  const [puntaje, setPuntaje] = useState(0);
  const [vidas, setVidas] = useState(3);

  // Referencias para la física en tiempo real (evita problemas de asincronía en React)
  const estadoRef = useRef({
    naveX: 234,
    balaJugador: null,
    balasAliens: [],
    aliens: [],
    bunkers: [],
    dirAlien: 1,
    puntaje: 0,
    vidas: 3,
    invulnerable: false,
    gameOver: false
  });

  // 1. Configuración de Cantidad de Enemigos y Velocidades por Nivel
  useEffect(() => {
    const numNivel = parseInt(nivel || 1, 10);
    let totalEnemigos = 5;

    // Ajuste de cantidad de enemigos por nivel
    if (numNivel === 1) totalEnemigos = 5;
    else if (numNivel === 2) totalEnemigos = 10;
    else if (numNivel === 3) totalEnemigos = 15;
    else totalEnemigos = Math.min(15 + (numNivel - 3) * 5, 25);

    // Generación de matriz de enemigos en cuadrícula
    const nuevosAliens = [];
    const columnas = 5; // 5 columnas estándar
    for (let i = 0; i < totalEnemigos; i++) {
      const fila = Math.floor(i / columnas);
      const col = i % columnas;
      nuevosAliens.push({
        id: `alien-${i}`,
        x: 60 + col * 75,
        y: 30 + fila * 35,
        w: 28,
        h: 20,
        subtipo: fila,
        activo: true
      });
    }

    // Configuración de Búnkeres defensivos
    const nuevosBunkers = [
      { id: 'b1', x: 80, y: 285, w: 36, h: 24, vida: 4 },
      { id: 'b2', x: 230, y: 285, w: 36, h: 24, vida: 4 },
      { id: 'b3', x: 380, y: 285, w: 36, h: 24, vida: 4 }
    ];

    estadoRef.current = {
      naveX: 234,
      balaJugador: null,
      balasAliens: [],
      aliens: nuevosAliens,
      bunkers: nuevosBunkers,
      dirAlien: 1,
      puntaje: 0,
      vidas: 3,
      invulnerable: false,
      gameOver: false
    };

    setPosNave(234);
    setAliensVis(nuevosAliens);
    setBunkersVis(nuevosBunkers);
    setBalasJugadorVis([]);
    setBalasAliensVis([]);
    setPuntaje(0);
    setVidas(3);
    setInvulnerable(false);
  }, [nivel, claveReinicio]);

  // 2. Controles de Teclado del Jugador
  const manejarTeclas = useCallback((e) => {
    if (estadoRef.current.gameOver) return;

    if (e.key === 'ArrowLeft') {
      estadoRef.current.naveX = Math.max(estadoRef.current.naveX - 16, 10);
      setPosNave(estadoRef.current.naveX);
    } else if (e.key === 'ArrowRight') {
      estadoRef.current.naveX = Math.min(estadoRef.current.naveX + 16, 458);
      setPosNave(estadoRef.current.naveX);
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      // Solo permite 1 disparo en pantalla a la vez (Mecánica Space Invaders)
      if (!estadoRef.current.balaJugador) {
        estadoRef.current.balaJugador = {
          id: Date.now(),
          x: estadoRef.current.naveX + 14,
          y: 334,
          w: 4,
          h: 12
        };
        setBalasJugadorVis([estadoRef.current.balaJugador]);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', manejarTeclas);
    return () => window.removeEventListener('keydown', manejarTeclas);
  }, [manejarTeclas]);

  // 3. Movimiento de Enemigos (Velocidad Progresiva por Nivel)
  useEffect(() => {
    const numNivel = parseInt(nivel || 1, 10);
    
    // Nivel 1: 450ms (lento), Nivel 2: 250ms (rápido), Nivel 3: 120ms (muy rápido)
    let vel = 450;
    if (numNivel === 2) vel = 250;
    else if (numNivel >= 3) vel = Math.max(120 - (numNivel - 3) * 20, 60);

    const interval = setInterval(() => {
      if (estadoRef.current.gameOver) return;

      const { aliens, dirAlien } = estadoRef.current;
      const activos = aliens.filter((a) => a.activo);
      if (activos.length === 0) return;

      const tocaDerecha = activos.some((a) => a.x >= 452 && dirAlien === 1);
      const tocaIzquierda = activos.some((a) => a.x <= 12 && dirAlien === -1);

      if (tocaDerecha || tocaIzquierda) {
        estadoRef.current.dirAlien = -dirAlien;
        estadoRef.current.aliens = aliens.map((a) => ({ ...a, y: a.y + 16 }));
      } else {
        estadoRef.current.aliens = aliens.map((a) => ({ ...a, x: a.x + 10 * dirAlien }));
      }

      setAliensVis([...estadoRef.current.aliens]);
    }, vel);

    return () => clearInterval(interval);
  }, [nivel]);

  // 4. Cadencia de Disparo Enemigo (Más agresiva según el Nivel)
  useEffect(() => {
    const numNivel = parseInt(nivel || 1, 10);
    // Disparos más frecuentes conforme subes de nivel
    const cadencia = Math.max(1600 - (numNivel - 1) * 350, 600);

    const interval = setInterval(() => {
      if (estadoRef.current.gameOver) return;

      const activos = estadoRef.current.aliens.filter((a) => a.activo);
      if (activos.length > 0) {
        const azar = activos[Math.floor(Math.random() * activos.length)];
        const nuevaBala = { id: Date.now() + Math.random(), x: azar.x + 12, y: azar.y + 20, w: 4, h: 12 };
        estadoRef.current.balasAliens.push(nuevaBala);
        setBalasAliensVis([...estadoRef.current.balasAliens]);
      }
    }, cadencia);

    return () => clearInterval(interval);
  }, [nivel]);

  // 5. Motor de Física y Colisiones
  useEffect(() => {
    const interval = setInterval(() => {
      if (estadoRef.current.gameOver) return;

      const est = estadoRef.current;

      // A. Proyectil Jugador
      if (est.balaJugador) {
        est.balaJugador.y -= 12;

        if (est.balaJugador.y <= 0) {
          est.balaJugador = null;
        } else {
          const b = est.balaJugador;

          // Impacto Jugador -> Enemigo (Mata al instante con 1 solo tiro)
          let impactoAlien = false;
          for (let i = 0; i < est.aliens.length; i++) {
            const a = est.aliens[i];
            if (a.activo) {
              if (
                b.x + b.w >= a.x &&
                b.x <= a.x + a.w &&
                b.y + b.h >= a.y &&
                b.y <= a.y + a.h
              ) {
                a.activo = false;
                impactoAlien = true;
                est.puntaje += 100;
                setPuntaje(est.puntaje);
                if (onPuntajeChange) onPuntajeChange(est.puntaje);
                break;
              }
            }
          }

          if (impactoAlien) {
            est.balaJugador = null;
          } else {
            // Impacto Jugador -> Búnker
            for (let i = 0; i < est.bunkers.length; i++) {
              const bunk = est.bunkers[i];
              if (bunk.vida > 0) {
                if (
                  b.x + b.w >= bunk.x &&
                  b.x <= bunk.x + bunk.w &&
                  b.y + b.h >= bunk.y &&
                  b.y <= bunk.y + bunk.h
                ) {
                  bunk.vida -= 1;
                  est.balaJugador = null;
                  break;
                }
              }
            }
          }
        }
      }

      // B. Proyectiles Enemigos
      for (let i = est.balasAliens.length - 1; i >= 0; i--) {
        const ba = est.balasAliens[i];
        ba.y += 7;

        if (ba.y >= 380) {
          est.balasAliens.splice(i, 1);
          continue;
        }

        // Impacto Enemigo -> Búnker
        let impactoBunk = false;
        for (let j = 0; j < est.bunkers.length; j++) {
          const bunk = est.bunkers[j];
          if (bunk.vida > 0) {
            if (
              ba.x + ba.w >= bunk.x &&
              ba.x <= bunk.x + bunk.w &&
              ba.y + ba.h >= bunk.y &&
              ba.y <= bunk.y + bunk.h
            ) {
              bunk.vida -= 1;
              impactoBunk = true;
              break;
            }
          }
        }

        if (impactoBunk) {
          est.balasAliens.splice(i, 1);
          continue;
        }

        // Impacto Enemigo -> Jugador (Control estricto de vidas)
        if (!est.invulnerable) {
          if (
            ba.x + ba.w >= est.naveX &&
            ba.x <= est.naveX + 30 &&
            ba.y + ba.h >= 350 &&
            ba.y <= 370
          ) {
            est.balasAliens.splice(i, 1);
            est.vidas -= 1;
            setVidas(est.vidas);
            if (onVidasChange) onVidasChange(est.vidas);

            est.invulnerable = true;
            setInvulnerable(true);
            est.naveX = 234;
            setPosNave(234);

            setTimeout(() => {
              est.invulnerable = false;
              setInvulnerable(false);
            }, 1500);
          }
        }
      }

      // Sincronizar UI
      setBalasJugadorVis(est.balaJugador ? [est.balaJugador] : []);
      setBalasAliensVis([...est.balasAliens]);
      setAliensVis([...est.aliens]);
      setBunkersVis([...est.bunkers]);

      // Evaluación de Fin de Juego
      const restantes = est.aliens.filter((a) => a.activo);
      const llegoAlSuelo = est.aliens.some((a) => a.activo && a.y >= 270);

      if (!est.gameOver) {
        if (est.vidas <= 0 || llegoAlSuelo) {
          est.gameOver = true;
          onGameOver(est.puntaje, 'Derrota');
        } else if (est.aliens.length > 0 && restantes.length === 0) {
          est.gameOver = true;
          onGameOver(est.puntaje, 'Victoria');
        }
      }

    }, 30);

    return () => clearInterval(interval);
  }, [onGameOver, onPuntajeChange, onVidasChange]);

  return (
    <div className="crt-screen" style={{
      width: '500px',
      height: '380px',
      background: '#000000',
      position: 'relative',
      margin: '0 auto',
      border: '4px solid #00ff00',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)',
      overflow: 'hidden'
    }}>
      <div style={{ opacity: invulnerable ? 0.4 : 1 }}>
        <ElementoJuego tipo="jugador" x={posNave} y={350} />
      </div>

      {balasJugadorVis.map((b) => (
        <ElementoJuego key={b.id} tipo="bala" x={b.x} y={b.y} />
      ))}

      {balasAliensVis.map((b) => (
        <ElementoJuego key={b.id} tipo="balaAlien" x={b.x} y={b.y} />
      ))}

      {bunkersVis.filter((b) => b.vida > 0).map((b) => (
        <ElementoJuego key={b.id} tipo="bunker" x={b.x} y={b.y} vidaBunker={b.vida} />
      ))}

      {aliensVis.filter((a) => a.activo).map((a) => (
        <ElementoJuego key={a.id} tipo="alien" x={a.x} y={a.y} subtipo={a.subtipo} />
      ))}
    </div>
  );
}