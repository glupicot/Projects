document.addEventListener('DOMContentLoaded', function() {
    // Элементы плеера
    const video = document.querySelector('.vhs-video');
    const playBtn = document.querySelector('.vhs-button.play');
    const stopBtn = document.querySelector('.vhs-button.stop');
    const rewindBtn = document.querySelector('.vhs-button.rewind');
    const ffwdBtn = document.querySelector('.vhs-button.ffwd');
    const ejectBtn = document.querySelector('.vhs-button.eject');
    const progress = document.querySelector('.vhs-progress');
    const cassette = document.querySelector('.vhs-cassette');
    const playerContainer = document.querySelector('.vhs-player');

    // Загрузка единственного видео
    video.src = 'assets/videos/toyota-ad-jp.mp4';
    
    // VHS эффекты
    function addVHSEffects() {
        // Случайные помехи изображения
        setInterval(() => {
            if (Math.random() > 0.7 && !video.paused) {
                video.style.transform = `translateY(${Math.random() * 3 - 1.5}px)`;
                setTimeout(() => {
                    video.style.transform = 'translateY(0)';
                }, 100 + Math.random() * 400);
            }
        }, 2500);
        
        // Цветовые искажения
        video.addEventListener('play', () => {
            setInterval(() => {
                const hue = Math.random() * 15 - 7;
                const brightness = 1 + Math.random() * 0.15;
                video.style.filter = `brightness(${brightness}) contrast(1.3) hue-rotate(${hue}deg)`;
            }, 150);
        });
    }
    
    // Управление плеером
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    
    function togglePlay() {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playerContainer.classList.add('playing');
        } else {
            video.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playerContainer.classList.remove('playing');
        }
    }
    
    stopBtn.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progress.style.width = '0%';
        playerContainer.classList.remove('playing');
    });
    
    rewindBtn.addEventListener('click', () => {
        video.currentTime = Math.max(0, video.currentTime - 5);
    });
    
    ffwdBtn.addEventListener('click', () => {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });
    
    ejectBtn.addEventListener('click', () => {
        // Анимация извлечения кассеты
        cassette.style.transform = 'translateX(120px) rotate(20deg)';
        setTimeout(() => {
            cassette.style.transform = 'translateX(0) rotate(0)';
            // Перезагрузка того же видео (имитация смены кассеты)
            video.currentTime = 0;
            progress.style.width = '0%';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playerContainer.classList.remove('playing');
        }, 800);
    });
    
    // Обновление прогресс-бара
    video.addEventListener('timeupdate', updateProgress);
    
    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = `${percent}%`;
    }
    
    // Перемотка при клике на прогресс-бар
    document.querySelector('.vhs-track').addEventListener('click', (e) => {
        const trackWidth = this.clientWidth;
        const clickPosition = e.offsetX;
        const clickPercent = (clickPosition / trackWidth) * 100;
        video.currentTime = (clickPercent / 100) * video.duration;
    });
    
    // Инициализация
    addVHSEffects();
    
    // Счетчик посещений (стилизованный под 90-е)
    let counter = localStorage.getItem('vhsCounter') || 10000;
    const counterElement = document.getElementById('counter');
    
    function updateCounter() {
        counter++;
        counterElement.textContent = counter.toString().padStart(5, '0');
        localStorage.setItem('vhsCounter', counter);
        
        // Случайные "глюки" в цифрах
        if (Math.random() > 0.9) {
            counterElement.style.textShadow = '0 0 8px #f00, 0 0 10px #00f';
            setTimeout(() => {
                counterElement.style.textShadow = '0 0 5px #0f0';
            }, 300);
        }
    }
    
    setInterval(updateCounter, 3500);
    
    // Эффекты для галереи
    document.querySelectorAll('.vhs-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = `translate(${Math.random() * 6 - 3}px, ${Math.random() * 6 - 3}px)`;
            item.style.filter = 'brightness(1.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(-5px)';
            item.style.filter = 'brightness(1)';
        });
    });
    
    // Эффект включения CRT
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1.5s ease-out';
        document.body.style.opacity = '1';
    }, 300);
    
    // Автозапуск видео (опционально)
    setTimeout(() => {
        video.muted = true; // Без звука для автозапуска
        video.play()
            .then(() => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playerContainer.classList.add('playing');
            })
            .catch(e => console.log("Autoplay prevented:", e));
    }, 2000);
});