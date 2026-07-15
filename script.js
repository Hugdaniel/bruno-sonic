// Referencias principales de la interfaz
const loaderScreen = document.getElementById("loaderScreen");
const introScreen = document.getElementById("introScreen");
const startButton = document.getElementById("startButton");
const enterSound = document.getElementById("enterSound");
const backgroundMusic = document.getElementById("backgroundMusic");

// Assets que deben estar listos antes de mostrar la introduccion
const imageAssets = [
  "assets/logo-sonic.png",
  "assets/anillo.png",
  "assets/sonic.png",
];

const audioAssets = [
  enterSound,
  backgroundMusic,
];

const minimumLoaderTime = 3000;

// Precarga de imagenes
function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

// Precarga de audios con salida segura para evitar bloqueos
function preloadAudio(audio) {
  return new Promise((resolve) => {
    const finishLoading = () => {
      audio.removeEventListener("canplaythrough", finishLoading);
      audio.removeEventListener("error", finishLoading);
      resolve();
    };

    audio.addEventListener("canplaythrough", finishLoading, { once: true });
    audio.addEventListener("error", finishLoading, { once: true });
    audio.load();

    setTimeout(finishLoading, 3000);
  });
}

// Transicion entre loader e introduccion
function showIntroScreen() {
  introScreen.classList.remove("is-hidden");
  loaderScreen.classList.add("is-loaded");
}

// Inicio del Sprint 1 despues de la precarga
async function initializeSprint() {
  const imagePreloads = imageAssets.map(preloadImage);
  const audioPreloads = audioAssets.map(preloadAudio);
  const minimumLoaderDelay = new Promise((resolve) => {
    setTimeout(resolve, minimumLoaderTime);
  });

  await Promise.all([...imagePreloads, ...audioPreloads, minimumLoaderDelay]);
  showIntroScreen();
}

// Audio activado por interaccion del usuario
function startMissionAudio() {
  enterSound.currentTime = 0;
  enterSound.play().catch(() => {});

  backgroundMusic.volume = 0.55;
  backgroundMusic.play().catch(() => {});
}

startButton.addEventListener("click", startMissionAudio);
initializeSprint();
