const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// TAMAÑO DEL CANVAS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// CARACTERES DE LA "LLUVIA"
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const fontSize = 16;
const columns = canvas.width / fontSize;

// ARRAY DE GOTAS
const drops = Array(Math.floor(columns)).fill(1);

// DIBUJO DE LA MATRIZ
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#808080';
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, x) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, x * fontSize, y * fontSize);

        // REINICIO ALEATORIO DE GOTAS
        if (y * fontSize > canvas.height || Math.random() > 0.975) {
            drops[x] = 0;
        }

        drops[x]++;
    });
}

// BUCLE DE ANIMACIÓN
setInterval(drawMatrix, 50);

// REAJUSTE DE TAMAÑO DEL CANVAS
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});