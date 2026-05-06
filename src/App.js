import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  // --- ESTADOS ---
  const [pais, setPais] = useState(null);
  const [banderas, setBanderas] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [timer, setTimer] = useState(30);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [ganaste, setGanaste] = useState(false); 
  // ¡Aquí agregamos tu estado para las reglas!
  const [mostrarReglas, setMostrarReglas] = useState(false); 

  // --- EFECTOS (API y Timer) ---
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=name,translations,flags")
    .then((res) => {
        const paisesTraducidos = res.data.map((pais) => ({           
            nombre: pais.translations.spa?.common || pais.name.common,
            bandera: pais.flags.png,
        }));
        setBanderas(paisesTraducidos);
    })
    .catch((err) => console.error(err));
  }, []);

  const inicializarJuego = () => {
    if (banderas.length === 0) return;

    const randomIndex = Math.floor(Math.random() * banderas.length);
    const paisSeleccionado = banderas[randomIndex];
    setPais(paisSeleccionado);

    const opcionesRandom = [...banderas]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    opcionesRandom.push(paisSeleccionado);
    opcionesRandom.sort(() => 0.5 - Math.random());

    setOpciones(opcionesRandom);
  };

  useEffect(() => {
    if (!juegoIniciado || timer <= 0 || juegoTerminado || ganaste) return;

    const intervalo = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [juegoIniciado, timer, juegoTerminado, ganaste]);

  useEffect(() => {
    if (puntos >= 10) {
      setGanaste(true);
      setJuegoIniciado(false);
    }
  }, [puntos]); 

  // --- FUNCIONES DEL JUEGO ---
  const handleRespuesta = (respuesta) => {
    if (respuesta === pais.nombre) {
      setPuntos((prev) => prev + 1);
      setTimer((prev) => prev + 5);
    } else {
      setTimer((prev) => (prev > 5 ? prev - 5 : 0));
    }
    inicializarJuego();
  };

  const empezarJuego = () => {
    setJuegoIniciado(true);
    setMostrarReglas(false); // Ocultamos las reglas al empezar
    setJuegoTerminado(false);
    setGanaste(false);
    setPuntos(0);
    setTimer(30);
    inicializarJuego();
  };

  // --- RENDERIZADOS CONDICIONALES (Vistas) ---

  // 1. Pantalla de inicio
  if (!juegoIniciado && !mostrarReglas && !ganaste && !juegoTerminado) {
    return (
      <div className="App">
        <h1>Bienvenido al Juego de Banderas de Franco Zaina</h1>
        {/* Cambiamos esto para que vaya a las reglas primero */}
        <button onClick={() => setMostrarReglas(true)}>Empezar Juego</button>
      </div>
    );
  }

  // 2. Pantalla de reglas
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

  // 3. Pantalla de victoria
  if (ganaste) {
    return (
      <div className="App">
        <h1>¡Ganaste el juego! 🎉</h1>
        <p>Puntaje final: {puntos}</p>
        <button onClick={() => setMostrarReglas(true)}>Jugar de Nuevo</button>
      </div>
    );
  }

  // 4. Pantalla de derrota (tiempo terminado)
  if (juegoTerminado || timer <= 0) {
    return (
      <div className="App">
        <h1>¡Juego terminado!</h1>
        <p>Puntaje final: {puntos}</p>
        <button onClick={() => setMostrarReglas(true)}>Jugar de Nuevo</button>
      </div>
    );
  }

  // 5. Pantalla principal del juego (el quiz)
  return (
    <div className="App">
      <h1>¿De qué país es esta bandera?</h1>
      {pais && <img src={pais.bandera} alt="Bandera" width="300" />}
      <div className="opciones">
        {opciones.map((opcion, index) => (
          <button key={index} onClick={() => handleRespuesta(opcion.nombre)}>
            {opcion.nombre}
          </button>
        ))}
      </div>
      <p>Tiempo: {timer} segundos</p>
      <p>Puntos: {puntos}</p>
    </div>
  );
}

export default App;