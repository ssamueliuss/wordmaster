document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('assets/sounds/drop.mp3');
        audio.play();
    });
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

// DESHABILITAR INGRESO A LA CONSOLA DE INSPECCIÓN
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.shiftKey && e.key === 'I'))) {
        e.preventDefault();
    }
});
