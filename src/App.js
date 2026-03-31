import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [pais, setPais] = useState(null);
  const [banderas, setBanderas] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [timer, setTimer] = useState(30);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [ganaste, setGanaste] = useState(false); 

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
    setJuegoTerminado(false);
    setGanaste(false);
    setPuntos(0);
    setTimer(30);
    inicializarJuego();
  };

  if (!juegoIniciado && !ganaste && !juegoTerminado) {
    return (
      <div className="App">
        <h1>Bienvenido al Juego de Banderas de Franco Zaina</h1>
        <h2>¡Hace 10 puntos para ganar!</h2>
        <button onClick={empezarJuego}>Empezar Juego</button>
      </div>
    );
  }

  if (ganaste) {
    return (
      <div className="App">
        <h1>¡Ganaste el juego! 🎉</h1>
        <p>Puntaje final: {puntos}</p>
        <button onClick={empezarJuego}>Jugar de Nuevo</button>
      </div>
    );
  }

  if (juegoTerminado || timer <= 0) {
    return (
      <div className="App">
        <h1>¡Juego terminado!</h1>
        <p>Puntaje final: {puntos}</p>
        <button onClick={empezarJuego}>Jugar de Nuevo</button>
      </div>
    );
  }

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

