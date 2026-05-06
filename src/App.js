import { useEffect, useState } from "react";

  if (!juegoIniciado && !mostrarReglas && !ganaste && !juegoTerminado) {
    return (
      <div className="App">
        <h1>Bienvenido al Juego de Banderas de Franco Zaina</h1>
        <button onClick={() => setMostrarReglas(true)}>
          Empezar Juego
        </button>
      </div>
    );
  }

  if (mostrarReglas) {
    return (
      <div className="App">
        <h1>Reglas del Juego</h1>

        <ul className="reglas">
          <li>✅ Adivinar suma 5 segundos.</li>
          <li>❌ Fallar resta 5 segundos.</li>
          <li>🏆 Ganás al llegar a 10 puntos.</li>
        </ul>

        <button onClick={empezarJuego}>Comenzar</button>
      </div>
    );
  }

  if (ganaste) {
    return (
      <div className="App">
        <h1>¡Ganaste el juego! 🎉</h1>
        <p>Puntaje final: {puntos}</p>
        <button onClick={() => setMostrarReglas(true)}>
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  if (juegoTerminado || timer <= 0) {
    return (
      <div className="App">
        <h1>¡Juego terminado!</h1>
        <p>Puntaje final: {puntos}</p>
        <button onClick={() => setMostrarReglas(true)}>
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>¿De qué país es esta bandera?</h1>

      {pais && <img src={pais.bandera} alt="Bandera" />}

      <div className="opciones">
        {opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => handleRespuesta(opcion.nombre)}
          >
            {opcion.nombre}
          </button>
        ))}
      </div>

      <p>⏱ Tiempo: {timer} segundos</p>
      <p>⭐ Puntos: {puntos}</p>
    </div>
  );


export default App;