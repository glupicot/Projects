document.addEventListener('DOMContentLoaded', () => {
    const carModels = [
        { 
            img: 'toyota-corolla-ceres.png', 
            name: 'Toyota Corolla Ceres',
            desc: 'Роскошная версия Corolla с кузовом хардтоп'
        },
        { 
            img: 'toyota-carina-ed.png', 
            name: 'Toyota Carina ED',
            desc: 'Футуристичный дизайн и передовые технологии 90-х'
        },
        { 
            img: 'toyota-chaser.png', 
            name: 'Toyota Chaser',
            desc: 'Легенда дрифта с рядной шестеркой 1JZ'
        },
        { 
            img: 'toyota-sprinter-marino.png', 
            name: 'Toyota Sprinter Marino',
            desc: 'Элегантный купе-седан с атмосферным характером'
        },
        { 
            img: 'toyota-sprinter-trueno.png', 
            name: 'Toyota Sprinter Trueno',
            desc: 'Знаменитый AE86 из Initial D'
        },
        { 
            img: 'toyota-crown.png', 
            name: 'Toyota Crown',
            desc: 'Флагманский седан для истинных ценителей'
        },
        { 
            img: 'toyota-soarer.png', 
            name: 'Toyota Soarer',
            desc: 'Роскошное GT-купе с технологиями будущего'
        },
        { 
            img: 'toyota-vista.png', 
            name: 'Toyota Vista',
            desc: 'Практичный седан для ежедневных поездок'
        }
    ];

    const container = document.querySelector('.cars-container');
    const clickArea = document.querySelector('.click-area');
    const title = document.querySelector('.title');
    const message = document.querySelector('.all-gone-message');
    let carsLeft = carModels.length;

    // Создаем машины
    carModels.forEach(model => {
        const carElement = document.createElement('div');
        carElement.className = 'car-wrapper';
        
        const img = document.createElement('img');
        img.src = `../toyota-page/assets/icons/${model.img}`;
        img.className = 'car';
        img.alt = model.name;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'car-tooltip';
        tooltip.innerHTML = `<h3>${model.name}</h3><p>${model.desc}</p>`;
        
        carElement.appendChild(img);
        carElement.appendChild(tooltip);
        
        // Позиционирование
        carElement.style.left = `${10 + Math.random() * 80}%`;
        carElement.style.top = `${10 + Math.random() * 70}%`;
        carElement.style.width = `${15 + Math.random() * 10}vw`;
        carElement.style.animationDelay = `${Math.random() * 2}s`;
        
        // Обработчик клика
        carElement.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Улетает в случайном направлении
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            
            this.style.transform = `
                translate(${Math.cos(angle) * distance}vw, ${Math.sin(angle) * distance}vh)
                rotate(${angle}rad)
            `;
            this.style.opacity = '0';
            this.style.pointerEvents = 'none';
            
            // Удаляем через время анимации
            setTimeout(() => {
                this.remove();
                carsLeft--;
                
                if (carsLeft === 0) {
                    title.style.opacity = '0';
                    setTimeout(() => message.classList.add('show'), 500);
                }
            }, 800);
        });
        
        container.appendChild(carElement);
    });

    // Клик по пустой области
    clickArea.addEventListener('click', function(e) {
        if (e.target === this) { // Только если кликнули именно на область, а не на машину
            const cars = [...document.querySelectorAll('.car-wrapper')];
            if (cars.length === 0) return;
            
            // Находим ближайшую машину
            const closestCar = cars.reduce((closest, car) => {
                const rect = car.getBoundingClientRect();
                const carCenter = {
                    x: rect.left + rect.width/2,
                    y: rect.top + rect.height/2
                };
                const distance = Math.hypot(e.clientX - carCenter.x, e.clientY - carCenter.y);
                return distance < closest.distance ? {car, distance} : closest;
            }, {car: null, distance: Infinity}).car;
            
            if (closestCar) {
                closestCar.click();
            }
        }
    });
});