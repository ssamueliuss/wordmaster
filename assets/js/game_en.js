const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// VARIABLES DEL JUEGO
let words = [];
let score = 0;
let gameOver = false;
let playerInput = ''; // ENTRADA DEL JUGADOR

let wordSpeed = 1; // VELOCIDAD DE LAS PALABRAS
let wordInterval = 4000; // INTERVALO DE GENERACIÓN DE PALABRAS (4 segundos)

let particles = []; // ARRAY PARA LAS PARTÍCULAS

let animationTime = 0; // Variable para rastrear el tiempo de animación

const successSound = new Audio('assets/sounds/success.mp3');
const levelUpSound = new Audio('assets/sounds/new_level.mp3');

function generateWord() {
    if (wordList.length === 0 && hardWordList.length === 0) return;

    // DETERMINA SI LA PALABRA ES DIFÍCIL O NORMAL
    const isHardWord = Math.random() < 0.05;

    let word;
    if (isHardWord && hardWordList.length > 0) {
        word = hardWordList[Math.floor(Math.random() * hardWordList.length)];
    } else {
        word = wordList[Math.floor(Math.random() * wordList.length)];
    }

    const x = Math.random() * (canvas.width - 100);
    const y = 0;
    words.push({ word, x, y, isHard: isHardWord }); // AGREGA LA PALABRA Y SU TIPO
}

let wordGenerationInterval = setInterval(() => {
    if (!isPaused && !gameOver) {
        generateWord();
    }
}, wordInterval);

const rankData = [
    { minScore: 0, message: "You're just starting. Keep practicing!", percentage: 0 },
    { minScore: 250, message: "You're above 50% of players.", percentage: 50 },
    { minScore: 450, message: "You're above 75% of players.", percentage: 75 },
    { minScore: 850, message: "You're above 90% of players.", percentage: 90 },
    { minScore: 1000, message: "You're above 99% of players. You're a master!", percentage: 99 }
];

let wordList = []; // PALABRAS NORMALES
let hardWordList = []; // PALABRAS DIFÍCILES

// FUNCION PARA CARGAR PALABRAS DESDE ARCHIVOS
async function loadWords() {
    try {
        // Cargar palabras normales
        const responseNormal = await fetch('assets/data/words_en.txt');
        const textNormal = await responseNormal.text();
        wordList = textNormal.split('\n').map(word => word.trim().toUpperCase());

        // Cargar palabras difíciles
        const responseHard = await fetch('assets/data/word_hard_en.txt');
        const textHard = await responseHard.text();
        hardWordList = textHard.split('\n').map(word => word.trim().toUpperCase());

        console.log('Palabras normales cargadas:', wordList);
        console.log('Palabras difíciles cargadas:', hardWordList);
    } catch (error) {
        console.error('Error al cargar las palabras:', error);
    }
}

// LLAMAR A LA FUNCIÓN PARA CARGAR LAS PALABRAS AL INICIO
loadWords();

//  CAMPO OCULTO PARA ENTRADA DEL JUGADOR
const hiddenInput = document.getElementById('hidden-input');

// ENFOQUE AL CAMPO OCULTO
hiddenInput.focus();

// VALIDACIÓN DE ENTRADA
document.addEventListener('click', () => {
    hiddenInput.focus();
});


function updateRank(score) {
    const rank = rankData.find((r, index) => {
        const nextRank = rankData[index + 1];
        return score >= r.minScore && (!nextRank || score < nextRank.minScore);
    });

    // BARRA DE PROGRESO
    const rankMessage = document.getElementById('rank-message');
    const progressBar = document.getElementById('progress-bar');

    if (rank) {
        rankMessage.textContent = rank.message;
        progressBar.style.width = `${rank.percentage}%`;
    }
}

// PALABRAS EN EL CANVAS
function drawWords() {
    animationTime += 0.05; // TIEMPO DE ANIMACIÓN

    words.forEach(({ word, x, y, isHard }) => {
        if (isHard) {
            // EFECTO DE OSCILACIÓN PARA PALABRAS DIFÍCILES
            const scale = 1 + 0.1 * Math.sin(animationTime); // OSCILACIÓN DE ESCALA
            ctx.save(); 
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 24px Arial';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeText(word, 0, 0);
            ctx.fillText(word, 0, 0);
            ctx.restore(); 
        } else {
            
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.fillText(word, x, y);
        }
    });

    // ESCRIBIENDO EN EL CANVAS
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Typing: ${playerInput}`, 10, canvas.height - 20);
}

function increaseDifficulty() {
    if (score % 100 === 0) { // CADA 100 PUNTOS
        wordSpeed += 0.5; // AUMENTAR VELOCIDAD
        wordInterval = Math.max(500, wordInterval - 200); // REDUCE EL INTERVALO MÍNIMO A 500ms
        clearInterval(wordGenerationInterval); // DETENER EL INTERVALO ANTERIOR
        wordGenerationInterval = setInterval(() => {
            if (!isPaused && !gameOver) {
                generateWord();
            }
        }, wordInterval); // CREAR UN NUEVO INTERVALO

        // REPRODUCIR SONIDO DE NIVEL SUPERIOR
        const soundClone = levelUpSound.cloneNode();
        soundClone.play();
    }
}

function updateWords() {
    words.forEach(word => {
        word.y += wordSpeed; // Velocidad de las palabras
        if (word.y > canvas.height) {
            if (!word.isHard) {
                gameOver = true; // Solo termina el juego si la palabra no es difícil
            }
        }
    });
}
function createParticles(x, y) {
    const particleCount = 20; // NUMERO DE PARTÍCULAS A CREAR
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 4, 
            dy: (Math.random() - 0.5) * 4, 
            size: Math.random() * 3 + 1, 
            life: 50 
        });
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = '#fff'; //  COLOR DE LAS PARTÍCULAS
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateParticles() {
    particles = particles.filter(particle => particle.life > 0); // ELIMINA PARTÍCULAS MUERTAS
    particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life -= 1; // VIDA DE VIDA DE LAS PARTÍCULAS
    });
}



document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (e.key === 'Backspace') {
        playerInput = playerInput.slice(0, -1);
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        playerInput += e.key.toUpperCase();
    }

    hiddenInput.addEventListener('input', (e) => {
        playerInput = e.target.value.toUpperCase(); // CONVERTIR A MAYÚSCULAS
    
        // VERIFICAR SI LA PALABRA ES CORRECTA
        words = words.filter(wordObj => {
            if (wordObj.word === playerInput) {
                // VERIFICACIONES DE PUNTAJE DE PALABRA
                score += wordObj.isHard ? 50 : 10;
                document.getElementById('score').textContent = score;
    
                // REPRODUCIR SONIDO DE ÉXITO
                const soundClone = successSound.cloneNode();
                soundClone.play();
    
                createParticles(wordObj.x, wordObj.y); // GENERAR PARTICULAS
                playerInput = '';
                hiddenInput.value = '';
                increaseDifficulty();
                updateRank(score);
                return false;
            }
            return true;
        });
    });
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

// DESHABILITAR INGRESO A LA CONSOLA DE INSPECCIÓN
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.shiftKey && e.key === 'I'))) {
        e.preventDefault();
    }
});

function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const menuButton = document.getElementById('menu-button'); // VOLVER AL MENÚ

    // MODAL
    modal.style.display = 'flex';
    finalScore.textContent = score;

    // BOTÓN REINICIAR
    restartButton.addEventListener('click', () => {
        location.reload(); // RECARGA DE PÁGINA
    });

    // VOLVER AL MENÚ
    menuButton.addEventListener('click', () => {
        window.location.href = 'index_en.html'; // REDIRECCIONAR AL MENÚ PRINCIPAL
    });
}

let isPaused = false; // VARIABLE PARA PAUSAR EL JUEGO

// FUNCIÓN PARA PAUSAR EL JUEGO
function pauseGame() {
    isPaused = true;
    const modal = document.getElementById('pause-modal');
    modal.style.display = 'flex'; // MODAL DE PAUSA
}

// FUNCION PARA REANUDAR EL JUEGO
function resumeGame() {
    isPaused = false;
    const modal = document.getElementById('pause-modal');
    modal.style.display = 'none'; // QUITAR MODAL DE PAUSA
}

// MANEJO DE EVENTOS PARA PAUSAR EL JUEGO
document.getElementById('pause-button').addEventListener('click', pauseGame);

// MANEJO DE EVENTOS PARA REANUDAR EL JUEGO
document.getElementById('resume-button').addEventListener('click', resumeGame);
document.getElementById('restart-button-pause').addEventListener('click', () => {
    location.reload(); // RECARGA DE PÁGINA
});
document.getElementById('menu-button-pause').addEventListener('click', () => {
    window.location.href = 'index_en.html'; // REDIRIGER AL MENÚ PRINCIPAL
});

function gameLoop() {
    if (gameOver) {
        showGameOverModal(); // MUESTRA EL MODAL DE GAME OVER
        return;
    }

    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // LIMPIAR EL CANVAS
        drawWords();
        updateWords();
        drawParticles(); // DIBUJAR PARTICULAS
        updateParticles(); // ACTUALIZAR PARTICULAS
    }

    requestAnimationFrame(gameLoop);
}

// GENERAR PALABRAS SOLO SI EL JUEGO NO ESTÁ PAUSADO Y NO HA TERMINADO
setInterval(() => {
    if (!isPaused && !gameOver) {
        generateWord();
    }
}, 2000);

// INICIAR EL JUEGO
gameLoop();