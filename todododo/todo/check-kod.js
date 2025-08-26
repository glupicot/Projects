document.addEventListener('DOMContentLoaded', function() {
    // 1. Получаем элементы
    const inputs = document.querySelectorAll('.pin-code input');
    const button = document.getElementById('myButton');
    const correctCode = "12345";
    const countdownTime = 180;
    let countdownInterval;
    let remainingTime = countdownTime;

    // 2. Запуск таймера
    function startCountdown() {
        clearInterval(countdownInterval);
        remainingTime = countdownTime;
        updateButton();
        
        countdownInterval = setInterval(() => {
            remainingTime--;
            updateButton();
            
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                button.disabled = false;
                button.textContent = 'Отправить код повторно';
                button.style.cursor = 'pointer';
            }
        }, 1000);
    }

    // 3. Проверка кода
    function checkCode() {
        const code = Array.from(inputs).map(i => i.value).join('');
        if (code === correctCode) {
            clearInterval(countdownInterval);
            button.textContent = 'Подтвердить смену пароля';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.classList.add('active-button');
            return true;
        }
        return false;
    }

    // 4. Обновление кнопки
    function updateButton() {
        const mins = Math.floor(remainingTime / 60);
        const secs = remainingTime % 60;
        button.textContent = `Отправить код повторно через ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        button.disabled = true;
        button.style.cursor = 'not-allowed';
        button.classList.remove('active-button');
    }

    // 5. Обработчики событий
    inputs.forEach((input, i) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && i < inputs.length - 1) {
                inputs[i + 1].focus();
            }
            checkCode();
        });
    });

    button.addEventListener('click', function() {
        if (button.textContent === 'Подтвердить смену пароля' && checkCode()) {
            // Гарантированный переход с проверкой существования страницы
            fetch('new-password.html', { method: 'HEAD' })
                .then(() => {
                    window.location.href = 'new-password.html';
                })
                .catch(() => {
                    console.error('Страница new-password.html не найдена');
                    // Альтернативный вариант перехода:
                    window.location.pathname = '/new-password.html';
                });
        } else if (remainingTime <= 0) {
            startCountdown();
        }
    });

    // Старт
    startCountdown();
});