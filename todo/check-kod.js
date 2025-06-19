document.addEventListener('DOMContentLoaded', function() {
    // 1. Получаем все элементы
    const inputs = document.querySelectorAll('.pin-code input');
    const button = document.getElementById('myButton');
    const correctCode = "12345"; // Замените на ваш правильный код

    // 2. Функция проверки кода
    function checkCode() {
        // Собираем код из всех полей ввода
        let enteredCode = '';
        inputs.forEach(input => {
            enteredCode += input.value || '';
        });

        // Проверяем совпадение с правильным кодом
        const isCorrect = enteredCode === correctCode && enteredCode.length === 5;
        
        // Активируем/деактивируем кнопку
        button.classList.toggle('active-button', isCorrect);
        button.style.cursor = isCorrect ? 'pointer' : 'not-allowed';
    }

    // 3. Вешаем обработчики на все поля ввода
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Автопереход к следующему полю
            if (this.value.length === 1) {
                const next = this.nextElementSibling;
                if (next) next.focus();
            }
            checkCode();
        });
    });

    // 4. Первоначальная проверка
    checkCode();
});