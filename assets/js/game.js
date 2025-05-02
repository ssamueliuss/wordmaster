const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Ajusta el tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables del juego
let words = [];
let score = 0;
let gameOver = false;
let playerInput = ''; // Entrada del jugador

let wordSpeed = 1; // Velocidad inicial de las palabras
let wordInterval = 2000; // Intervalo inicial de generación de palabras (en milisegundos)

let particles = []; // Lista de partículas

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

// Selecciona el campo de entrada
const hiddenInput = document.getElementById('hidden-input');

// Enfoca automáticamente el campo de entrada al cargar la página
hiddenInput.focus();

// Asegúrate de que el campo de entrada recupere el foco si el jugador lo pierde
document.addEventListener('click', () => {
    hiddenInput.focus();
});


// Generar palabras aleatorias
const wordList = ['AMOR', 'CASA', 'PERRO', 'FELIZ', 'LIBRO', 'SOL', 'FLOR', 'COMIDA', 'AGUA'];
function generateWord() {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const x = Math.random() * (canvas.width - 100); // Posición horizontal aleatoria
    const y = 0; // Empieza desde la parte superior
    words.push({ word, x, y });
}

function updateRank(score) {
    const rank = rankData.find((r, index) => {
        const nextRank = rankData[index + 1];
        return score >= r.minScore && (!nextRank || score < nextRank.minScore);
    });

    // Actualiza el mensaje y la barra de progreso
    const rankMessage = document.getElementById('rank-message');
    const progressBar = document.getElementById('progress-bar');

    if (rank) {
        rankMessage.textContent = rank.message;
        progressBar.style.width = `${rank.percentage}%`;
    }
}

// Dibujar palabras en el canvas
function drawWords() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    words.forEach(({ word, x, y }) => {
        ctx.fillText(word, x, y);
    });

    // Dibujar la entrada del jugador en la parte inferior
    ctx.fillStyle = 'fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Escribiendo: ${playerInput}`, 10, canvas.height - 20);
}

function increaseDifficulty() {
    if (score % 100 === 0) { // Cada 100 puntos
        wordSpeed += 0.5; // Incrementa la velocidad de las palabras
        wordInterval = Math.max(500, wordInterval - 200); // Reduce el intervalo, mínimo 500ms
        clearInterval(wordGenerationInterval); // Detén el intervalo actual
        wordGenerationInterval = setInterval(() => {
            if (!isPaused && !gameOver) {
                generateWord();
            }
        }, wordInterval); // Crea un nuevo intervalo con el tiempo actualizado
    }
}

function updateWords() {
    words.forEach(word => {
        word.y += wordSpeed; // Usa la velocidad dinámica
        if (word.y > canvas.height) {
            gameOver = true; // Si una palabra llega al fondo, el juego termina
        }
    });
}

function createParticles(x, y) {
    const particleCount = 20; // Número de partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 4, // Velocidad horizontal aleatoria
            dy: (Math.random() - 0.5) * 4, // Velocidad vertical aleatoria
            size: Math.random() * 3 + 1, // Tamaño aleatorio
            life: 50 // Duración de la partícula
        });
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = '#fff'; // Color de las partículas
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateParticles() {
    particles = particles.filter(particle => particle.life > 0); // Elimina partículas que han "muerto"
    particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life -= 1; // Reduce la vida de la partícula
    });
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (e.key === 'Backspace') {
        playerInput = playerInput.slice(0, -1);
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        playerInput += e.key.toUpperCase();
    }

    // Escucha los cambios en el campo de entrada
hiddenInput.addEventListener('input', (e) => {
    playerInput = e.target.value.toUpperCase(); // Convierte la entrada a mayúsculas

    // Verifica si la entrada coincide con alguna palabra
    words = words.filter(wordObj => {
        if (wordObj.word === playerInput) {
            score += 10; // Incrementa la puntuación
            document.getElementById('score').textContent = score;
            createParticles(wordObj.x, wordObj.y);
            playerInput = ''; // Reinicia la entrada del jugador
            hiddenInput.value = ''; // Limpia el campo de entrada
            increaseDifficulty();
            updateRank(score); // Actualiza el rango y la barra de progreso
            return false; // Elimina la palabra
        }
        return true;
    });
});

function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const menuButton = document.getElementById('menu-button'); // Botón de volver al menú

    // Muestra el modal
    modal.style.display = 'flex';
    finalScore.textContent = score;

    // Reinicia el juego al hacer clic en el botón "Reiniciar"
    restartButton.addEventListener('click', () => {
        location.reload(); // Recarga la página para reiniciar el juego
    });

    // Vuelve al menú principal al hacer clic en el botón "Volver al Menú"
    menuButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirige al menú principal
    });
}

let isPaused = false; // Variable para controlar el estado de pausa

// Función para pausar el juego
function pauseGame() {
    isPaused = true;
    const modal = document.getElementById('pause-modal');
    modal.style.display = 'flex'; // Muestra el modal de pausa
}

// Función para reanudar el juego
function resumeGame() {
    isPaused = false;
    const modal = document.getElementById('pause-modal');
    modal.style.display = 'none'; // Oculta el modal de pausa
}

// Manejo del botón de pausa
document.getElementById('pause-button').addEventListener('click', pauseGame);

// Manejo de los botones del modal de pausa
document.getElementById('resume-button').addEventListener('click', resumeGame);
document.getElementById('restart-button-pause').addEventListener('click', () => {
    location.reload(); // Recarga la página para reiniciar el juego
});
document.getElementById('menu-button-pause').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirige al menú principal
});

function gameLoop() {
    if (gameOver) {
        showGameOverModal(); // Muestra el modal de "Juego Terminado"
        return;
    }

    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
        drawWords();
        updateWords();
        drawParticles(); // Dibuja las partículas
        updateParticles(); // Actualiza las partículas
    }

    requestAnimationFrame(gameLoop);
}

// Generar palabras periódicamente (solo si no está en pausa)
setInterval(() => {
    if (!isPaused && !gameOver) {
        generateWord();
    }
}, 2000);

// Iniciar el juego
gameLoop();
