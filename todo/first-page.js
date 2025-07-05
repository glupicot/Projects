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



// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для всех задач
    document.querySelectorAll('.task').forEach(task => {
        const header = task.querySelector('.task-header');
        const completeIcon = header.querySelector('.complete-icon');
        const repeatIcon = header.querySelector('.repeat-icon');
        const toggleIcon = header.querySelector('.toggle-icon');
        const taskName = header.querySelector('.task-name');
        
 function updateIcons() {
    // Обновление иконки выполнения
    if (task.classList.contains('completed')) {
        completeIcon.src = '../todo/assets/icons/tasks-check.svg';
        taskName.style.color = '#656896';
        taskName.style.textDecoration = 'line-through';
        
        // Обновление иконки повтора в блоке day-sprint
        const repeatIcon = task.querySelector('.repeat-icon');
        if (repeatIcon) {
            repeatIcon.src = '../todo/assets/icons/tasks-repeat-off.svg';
        }
    } else {
        completeIcon.src = '../todo/assets/icons/tasks-ellipse.svg';
        taskName.style.color = 'white';
        taskName.style.textDecoration = 'none';
        
        // Обновление иконки повтора в блоке day-sprint
        const repeatIcon = task.querySelector('.repeat-icon');
        if (repeatIcon) {
            repeatIcon.src = '../todo/assets/icons/tasks-repeat-on.svg';
        }
    }
    
    // Обновление иконки раскрытия
    if (task.classList.contains('active')) {
        toggleIcon.src = '../todo/assets/icons/tasks-chevron-down.svg';
    } else {
        toggleIcon.src = '../todo/assets/icons/tasks-chevron-right.svg';
    }
}

        
        // Инициализация иконок
        updateIcons();
        
        // Обработчик для иконки выполнения
        completeIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            task.classList.toggle('completed');
            updateIcons();
        });
        
        // Обработчик для иконки раскрытия
        toggleIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            task.classList.toggle('active');
            updateIcons();
        });
        
        // Обработчик для клика по заголовку
        header.addEventListener('click', function(e) {
            if (e.target !== completeIcon && 
                e.target !== toggleIcon && 
                e.target !== repeatIcon) {
                task.classList.toggle('active');
                updateIcons();
            }
        });

        repeatIconr.addEventListener('click', function(e) {
            if (e.target !== completeIcon && 
                e.target !== toggleIcon && 
                e.target !== repeatIcon) {
                task.classList.toggle('active');
                updateIcons();
                }
        });
    });
});