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

let wordGenerationInterval = setInterval(() => {
    if (!isPaused && !gameOver) {
        generateWord();
    }
}, wordInterval);

const rankData = [
    { minScore: 0, message: "Estás comenzando. ¡Sigue practicando!", percentage: 0 },
    { minScore: 250, message: "Estás por encima del 50% de los jugadores.", percentage: 50 },
    { minScore: 450, message: "Estás por encima del 75% de los jugadores.", percentage: 75 },
    { minScore: 850, message: "Estás por encima del 90% de los jugadores.", percentage: 90 },
    { minScore: 1000, message: "Estás por encima del 99% de los jugadores. ¡Eres un maestro!", percentage: 99 }
];

//  CAMPO OCULTO PARA ENTRADA DEL JUGADOR
const hiddenInput = document.getElementById('hidden-input');

// ENFOQUE AL CAMPO OCULTO
hiddenInput.focus();

// VALIDACIÓN DE ENTRADA
document.addEventListener('click', () => {
    hiddenInput.focus();
});

// ARRAY DE PALABRAS
const wordList = ['AMOR', 'CASA', 'PERRO', 'FELIZ', 'LIBRO', 'SOL', 'FLOR', 'COMIDA', 'AGUA'];
function generateWord() {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const x = Math.random() * (canvas.width - 100);
    const y = 0;
    words.push({ word, x, y });
}

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
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    words.forEach(({ word, x, y }) => {
        ctx.fillText(word, x, y);
    });

    // ESCRITURA DEL JUGADOR
    ctx.fillStyle = 'fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Escribiendo: ${playerInput}`, 10, canvas.height - 20);
}

function increaseDifficulty() {
    if (score % 100 === 0) { // 100 PTS
        wordSpeed += 0.5; // AUMENTA LA VELOCIDAD
        wordInterval = Math.max(500, wordInterval - 200); 
        clearInterval(wordGenerationInterval); 
        wordGenerationInterval = setInterval(() => {
            if (!isPaused && !gameOver) {
                generateWord();
            }
        }, wordInterval); // ACTUALIZA EL INTERVALO DE GENERACIÓN DE PALABRAS
    }
}

function updateWords() {
    words.forEach(word => {
        word.y += wordSpeed; // VELOCIDAD DE LAS PALABRAS
        if (word.y > canvas.height) {
            gameOver = true; // SI LA PALABRA SALE DEL CANVAS, TERMINA EL JUEGO
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
        playerInput = e.target.value.toUpperCase(); // CONVERTIR A MAYÚSCULAS LA ENTRADA DEL JUGADOR
    
        // VALIDA LA ENTRADA DEL JUGADOR CON LAS PALABRAS EN PANTALLA
        words = words.filter(wordObj => {
            if (wordObj.word === playerInput) {
                score += 10; // INCREMENTAR PUNTUACION
                document.getElementById('score').textContent = score;
                createParticles(wordObj.x, wordObj.y); // GENERAR PARTICULAS
                playerInput = ''; // REINICIAR LA ENTRADA DEL JUGAODR
                hiddenInput.value = ''; // LIMPIAR EL CAMPO
                increaseDifficulty();
                updateRank(score);
                return false; // ELIMINAR LA PALABRA
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
        window.location.href = 'index.html'; // REDIRECCIONAR AL MENÚ PRINCIPAL
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
    window.location.href = 'index.html'; // REDIRIGER AL MENÚ PRINCIPAL
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
