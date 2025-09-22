document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация дождя
    const RAIN_CONFIG = {
        DROP_COUNT: 150,          // Общее количество капель
        INITIAL_DELAY: 2000,       // Задержка перед началом дождя (мс)
        DROP_ADD_INTERVAL: 1500,   // Интервал добавления новых капель (мс)
        DROPS_PER_INTERVAL: 20,    // Капель добавляемых за интервал
        MAX_DROPS: 300,            // Максимальное количество капель
        FADE_IN_DURATION: 3000     // Длительность появления эффекта (мс)
    };

    // Элементы DOM
    const garage = document.getElementById('garage');
    const navDots = document.getElementById('navDots');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const rainContainer = document.createElement('div');
    rainContainer.id = 'rain-container';
    document.body.appendChild(rainContainer);

    // Данные машин
    const cars = [
        { name: "Toyota Corolla Ceres", image: "toyota-corolla-ceres.png", info: "Роскошная версия Corolla с кузовом хардтоп" },
        { name: "Toyota Carina ED", image: "toyota-carina-ed.png", info: "Футуристичный дизайн и передовые технологии 90-х" },
        { name: "Toyota Chaser", image: "toyota-chaser.png", info: "Легенда дрифта с рядной шестеркой 1JZ" },
        { name: "Toyota Sprinter Marino", image: "toyota-sprinter-marino.png", info: "Элегантный купе-седан с атмосферным характером" },
        { name: "Toyota Sprinter Trueno", image: "toyota-sprinter-trueno.png", info: "Знаменитый AE86 из Initial D" },
        { name: "Toyota Crown", image: "toyota-crown.png", info: "Флагманский седан для истинных ценителей" },
        { name: "Toyota Soarer", image: "toyota-soarer.png", info: "Роскошное GT-купе с технологиями будущего" },
        { name: "Toyota Vista", image: "toyota-vista.png", info: "Практичный седан для ежедневных поездок" }
    ];

    // Состояние приложения
    let isDragging = false;
    let startX, scrollLeft;
    let rainInterval;

    // Инициализация гаража
    function initGarage() {
        cars.forEach((car, index) => {
            // Создаем страницу машины
            const carPage = document.createElement('div');
            carPage.className = 'car-page';
            carPage.innerHTML = `
                <h2>${car.name}</h2>
                <img src="assets/icons/${car.image}" alt="${car.name}" class="car-image">
                <div class="car-info">${car.info}</div>
            `;
            garage.appendChild(carPage);

            // Создаем точки навигации
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dot.addEventListener('click', () => scrollToPage(index));
            navDots.appendChild(dot);
        });
    }

    // Инициализация дождя
    function initRainEffect() {
        // Эффект мокрого стекла
        const wetEffect = document.createElement('div');
        wetEffect.className = 'wet-effect';
        document.body.appendChild(wetEffect);

        // Запускаем дождь с задержкой
        setTimeout(() => {
            createRainDrops(RAIN_CONFIG.DROP_COUNT);
            
            // Постепенно добавляем новые капли
            rainInterval = setInterval(() => {
                if (rainContainer.children.length < RAIN_CONFIG.MAX_DROPS) {
                    createRainDrops(RAIN_CONFIG.DROPS_PER_INTERVAL);
                }
            }, RAIN_CONFIG.DROP_ADD_INTERVAL);
            
            // Плавное появление эффекта
            wetEffect.style.opacity = '1';
        }, RAIN_CONFIG.INITIAL_DELAY);
    }

    // Создание капель дождя
    function createRainDrops(count) {
        for (let i = 0; i < count; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Случайные параметры капли
            const left = Math.random() * 100;
            const height = 10 + Math.random() * 20;
            const delay = Math.random() * 2;
            const duration = 0.7 + Math.random() * 1.3;
            const opacity = 0.3 + Math.random() * 0.5;
            
            drop.style.cssText = `
                left: ${left}%;
                height: ${height}px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${opacity};
            `;
            
            rainContainer.appendChild(drop);
        }
    }

    // Навигация
    function scrollToPage(index) {
        garage.scrollTo({
            left: window.innerWidth * index,
            behavior: 'smooth'
        });
    }

    function updateActiveDot() {
        const currentPage = Math.round(garage.scrollLeft / window.innerWidth);
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPage);
        });
    }

    // Обработчики событий
    function setupEventListeners() {
        // Перетаскивание мышью
        garage.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - garage.offsetLeft;
            scrollLeft = garage.scrollLeft;
        });

        garage.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - garage.offsetLeft;
            garage.scrollLeft = scrollLeft - (x - startX) * 2;
        });

        garage.addEventListener('mouseup', () => {
            isDragging = false;
            updateActiveDot();
        });

        garage.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // Тач-события
        garage.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - garage.offsetLeft;
            scrollLeft = garage.scrollLeft;
        }, { passive: true });

        garage.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - garage.offsetLeft;
            garage.scrollLeft = scrollLeft - (x - startX) * 2;
        }, { passive: true });

        garage.addEventListener('touchend', () => {
            isDragging = false;
            updateActiveDot();
        });

        // Кнопки навигации
        leftArrow.addEventListener('click', () => {
            const currentPage = Math.round(garage.scrollLeft / window.innerWidth);
            scrollToPage(Math.max(0, currentPage - 1));
        });

        rightArrow.addEventListener('click', () => {
            const currentPage = Math.round(garage.scrollLeft / window.innerWidth);
            scrollToPage(Math.min(cars.length - 1, currentPage + 1));
        });

        // Обновление точек при скролле
        garage.addEventListener('scroll', updateActiveDot);

        // Клавиши клавиатуры
        document.addEventListener('keydown', (e) => {
            const currentPage = Math.round(garage.scrollLeft / window.innerWidth);
            if (e.key === 'ArrowLeft') scrollToPage(Math.max(0, currentPage - 1));
            if (e.key === 'ArrowRight') scrollToPage(Math.min(cars.length - 1, currentPage + 1));
        });
    }

    // Запуск приложения
    function init() {
        initGarage();
        setupEventListeners();
        initRainEffect();
    }

    init();

    // Очистка при выходе
    window.addEventListener('beforeunload', () => {
        clearInterval(rainInterval);
    });
});