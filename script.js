// -----------------------------
// INTERFACE REFERENCES
// -----------------------------
// Referencias principales de la interfaz
const loaderScreen = document.getElementById("loaderScreen");
const introScreen = document.getElementById("introScreen");
const greenHillScreen = document.getElementById("greenHillScreen");
const startButton = document.getElementById("startButton");
const missionProgress = document.getElementById("missionProgress");
const missionObjective = document.getElementById("missionObjective");
const countdown = document.getElementById("countdown");
const gameRing = document.getElementById("gameRing");
const ringCount = document.getElementById("ringCount");
const progressFill = document.getElementById("progressFill");
const victoryScreen = document.getElementById("victoryScreen");
const invitationScreen =
document.getElementById("invitationScreen");

const showInvitationButton =
document.getElementById("showInvitationButton");

const attendanceSlider =
document.getElementById("attendanceSlider");

const attendanceButton =
document.getElementById("attendanceButton");

const closeAttendance =
document.getElementById("closeAttendance");

const adultMinus = document.getElementById("adultMinus");
const adultPlus = document.getElementById("adultPlus");
const adultValue = document.getElementById("adultValue");

const childMinus = document.getElementById("childMinus");
const childPlus = document.getElementById("childPlus");
const childValue = document.getElementById("childValue");
const guestName = document.getElementById("guestName");

const nameError = document.getElementById("nameError");

const attendanceError =
document.getElementById("attendanceError");

const sendButton =
document.querySelector(".send-button");

let adults = 2;
let children = 1;

const SHEET_API_URL =
"https://rsvp-appi.85hbdaniel.workers.dev/";

// Guardamos los efectos de sonido en un objeto para poder sumar mas despues.
const soundEffects = {
  play: document.getElementById("playSound"),
  coin: document.getElementById("coinSound"),
};

// -----------------------------
// GAME STATE
// -----------------------------
let gameFinished = false;

const TOTAL_RINGS = 15;
let collectedRings = 0;

let ringAnimation = null;
const SAFE_MARGIN = 40; // Margen seguro para que el anillo no se salga de la pantalla

// -----------------------------
// UI UPDATES
// -----------------------------
function updateProgress() {
  ringCount.textContent = collectedRings;

  const progressPercentage = (collectedRings / TOTAL_RINGS) * 100;

  progressFill.style.width = `${progressPercentage}%`;
}

function showMissionObjective() {
  missionObjective.classList.remove("is-hidden");
  missionObjective.classList.add("is-visible");
}

// -----------------------------
// GAME FLOW: COUNTDOWN & RING SPAWN
// -----------------------------
async function startCountdown() {
  missionObjective.classList.remove("is-visible");
  missionObjective.classList.add("is-hidden");

  await wait(500);

  const countdownValues = ["3", "2", "1", ];

  for (const value of countdownValues) {
    countdown.textContent = value;

    countdown.classList.remove("is-visible");

    // Permite reiniciar la animación cada vez que cambia el número.
    void countdown.offsetWidth;

    countdown.classList.add("is-visible");

    // await wait(value === "¡YA!" ? 500 : 800);
    await wait(800);
  }

  countdown.classList.remove("is-visible");
  countdown.textContent = "";

  await wait(150);

  showFirstRing();
}

function showFirstRing() {
  if(gameFinished) {
    return;
  }

  gameRing.classList.remove("is-hidden");
  gameRing.classList.remove("is-caught");

  // prueba de animación con clase, pero no funciona bien en todos los navegadores
  gameRing.style.left = "150px";
gameRing.style.top = "50px";
gameRing.style.opacity = "1";
gameRing.style.visibility = "visible";
gameRing.style.display = "block";




  // Posición horizontal aleatoria
  const maxX = window.innerWidth - gameRing.offsetWidth - SAFE_MARGIN;

  const randomX =
    SAFE_MARGIN + Math.random() * (maxX - SAFE_MARGIN);

  gameRing.style.left = `${randomX}px`;

  // Arranca arriba
  gameRing.style.top = "-90px";

  startRingFall();
}

function startRingFall() {

  let y = -90;

  let speed = 3;

if (collectedRings >= 5)
    speed = 3.2;

if (collectedRings >= 10)
    speed = 3.7;

  cancelAnimationFrame(ringAnimation);

  function animate() {

    y += speed;

    gameRing.style.top = `${y}px`;

    if (y > window.innerHeight) {
      if(gameFinished){
    return;
  }

      showFirstRing();

      return;
    }

    ringAnimation = requestAnimationFrame(animate);

  }

  animate();

}

// -----------------------------
// GAME ACTIONS
// -----------------------------
// Maneja la recolección del anillo cuando el jugador hace click
async function collectRing() {
    if (gameFinished) {
      return;
    }
    if (gameRing.classList.contains("is-caught")) {
      return;
    }

   
    const flyingRing = createFlyingRing();

    gameRing.classList.add("is-caught");

    await playSoundEffect("coin");

    await wait(450);

    collectedRings += 1;

    updateProgress();

    if (collectedRings >= TOTAL_RINGS) {
      gameFinished = true;
          await wait(300);

          cancelAnimationFrame(ringAnimation);

      finishGame();

      launchConfetti();
      return;
    }

    
    showFirstRing();
  }

  function launchConfetti() {

  confetti({
    particleCount: 150,
    spread: 80,
    origin: {
      y: 0.6
    }
  });

}

// Muestra la pantalla de victoria y reinicia el juego después de un tiempo
function finishGame() {

  cancelAnimationFrame(ringAnimation);

  gameRing.classList.add("is-hidden");

  victoryScreen.classList.remove("is-hidden");

  requestAnimationFrame(() => {
    victoryScreen.classList.add("is-visible");
  });

}
gameRing.addEventListener("click", collectRing);

// -----------------------------
// ASSETS & AUDIO
// -----------------------------
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
// -----------------------------
// PRELOADING
// -----------------------------
function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

function updateAttendanceCounters(){

  adultValue.textContent = adults;
  childValue.textContent = children;

}

// slider de asistencia
// Attendance slider
function openAttendance(){

  attendanceSlider.classList.add("is-open");

}

function closeAttendancePanel(){

  attendanceSlider.classList.remove("is-open");

}

function showFieldError(element,message){

    element.textContent=message;

    element.classList.add("is-visible");

}
function clearFieldError(element){

    element.textContent="";

    element.classList.remove("is-visible");

}

function validateAttendance(){

    let valid=true;

    clearFieldError(nameError);
    clearFieldError(attendanceError);

    guestName.classList.remove("input-error");

    const name=guestName.value.trim();

    if(name===""){

        showFieldError(
            nameError,
            "Escribí tu nombre."
        );

        guestName.classList.add("input-error");

        guestName.focus();

        valid=false;

    }

    if(adults+children===0){

        showFieldError(
            attendanceError,
            "Debe asistir al menos una persona."
        );

        valid=false;

    }

    return valid;

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
// -----------------------------
// INTRO / TRANSITIONS
// -----------------------------
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
// -----------------------------
// UTILITIES
// -----------------------------
function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// Reproducimos efectos desde una funcion central para no repetir logica.
// -----------------------------
// AUDIO HELPERS
// -----------------------------
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
// -----------------------------
// INTRO TO GAME TRANSITION
// -----------------------------
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

await wait(1400);

greenHillScreen.classList.add("is-mission-starting");

showMissionObjective();

await wait(2200);

startCountdown();
}

startButton.addEventListener("click", () => {
  runIntroToGreenHillTransition();
});

initializeSprint();


// -----------------------------
// PROGRESS BAR & ANIMATIONS
// -----------------------------
// anillo clon
function createFlyingRing() {

  const ringRect = gameRing.getBoundingClientRect();

  const flyingRing = document.createElement("img");

  flyingRing.src = "assets/anillo.png";
  flyingRing.className = "flying-ring";

  flyingRing.style.left = `${ringRect.left}px`;
  flyingRing.style.top = `${ringRect.top}px`;

  document.body.appendChild(flyingRing);

  const target = getCounterTarget();

flyingRing.animate(
    [
        {
            transform: "translate(0,0) scale(1) rotate(0deg)",
            opacity: 1
        },
        {
            transform: `translate(${target.x - ringRect.left}px, ${target.y - ringRect.top}px)
                        scale(.35)
                        rotate(720deg)`,
            opacity: .2
        }
    ],
    {
        duration: 450,
        easing: "ease-in-out",
        fill: "forwards"
    }
);

setTimeout(() => {
    flyingRing.remove();
}, 450);

  return flyingRing;
}

function pressAnimation(button){

    button.classList.add("is-pressed");

    setTimeout(() => {

        button.classList.remove("is-pressed");

    },120);

}

// animacion de absorcion del anillo
function getCounterTarget() {

    const rect = ringCount.getBoundingClientRect();

    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };

}

async function sendAttendance(){

    const data = {
        nombre: guestName.value.trim(),
        adultos: adults,
        ninos: children
    };

    console.log("Enviando datos de asistencia:", data);

    const response = await fetch(SHEET_API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.text();

    console.log("Respuesta servidor:", result);

    return result;

}
// -----------------------------
// UI EVENTS
// -----------------------------
showInvitationButton.addEventListener("click", () => {

    victoryScreen.classList.remove("is-visible");

    setTimeout(() => {

        victoryScreen.classList.add("is-hidden");

        invitationScreen.classList.remove("is-hidden");

        requestAnimationFrame(() => {

            invitationScreen.classList.add("is-visible");

        });

    },300);

});

// eventos de asistencia
attendanceButton.addEventListener(
  "click",
  openAttendance
);

closeAttendance.addEventListener(
  "click",
  closeAttendancePanel
);



adultMinus.addEventListener("click", () => {

  if(adults > 0){

    adults--;

    updateAttendanceCounters();

  }

});

childPlus.addEventListener("click", () => {

  children++;

  updateAttendanceCounters();

});

childMinus.addEventListener("click", () => {

  if(children > 0){

    children--;

    updateAttendanceCounters();

  }

});

adultPlus.addEventListener("click", () => {

  adults++;

  updateAttendanceCounters();

  pressAnimation(adultPlus);
  popValue(adultValue);

});



guestName.addEventListener("input",()=>{

    guestName.classList.remove("input-error");

    clearFieldError(nameError);

});

sendButton.addEventListener("click",async()=>{

    if(!validateAttendance()){
        return;
    }

    sendButton.disabled=true;
    sendButton.textContent="ENVIANDO...";

    await sendAttendance();
    sendButton.textContent="✔ CONFIRMADO";

    sendButton.disabled=false;  

    function showConfirmationMessage(){

    const message = document.createElement("div");

    message.className = "confirmation-message";

    message.innerHTML = `
        <div class="confirmation-card">
            <div class="confirmation-ring">💍</div>

            <h3>¡MISIÓN COMPLETADA!</h3>

            <p>
                Tu asistencia fue confirmada.<br>
                Sonic te espera para la aventura 🚀
            </p>

            <button class="close-confirmation">
                CONTINUAR
            </button>
        </div>
    `;


    document.body.appendChild(message);


    setTimeout(()=>{

        message.classList.add("is-visible");

    },50);


    message.querySelector(".close-confirmation")
    .addEventListener("click",()=>{

        message.remove();

    });

}

  // Show confirmation after successful send
  showConfirmationMessage();


}) ;