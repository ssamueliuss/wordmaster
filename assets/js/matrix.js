const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Ajusta el tamaño del canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Caracteres que caerán (puedes usar letras, números o símbolos)
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const fontSize = 16;
const columns = canvas.width / fontSize;

// Un array para rastrear la posición de las "lluvias" en cada columna
const drops = Array(Math.floor(columns)).fill(1);

// Función para dibujar el efecto
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Fondo con transparencia para efecto de desvanecimiento
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#808080'; // Color verde para las letras
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, x) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, x * fontSize, y * fontSize);

        // Reinicia la gota si llega al final de la pantalla o aleatoriamente
        if (y * fontSize > canvas.height || Math.random() > 0.975) {
            drops[x] = 0;
        }

        drops[x]++;
    });
}

// Ejecuta el efecto continuamente
setInterval(drawMatrix, 50);

// Ajusta el tamaño del canvas si la ventana cambia de tamaño
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
