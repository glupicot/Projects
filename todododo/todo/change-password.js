document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('myInput');
    const button = document.getElementById('myButton');
    input.addEventListener('input', function() {
        const hasText = this.value.trim() !== '';
        button.classList.toggle('active-button', hasText);
    });
});