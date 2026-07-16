// Referencias principales de la interfaz
const loaderScreen = document.getElementById("loaderScreen");
const introScreen = document.getElementById("introScreen");
const greenHillScreen = document.getElementById("greenHillScreen");
const startButton = document.getElementById("startButton");

// Guardamos los efectos de sonido en un objeto para poder sumar mas despues.
const soundEffects = {
  play: document.getElementById("playSound"),
};

// La musica de fondo vive separada de los efectos porque se reproduce en loop.
const backgroundMusic = document.getElementById("backgroundMusic");

// Assets que deben estar listos antes de mostrar la introduccion
const imageAssets = [
  "assets/logo-sonic.png",
  "assets/anillo.png",
  "assets/sonic.png",
  "assets/green hill.jpg",
];

const audioAssets = [
  soundEffects.play,
  backgroundMusic,
];

const minimumLoaderTime = 3000;
let introTransitionStarted = false;

// Precarga de imagenes
function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

// Reutilizamos enter.mp3 si play.mp3 todavia no existe en la carpeta assets.
function useFallbackAudio(audio) {
  const fallbackSrc = audio.dataset.fallbackSrc;
  const currentSrc = audio.getAttribute("src");

  if (!fallbackSrc || currentSrc === fallbackSrc) {
    return false;
  }

  audio.setAttribute("src", fallbackSrc);
  audio.load();
  return true;
}

// Precarga de audios con salida segura para evitar bloqueos
function preloadAudio(audio) {
  return new Promise((resolve) => {
    let timeoutId;

    const finishLoading = () => {
      clearTimeout(timeoutId);
      audio.removeEventListener("canplaythrough", finishLoading);
      audio.removeEventListener("error", retryWithFallback);
      resolve();
    };

    const retryWithFallback = () => {
      clearTimeout(timeoutId);
      audio.removeEventListener("canplaythrough", finishLoading);
      audio.removeEventListener("error", retryWithFallback);

      if (useFallbackAudio(audio)) {
        preloadAudio(audio).then(resolve);
        return;
      }

      resolve();
    };

    audio.addEventListener("canplaythrough", finishLoading, { once: true });
    audio.addEventListener("error", retryWithFallback, { once: true });
    audio.load();

    timeoutId = setTimeout(finishLoading, 3000);
  });
}

// Transicion entre loader e introduccion
function showIntroScreen() {
  introScreen.classList.remove("is-hidden");
  loaderScreen.classList.add("is-loaded");

  requestAnimationFrame(() => {
    introScreen.classList.add("is-presented");
  });
}

// Inicio del Sprint 2 despues de la precarga
async function initializeSprint() {
  const imagePreloads = imageAssets.map(preloadImage);
  const audioPreloads = audioAssets.map(preloadAudio);
  const minimumLoaderDelay = new Promise((resolve) => {
    setTimeout(resolve, minimumLoaderTime);
  });

  await Promise.all([...imagePreloads, ...audioPreloads, minimumLoaderDelay]);
  showIntroScreen();
}

// Creamos una pausa reutilizable para ordenar animaciones por etapas.
function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// Reproducimos efectos desde una funcion central para no repetir logica.
async function playSoundEffect(soundName) {
  const audio = soundEffects[soundName];

  if (!audio) {
    return;
  }

  audio.currentTime = 0;

  try {
    await audio.play();
  } catch (error) {
    if (useFallbackAudio(audio)) {
      await audio.play().catch(() => {});
    }
  }
}

// Iniciamos la musica desde una funcion para poder reutilizar este control despues.
function startBackgroundMusic() {
  backgroundMusic.volume = 0.55;
  backgroundMusic.play().catch(() => {});
}

// Coordinamos la transicion visual sin agregar todavia logica de juego.
async function runIntroToGreenHillTransition() {
  if (introTransitionStarted) {
    return;
  }

  introTransitionStarted = true;
  startButton.disabled = true;

  playSoundEffect("play");
  startBackgroundMusic();

  greenHillScreen.classList.remove("is-hidden");

  requestAnimationFrame(() => {
    introScreen.classList.add("is-leaving");
    greenHillScreen.classList.add("is-visible");
  });

  await wait(1150);

  introScreen.classList.add("is-hidden");
  greenHillScreen.classList.add("is-sonic-arriving");
}

startButton.addEventListener("click", () => {
  runIntroToGreenHillTransition();
});

initializeSprint();
