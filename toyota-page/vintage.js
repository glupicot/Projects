document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы
    const video = document.querySelector('.vhs-video');
    const playerContainer = document.querySelector('.vhs-player-container');
    const crtFrame = document.querySelector('.crt-frame');
    
    // Элементы управления
    const controls = {
        play: document.querySelector('.vhs-button.play'),
        stop: document.querySelector('.vhs-button.stop'),
        rewind: document.querySelector('.vhs-button.rewind'),
        ffwd: document.querySelector('.vhs-button.ffwd'),
        eject: document.querySelector('.vhs-button.eject'),
        progress: document.querySelector('.vhs-progress'),
        track: document.querySelector('.vhs-track'),
        cassette: document.querySelector('.vhs-cassette'),
        counter: document.getElementById('counter')
    };

    // Инициализация плеера
    function initPlayer() {
        // Установка источника видео
        video.src = 'assets/videos/toyota-ad-jp.mp4';
        
        // Настройка размеров CRT-экрана
        setupCRTFrame();
        
        // Инициализация обработчиков событий
        setupEventListeners();
        
        // Запуск эффектов
        startVHSEffects();
        
        // Инициализация счетчика
        initCounter();
        
        // Попытка автозапуска
        autoPlayVideo();
    }

    // Настройка CRT-экрана
    function setupCRTFrame() {
        if (!crtFrame) return;
        
        // Убираем фиксированные размеры
        crtFrame.style.paddingBottom = '0';
        crtFrame.style.height = 'auto';
        
        // Настройка видео внутри экрана
        const vhsScreen = document.querySelector('.vhs-screen');
        if (vhsScreen) {
            vhsScreen.style.position = 'relative';
            vhsScreen.style.width = '100%';
            vhsScreen.style.height = '0';
            vhsScreen.style.paddingBottom = '75%'; // Соотношение 4:3
            vhsScreen.style.overflow = 'hidden';
        }
        
        video.style.objectFit = 'cover';
    }

    // Обработчики событий
    function setupEventListeners() {
        // Управление воспроизведением
        controls.play.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        
        controls.stop.addEventListener('click', stopVideo);
        controls.rewind.addEventListener('click', rewindVideo);
        controls.ffwd.addEventListener('click', fastForwardVideo);
        controls.eject.addEventListener('click', ejectCassette);
        
        // Прогресс-бар
        controls.track.addEventListener('click', seekVideo);
        video.addEventListener('timeupdate', updateProgressBar);
        
        // Галерея
        document.querySelectorAll('.vhs-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = `translate(${Math.random() * 6 - 3}px, ${Math.random() * 6 - 3}px)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(-5px)';
            });
        });
    }

    // Функции управления плеером
    function togglePlay() {
        if (video.paused) {
            video.play()
                .then(() => {
                    controls.play.innerHTML = '<i class="fas fa-pause"></i>';
                    playerContainer.classList.add('playing');
                })
                .catch(e => console.error("Playback error:", e));
        } else {
            video.pause();
            controls.play.innerHTML = '<i class="fas fa-play"></i>';
            playerContainer.classList.remove('playing');
        }
    }

    function stopVideo() {
        video.pause();
        video.currentTime = 0;
        controls.play.innerHTML = '<i class="fas fa-play"></i>';
        controls.progress.style.width = '0%';
        playerContainer.classList.remove('playing');
    }

    function rewindVideo() {
        video.currentTime = Math.max(0, video.currentTime - 5);
    }

    function fastForwardVideo() {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
    }

    function ejectCassette() {
        controls.cassette.style.transform = 'translateX(120px) rotate(20deg)';
        setTimeout(() => {
            controls.cassette.style.transform = 'translateX(0) rotate(0)';
            video.currentTime = 0;
            controls.progress.style.width = '0%';
            controls.play.innerHTML = '<i class="fas fa-play"></i>';
            playerContainer.classList.remove('playing');
        }, 800);
    }

    function seekVideo(e) {
        const trackRect = controls.track.getBoundingClientRect();
        const clickPosition = e.clientX - trackRect.left;
        const percent = (clickPosition / trackRect.width) * 100;
        video.currentTime = (percent / 100) * video.duration;
    }

    function updateProgressBar() {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            controls.progress.style.width = `${percent}%`;
        }
    }

    // VHS эффекты
    function startVHSEffects() {
        // Дрожание изображения
        setInterval(() => {
            if (Math.random() > 0.7 && !video.paused) {
                video.style.transform = `translateY(${Math.random() * 3 - 1.5}px)`;
                setTimeout(() => {
                    video.style.transform = 'translateY(0)';
                }, 100 + Math.random() * 400);
            }
        }, 2500);
    }

    // Счетчик посещений
    function initCounter() {
        let counter = localStorage.getItem('vhsCounter') || 10000;
        
        function updateCounter() {
            counter++;
            controls.counter.textContent = counter.toString().padStart(5, '0');
            localStorage.setItem('vhsCounter', counter);
            
            if (Math.random() > 0.9) {
                controls.counter.classList.add('glitch');
                setTimeout(() => {
                    controls.counter.classList.remove('glitch');
                }, 300);
            }
        }
        
        setInterval(updateCounter, 3500);
    }

    // Автозапуск видео
    function autoPlayVideo() {
        setTimeout(() => {
            video.muted = true;
            video.play()
                .then(() => {
                    controls.play.innerHTML = '<i class="fas fa-pause"></i>';
                    playerContainer.classList.add('playing');
                })
                .catch(e => console.log("Autoplay blocked"));
        }, 2000);
    }

    // Эффект включения CRT
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1.5s ease-out';
        document.body.style.opacity = '1';
    }, 300);

    // Запуск плеера
    initPlayer();
});