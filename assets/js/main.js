document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('assets/sounds/drop.mp3');
        audio.play();
    });
});
