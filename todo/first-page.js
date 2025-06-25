document.addEventListener("DOMContentLoaded", function() {
  console.log("Script loaded!"); // Проверка загрузки скрипта
  
  const toggleButton = document.querySelector(".logo-top");
  const verticalMenu = document.querySelector(".vertical-menu");

  if (!toggleButton || !verticalMenu) {
    console.error("Elements not found!");
    return;
  }

  toggleButton.addEventListener("click", function() {
    console.log("Click detected!"); // Проверка клика
    verticalMenu.classList.toggle("collapsed");
  });
});