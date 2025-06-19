document.addEventListener("DOMContentLoaded", () => {
    let eyeicon = document.getElementById("myImage");
    let password = document.getElementById("myPass");
    let eyeicon2 = document.getElementById("myImage2");
    let password2 = document.getElementById("myPass2");

    eyeicon.onclick = function() {
    if(password.type =="password"){
        password.type = "text";
        eyeicon.src = "../todo/assets/icons/glazok.svg";
    }
    else {
        password.type = "password";
        eyeicon.src = "../todo/assets/icons/glazok-closed.svg";
    }
    }

    eyeicon2.onclick = function() {
    if(password2.type =="password"){
        password2.type = "text";
        eyeicon2.src = "../todo/assets/icons/glazok.svg";
    }
    else {
        password2.type = "password";
        eyeicon2.src = "../todo/assets/icons/glazok-closed.svg";
    }
    }
})





