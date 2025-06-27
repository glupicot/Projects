document.addEventListener('DOMContentLoaded', () => {
    const cars = [
        'toyota-corolla-ceres.png',
        'toyota-carina-ed.png',
        'toyota-chaser.png',
        'toyota-sprinter-marino.png',
        'toyota-sprinter-trueno.png',
        'toyota-crown.png',
        'toyota-soarer.png',
        'toyota-vista.png'
    ];

    const container = document.querySelector('.cars-container');
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;

    cars.forEach((car, index) => {
        const img = document.createElement('img');
        img.src = `assets/icons/${car}`;
        img.className = 'car';
        img.alt = car.replace('.png', '').replace(/-/g, ' ');
        
        // Случайное позиционирование с отступами от краев
        const left = 10 + Math.random() * 80;
        const top = 10 + Math.random() * 70;
        
        // Разные анимации для разнообразия
        const animationType = Math.random() > 0.5 ? 'float' : 'drift';
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        
        img.style.left = `${left}%`;
        img.style.top = `${top}%`;
        img.style.animation = `${animationType} ${duration}s ${delay}s infinite`;
        
        // Случайный размер и поворот
        img.style.width = `${15 + Math.random() * 10}vw`;
        img.style.transform = `rotate(${Math.random() * 15 - 7.5}deg)`;
        
        container.appendChild(img);
    });

    // Параллакс-эффект для фона
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        document.querySelector('.grass-bg').style.backgroundPosition = 
            `${50 + x * 10}% ${50 + y * 10}%`;
    });
});