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

let particles = []; // Lista de partículas

// Generar palabras aleatorias
const wordList = ['AMOR', 'CASA', 'PERRO', 'FELIZ', 'LIBRO', 'SOL', 'FLOR', 'COMIDA', 'AGUA'];
function generateWord() {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const x = Math.random() * (canvas.width - 100); // Posición horizontal aleatoria
    const y = 0; // Empieza desde la parte superior
    words.push({ word, x, y });
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

// Mover palabras hacia abajo
function updateWords() {
    words.forEach(word => {
        word.y += 2; // Velocidad de caída
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
        // Elimina el último carácter si presiona Backspace
        playerInput = playerInput.slice(0, -1);
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        // Agrega la letra presionada a la entrada del jugador
        playerInput += e.key.toUpperCase();
    }

    // Verifica si la entrada del jugador coincide con alguna palabra
words = words.filter(wordObj => {
    if (wordObj.word === playerInput) {
        score += 10; // Incrementa la puntuación si la palabra es destruida
        document.getElementById('score').textContent = score;
        createParticles(wordObj.x, wordObj.y); // Genera partículas en la posición de la palabra
        playerInput = ''; // Reinicia la entrada del jugador
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
