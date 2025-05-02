<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordMaster - Juego</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <canvas id="game-canvas"></canvas>
    <div id="scoreboard">
        <p>Puntuación: <span id="score">0</span></p>
        
        <button id="pause-button">Pausa</button>
    </div>

    <input id="hidden-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" />
    
    <div id="pause-modal" class="modal">
        <div class="modal-content">
            <h2>Juego en Pausa</h2>
            <button id="resume-button">Reanudar</button>
            <button id="restart-button-pause">Reiniciar</button>
            <button id="menu-button-pause">Volver al Menú</button>
        </div>
    </div>
    <div id="game-over-modal" class="modal">
        <div class="modal-content">
            <h2>¡Juego Terminado!</h2>
            <p>Puntuación final: <span id="final-score">0</span></p>
            <button id="restart-button">Reiniciar</button>
            <button id="menu-button">Volver al Menú</button>
            
            <div id="rank-container">
                <p id="rank-message">Estás comenzando. ¡Sigue practicando!</p>
                <div id="progress-container">
                    <div id="progress-bar"></div>
                </div>
            </div>
        
        </div>
    </div>
    <script src="assets/js/game.js"></script>
</body>
</html>
