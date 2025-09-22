document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const board = document.querySelector('.board');
    const status = document.querySelector('.status');
    const carImages = document.querySelectorAll('.cars img');
    const restartBtn = document.createElement('button');
    restartBtn.className = 'restart-btn';
    restartBtn.textContent = 'Начать заново';
    document.querySelector('.board-container').appendChild(restartBtn);

    // Переменные игры
    let currentPlayer = 'player';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let playerCar = '';
const opponentCar = '../toyota-page/assets/icons/toyota-sprinter-marino.png';    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Инициализация игры
    function initGame() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }

        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'player';
        status.textContent = 'Ваш ход';
    }

    // Выбор машины игрока
    carImages.forEach(img => {
        img.addEventListener('click', function() {
            carImages.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            playerCar = this.src;
            initGame();
        });
    });

    // Обработка хода
    function handleCellClick(e) {
        const index = e.target.dataset.index;
        
        if (!gameActive || gameBoard[index] !== '' || !playerCar) return;
        
        makeMove(index, currentPlayer, e.target);
        
        if (checkWin()) {
            status.textContent = currentPlayer === 'player' ? 'Вы победили!' : 'Toyota Sprinter Marino победила!';
            gameActive = false;
            return;
        }
        
        if (checkDraw()) {
            status.textContent = 'Ничья!';
            gameActive = false;
            return;
        }
        
        if (gameActive) {
            currentPlayer = 'opponent';
            status.textContent = 'Ход Toyota Sprinter Marino...';
            
            setTimeout(() => {
                const emptyCells = gameBoard.map((cell, idx) => cell === '' ? idx : null).filter(val => val !== null);
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const cellIndex = emptyCells[randomIndex];
                const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
                
                makeMove(cellIndex, currentPlayer, cell);
                
                if (checkWin()) {
                    status.textContent = currentPlayer === 'player' ? 'Вы победили!' : 'Toyota Sprinter Marino победила!';
                    gameActive = false;
                    return;
                }
                
                if (checkDraw()) {
                    status.textContent = 'Ничья!';
                    gameActive = false;
                    return;
                }
                
                currentPlayer = 'player';
                status.textContent = 'Ваш ход';
            }, 1000);
        }
    }

    function makeMove(index, player, cellElement) {
        gameBoard[index] = player;
        const img = document.createElement('img');
        img.src = player === 'player' ? playerCar : opponentCar;
        cellElement.innerHTML = '';
        cellElement.appendChild(img);
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameBoard[index] === currentPlayer;
            });
        });
    }

    function checkDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    restartBtn.addEventListener('click', initGame);
    status.textContent = 'Выберите свою Toyota';
});