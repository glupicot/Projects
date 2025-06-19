document.addEventListener('DOMContentLoaded', function() {
    const pass1 = document.getElementById('myPass');
    const pass2 = document.getElementById('myPass2');
    const button = document.getElementById('myButton');

    function checkPasswords() {
        const isMatch = pass1.value === pass2.value;
        button.classList.toggle('active-button', isMatch);
    }

    pass1.addEventListener('input', checkPasswords);
    pass2.addEventListener('input', checkPasswords);
});