document.addEventListener('DOMContentLoaded', () => {
    const cars = [
        { 
            img: 'toyota-corolla-ceres.png',
            name: 'Toyota Corolla Ceres',
            description: 'Элегантный седан с "стеклянной крышей"',
            link: 'tictactoe.html'
        },
        { 
            img: 'toyota-carina-ed.png',
            name: 'Toyota Carina ED',
            description: 'Футуристичный дизайн 90-х',
            link: 'garage.html'
        },
        { 
            img: 'toyota-chaser.png',
            name: 'Toyota Chaser',
            description: 'Легенда дрифта и тюнинга',
            link: 'chaser.html'
        },
        { 
            img: 'toyota-sprinter-marino.png',
            name: 'Toyota Sprinter Marino',
            description: 'Роскошь в компактном кузове',
            link: 'marino.html'
        },
        { 
            img: 'toyota-sprinter-trueno.png',
            name: 'Toyota Sprinter Trueno',
            description: 'Знаменитые жучьи фары из Initial D',
            link: 'trueno.html'
        },
        { 
            img: 'toyota-crown.png',
            name: 'Toyota Crown',
            description: 'Японский бизнес-класс',
            link: 'crown.html'
        },
        { 
            img: 'toyota-soarer.png',
            name: 'Toyota Soarer',
            description: 'Гранд туреро с технологиями будущего',
            link: 'soarer.html'
        },
        { 
            img: 'toyota-vista.png',
            name: 'Toyota Vista',
            description: 'Народный любимец',
            link: 'vista.html'
        }
    ];

    const container = document.querySelector('.cars-container');
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;

    cars.forEach((car, index) => {
        const carElement = document.createElement('div');
        carElement.className = 'car-wrapper';
        
        const img = document.createElement('img');
        img.src = `assets/icons/${car.img}`;
        img.className = 'car';
        img.alt = car.name;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'car-tooltip';
        tooltip.innerHTML = `<h3>${car.name}</h3><p>${car.description}</p>`;
        
        carElement.appendChild(img);
        carElement.appendChild(tooltip);
        
        // Случайное позиционирование
        const left = 10 + Math.random() * 80;
        const top = 10 + Math.random() * 70;
        
        // Анимации
        const animationType = Math.random() > 0.5 ? 'float' : 'drift';
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        
        carElement.style.left = `${left}%`;
        carElement.style.top = `${top}%`;
        carElement.style.animation = `${animationType} ${duration}s ${delay}s infinite`;
        carElement.style.width = `${15 + Math.random() * 10}vw`;
        
        // Клик для перехода
        carElement.addEventListener('click', () => {
            window.location.href = car.link;
        });
        
        container.appendChild(carElement);
    });

    // Параллакс-эффект
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        document.querySelector('.grass-bg').style.backgroundPosition = 
            `${50 + x * 10}% ${50 + y * 10}%`;
    });
});