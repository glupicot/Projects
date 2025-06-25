document.addEventListener('DOMContentLoaded', () => {
        const cars = [
            { 
                name: "Toyota Corolla Ceres", 
                image: "toyota-corolla-ceres.png",
                info: "Роскошная версия Corolla с кузовом хардтоп"
            },
            { 
                name: "Toyota Carina ED", 
                image: "toyota-carina-ed.png",
                info: "Футуристичный дизайн и передовые технологии 90-х"
            },
            { 
                name: "Toyota Chaser", 
                image: "toyota-chaser.png",
                info: "Легенда дрифта с рядной шестеркой 1JZ"
            },
            { 
                name: "Toyota Sprinter Marino", 
                image: "toyota-sprinter-marino.png",
                info: "Элегантный купе-седан с атмосферным характером"
            },
            { 
                name: "Toyota Sprinter Trueno", 
                image: "toyota-sprinter-trueno.png",
                info: "Знаменитый AE86 из Initial D"
            },
            { 
                name: "Toyota Crown", 
                image: "toyota-crown.png",
                info: "Флагманский седан для истинных ценителей"
            },
            { 
                name: "Toyota Soarer", 
                image: "toyota-soarer.png",
                info: "Роскошное GT-купе с технологиями будущего"
            },
            { 
                name: "Toyota Vista", 
                image: "toyota-vista.png",
                info: "Практичный седан для ежедневных поездок"
            }
        ];

        // Генерация гаража
        const garage = document.getElementById('garage');
        const navDots = document.getElementById('navDots');
        
        cars.forEach((car, index) => {
            // Создаем страницу машины
            const carPage = document.createElement('section');
            carPage.className = 'car-page';
            carPage.id = car.image.split('.')[0];
            carPage.innerHTML = `
    <h2>${car.name}</h2>
    <img src="assets/icons/${car.image}" alt="${car.name}" class="car-image">
    <div class="car-info">${car.info}</div>
`;
            garage.appendChild(carPage);
            
            // Создаем точки навигации
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.index = index;
            navDots.appendChild(dot);
            
            dot.addEventListener('click', () => {
                scrollToPage(index);
            });
        });
        
        // Функции для навигации
        function scrollToPage(index) {
            window.scrollTo({
                left: window.innerWidth * index,
                behavior: 'smooth'
            });
        }
        
        function updateActiveDot() {
            const currentPage = Math.round(window.scrollX / window.innerWidth);
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentPage);
            });
        }
        
        // Инициализация
        updateActiveDot();
        window.addEventListener('scroll', updateActiveDot);
        
        // Автоматический скролл для мобильных устройств
        let isScrolling = false;
        window.addEventListener('wheel', (e) => {
            if (isScrolling) return;
            isScrolling = true;
            
            const direction = e.deltaY > 0 ? 1 : -1;
            const currentPage = Math.round(window.scrollX / window.innerWidth);
            const newPage = Math.max(0, Math.min(cars.length - 1, currentPage + direction));
            
            scrollToPage(newPage);
            setTimeout(() => { isScrolling = false; }, 1000);
        }, { passive: true });
});