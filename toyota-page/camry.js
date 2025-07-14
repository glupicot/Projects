// camry-drift-final.js - Дрифт-арена с Toyota Camry (исправленная версия)

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
    let highscores = JSON.parse(localStorage.getItem(HIGHSCORES_KEY)) || [];
    let gameTime = 60;
    let gameInterval, timeInterval;
    let smokeParticles = [];

    // Изображение машины (Toyota Camry)
    const carImage = new Image();
    carImage.src = '../toyota-page/assets/icons/camry.png'; // Убедитесь, что путь правильный
    let imageLoaded = false;
    carImage.onload = function() {
        imageLoaded = true;
    };

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
        angle: 0, // 0 радиан = смотрит вверх
        driftPower: 0,
        score: 0,
        
        update() {
            // Ускорение
            if (keys.ArrowUp) {
                this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration);
            } 
            // Торможение/Задний ход
            else if (keys.ArrowDown) {
                this.speed = Math.max(-this.reverseSpeed, this.speed - this.brakePower);
            } 
            // Естественное замедление
            else {
                this.speed *= 0.97;
                if (Math.abs(this.speed) < 0.1) this.speed = 0;
            }

            // Руление (только при движении)
            if (Math.abs(this.speed) > 0.5) {
                const turnFactor = this.speed / this.maxSpeed;
                const turnSpeed = 0.03 * turnFactor;
                
                if (keys.ArrowLeft) this.angle -= turnSpeed;
                if (keys.ArrowRight) this.angle += turnSpeed;
            }

            // Механика дрифта
            if (keys[' '] && Math.abs(this.speed) > 2) {
                this.driftPower = Math.min(1, this.driftPower + 0.05);
                const driftAngle = 0.05 * (this.speed / this.maxSpeed);
                this.angle += keys.ArrowLeft ? -driftAngle : keys.ArrowRight ? driftAngle : 0;
                
                // Частицы дыма
                if (Math.random() < 0.3) {
                    smokeParticles.push({
                        x: this.x - Math.sin(this.angle) * 30,
                        y: this.y + Math.cos(this.angle) * 30,
                        size: 5 + Math.random() * 10,
                        alpha: 0.7,
                        life: 30
                    });
                    // Добавление очков за дрифт
                    this.score += Math.floor(this.driftPower * 5);
                    scoreDisplay.textContent = this.score;
                }
            } else {
                this.driftPower = Math.max(0, this.driftPower - 0.02);
            }

            // Движение
            this.x += Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;

            // Проверка границ
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        },
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            // Рисуем машину (изображение или заглушку)
            if (imageLoaded) {
                // Рисуем изображение без дополнительных поворотов
                ctx.drawImage(carImage, -this.width/2, -this.height/2, this.width, this.height);
            } else {
                // Запасной вариант
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

    // Сегменты трассы
    const track = {
        segments: [],
        generate() {
            this.segments = [];
            // Генерация случайной трассы
            for (let i = 0; i < 15; i++) {
                this.segments.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    width: 60 + Math.random() * 90
                });
            }
        },
        draw() {
            // Дорога
            ctx.fillStyle = '#333';
            this.segments.forEach(seg => {
                ctx.beginPath();
                ctx.arc(seg.x, seg.y, seg.width, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Границы
            ctx.strokeStyle = '#E30613';
            ctx.lineWidth = 3;
            this.segments.forEach(seg => {
                ctx.beginPath();
                ctx.arc(seg.x, seg.y, seg.width + 20, 0, Math.PI * 2);
                ctx.stroke();
            });
        }
    };

    // Частицы дыма
    function updateSmoke() {
        for (let i = smokeParticles.length - 1; i >= 0; i--) {
            const p = smokeParticles[i];
            p.x += Math.random() * 3 - 1.5;
            p.y += Math.random() * 3 - 1.5;
            p.size += 0.2;
            p.alpha -= 0.02;
            p.life--;
            
            if (p.life <= 0 || p.alpha <= 0) {
                smokeParticles.splice(i, 1);
            }
        }
    }

    function drawSmoke() {
        smokeParticles.forEach(p => {
            ctx.fillStyle = `rgba(200, 200, 200, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Управление с клавиатуры
    const keys = {};
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            keys[e.code === 'Space' ? ' ' : e.code] = true;
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            keys[e.code === 'Space' ? ' ' : e.code] = false;
        }
    });

    // Функции игры
    function startGame() {
        startModal.style.display = 'none';
        endModal.style.display = 'none';
        car.score = 0;
        gameTime = 60;
        scoreDisplay.textContent = '0';
        timeDisplay.textContent = '60';
        smokeParticles = [];
        car.x = canvas.width / 2;
        car.y = canvas.height / 2;
        car.speed = 0;
        car.angle = 0; // Начальный угол - смотрит вверх
        track.generate();
        
        // Таймер
        timeInterval = setInterval(() => {
            gameTime--;
            timeDisplay.textContent = gameTime;
            if (gameTime <= 0) endGame();
        }, 1000);
        
        // Игровой цикл
        gameInterval = setInterval(gameLoop, 1000/60);
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
        // Очистка холста
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем трассу
        track.draw();
        
        // Обновляем и рисуем игровые объекты
        car.update();
        updateSmoke();
        drawSmoke();
        car.draw();
    }

    function updateHighscores(score) {
        highscores.push(score);
        highscores.sort((a, b) => b - a);
        highscores = highscores.slice(0, 5);
        localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(highscores));
    }

    function showHighscores() {
        // Исправленная версия без дублирования номеров
        highscoresList.innerHTML = '';
        highscores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${score} очков`;
            highscoresList.appendChild(li);
        });
    }

    // Инициализация игры
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    // Показываем стартовый экран
    showHighscores();
});