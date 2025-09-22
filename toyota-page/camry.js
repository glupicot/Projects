// camry-drift-final.js - Исправленная версия
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const canvas = document.getElementById('driftCanvas');
    const ctx = canvas.getContext('2d');
    const startModal = document.getElementById('startModal');
    const endModal = document.getElementById('endModal');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const finalScoreDisplay = document.getElementById('finalScore');
    const highscoresList = document.getElementById('highscoresList');

    // Настройки игры
    const HIGHSCORES_KEY = 'camryDriftHighscores';
    const GAME_DURATION = 60;
    let highscores = JSON.parse(localStorage.getItem(HIGHSCORES_KEY)) || [];
    let gameTime = GAME_DURATION;
    let gameInterval, timeInterval;
    let smokeParticles = [];

    // Изображение машины
    const carImage = new Image();
    carImage.src = '../toyota-page/assets/icons/camry.png';
    let imageLoaded = false;
    carImage.onload = () => imageLoaded = true;

    // Объект машины
    const car = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 40,
        height: 80,
        speed: 0,
        maxSpeed: 7,
        acceleration: 0.08,
        brakePower: 0.15,
        reverseSpeed: 3,
        angle: 0,
        driftPower: 0,
        score: 0,
        
        update() {
            // Управление
            if (keys.ArrowUp) {
                this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration);
            } else if (keys.ArrowDown) {
                this.speed = Math.max(-this.reverseSpeed, this.speed - this.brakePower);
            } else {
                this.speed *= 0.97;
                if (Math.abs(this.speed) < 0.1) this.speed = 0;
            }

            // Руление
            if (Math.abs(this.speed) > 0.5) {
                const turnFactor = this.speed / this.maxSpeed;
                const turnSpeed = 0.03 * turnFactor;
                
                if (keys.ArrowLeft) this.angle -= turnSpeed;
                if (keys.ArrowRight) this.angle += turnSpeed;
            }

            // Дрифт
            if (keys[' '] && Math.abs(this.speed) > 2) {
                this.driftPower = Math.min(1, this.driftPower + 0.05);
                const driftAngle = 0.05 * (this.speed / this.maxSpeed);
                this.angle += keys.ArrowLeft ? -driftAngle : keys.ArrowRight ? driftAngle : 0;
                
                if (Math.random() < 0.3) {
                    this.addSmoke();
                    this.score += Math.floor(this.driftPower * 5);
                    scoreDisplay.textContent = this.score;
                }
            } else {
                this.driftPower = Math.max(0, this.driftPower - 0.02);
            }

            // Движение
            this.x += Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;

            // Границы
            this.x = (this.x + canvas.width) % canvas.width;
            this.y = (this.y + canvas.height) % canvas.height;
        },
        
        addSmoke() {
            smokeParticles.push({
                x: this.x - Math.sin(this.angle) * 30,
                y: this.y + Math.cos(this.angle) * 30,
                size: 5 + Math.random() * 10,
                alpha: 0.7,
                life: 30
            });
        },
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            if (imageLoaded) {
                ctx.drawImage(carImage, -this.width/2, -this.height/2, this.width, this.height);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                ctx.fillStyle = '#E30613';
                ctx.beginPath();
                ctx.moveTo(-this.width/2, -this.height/2);
                ctx.lineTo(this.width/3, -this.height/2);
                ctx.lineTo(0, this.height/2);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
        }
    };

    // Трасса
    const track = {
        segments: [],
        generate() {
            this.segments = Array.from({length: 15}, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 60 + Math.random() * 90
            }));
        },
        draw() {
            ctx.fillStyle = '#333';
            this.segments.forEach(seg => {
                ctx.beginPath();
                ctx.arc(seg.x, seg.y, seg.width, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.strokeStyle = '#E30613';
            ctx.lineWidth = 3;
            this.segments.forEach(seg => {
                ctx.beginPath();
                ctx.arc(seg.x, seg.y, seg.width + 20, 0, Math.PI * 2);
                ctx.stroke();
            });
        }
    };

    // Частицы
    function updateSmoke() {
        smokeParticles = smokeParticles.filter(p => {
            p.x += Math.random() * 3 - 1.5;
            p.y += Math.random() * 3 - 1.5;
            p.size += 0.2;
            p.alpha -= 0.02;
            return p.life-- > 0 && p.alpha > 0;
        });
    }

    function drawSmoke() {
        smokeParticles.forEach(p => {
            ctx.fillStyle = `rgba(200, 200, 200, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Управление
    const keys = {};
    document.addEventListener('keydown', (e) => {
        const code = e.code === 'Space' ? ' ' : e.code;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(code)) {
            keys[code] = true;
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        const code = e.code === 'Space' ? ' ' : e.code;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(code)) {
            keys[code] = false;
        }
    });

    // Игровые функции
    function startGame() {
        startModal.style.display = 'none';
        endModal.style.display = 'none';
        resetGame();
        track.generate();
        
        timeInterval = setInterval(() => {
            gameTime--;
            timeDisplay.textContent = gameTime;
            if (gameTime <= 0) endGame();
        }, 1000);
        
        gameInterval = setInterval(gameLoop, 1000/60);
    }

    function resetGame() {
        car.score = 0;
        gameTime = GAME_DURATION;
        scoreDisplay.textContent = '0';
        timeDisplay.textContent = GAME_DURATION.toString();
        smokeParticles = [];
        car.x = canvas.width / 2;
        car.y = canvas.height / 2;
        car.speed = 0;
        car.angle = 0;
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(timeInterval);
        finalScoreDisplay.textContent = car.score;
        updateHighscores(car.score);
        showHighscores();
        endModal.style.display = 'flex';
    }

    function gameLoop() {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        track.draw();
        car.update();
        updateSmoke();
        drawSmoke();
        car.draw();
    }

    function updateHighscores(score) {
        highscores = [...new Set([...highscores, score])]
            .sort((a, b) => b - a)
            .slice(0, 5);
        localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(highscores));
    }
function showHighscores() {
    highscores = JSON.parse(localStorage.getItem(HIGHSCORES_KEY)) || [];
    highscoresList.innerHTML = '';
    
    highscores.forEach((score, i) => {
        const li = document.createElement('li');
        
        // Создаем span для номера
        const numberSpan = document.createElement('span');
        numberSpan.textContent = `${i + 1}. `;
        numberSpan.style.fontWeight = 'bold';
        
        // Создаем span для очков
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = `${Number(score).toFixed(2)} очков`;
        
        li.appendChild(numberSpan);
        li.appendChild(scoreSpan);
        highscoresList.appendChild(li);
    });
}
    // Инициализация
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    showHighscores();

    // Кнопка выхода
document.getElementById('exitButton').addEventListener('click', function() {
    // Замените URL на нужный вам
    window.location.href = '../toyota-page/tictacoe.html'; 
});
});