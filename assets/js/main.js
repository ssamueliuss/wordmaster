document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('assets/sounds/drop.mp3');
        audio.play();
    });
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

// Deshabilitar teclas como F12, Ctrl+Shift+I, Ctrl+U
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.shiftKey && e.key === 'I'))) {
        e.preventDefault();
    }
});
