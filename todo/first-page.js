document.addEventListener("DOMContentLoaded", function() {
  // Все DOM элементы
  const DOM = {
    // Элементы меню
    toggleButton: document.querySelector(".logo-top"),
    verticalMenu: document.querySelector(".vertical-menu"),
    
    // Элементы задач
    addNewTaskBtn: document.querySelector(".add-new-tasks"),
    nowMyTasks: document.querySelector(".now-my-tasks"),
    
    // Элементы формы
    overlayContent: document.querySelector(".overlay-content"),
    saveBtn: document.querySelector(".save-note"),
    cancelBtn: document.querySelector(".stop-note"),
    backBtn: document.querySelector(".button-chevron-left"),
    
    // Поля формы
    taskTitleInput: document.querySelector('input[type="title"]'),
    taskDescriptionInput: document.querySelector('textarea[type="maintext"]'),
    creationDateInput: document.querySelector('input[type="date"]'),
    dueDateInput: document.getElementById('dueDate'),
    taskSprintInput: document.querySelector('input[type="sprint"]'),
    datePlaceholder: document.querySelector('.date-placeholder')
  };

  // Проверка основных элементов
  if (!DOM.toggleButton || !DOM.verticalMenu) {
    console.error("Основные элементы не найдены!");
    return;
  }

  // Инициализация приложения
  function init() {
    initMenu();
    initTasks();
    initTaskForm();
    loadTasks();
    initDatePlaceholder();
  }

  // Работа с меню
  function initMenu() {
    DOM.toggleButton.addEventListener("click", function(e) {
      e.stopPropagation();
      DOM.verticalMenu.classList.toggle("collapsed");
    });
  }

  // Работа с задачами
  function initTasks() {
    document.querySelectorAll('.task').forEach(task => {
      setupTaskEventListeners(task);
      updateTaskState(task);
    });
  }

  function setupTaskEventListeners(task) {
    const header = task.querySelector('.task-header');
    const completeIcon = header.querySelector('.complete-icon');
    const toggleIcon = header.querySelector('.toggle-icon');

    completeIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      task.classList.toggle('completed');
      updateTaskState(task);
      saveTasks();
    });

    toggleIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleTask(task);
    });

    header.addEventListener('click', function(e) {
      if (![completeIcon, toggleIcon].includes(e.target)) {
        toggleTask(task);
      }
    });
  }

  function toggleTask(task) {
    task.classList.toggle('expanded');
    updateTaskState(task);
  }

  function updateTaskState(task) {
    const isCompleted = task.classList.contains('completed');
    const isExpanded = task.classList.contains('expanded');
    const header = task.querySelector('.task-header');
    
    // Обновление иконок
    const icons = {
      complete: header.querySelector('.complete-icon'),
      toggle: header.querySelector('.toggle-icon'),
      repeat: task.querySelector('.repeat-icon')
    };

    if (icons.complete) {
      icons.complete.src = isCompleted 
        ? "../todo/assets/icons/tasks-check.svg" 
        : "../todo/assets/icons/tasks-ellipse.svg";
    }
    
    if (icons.toggle) {
      icons.toggle.src = isExpanded
        ? "../todo/assets/icons/tasks-chevron-down.svg"
        : "../todo/assets/icons/tasks-chevron-right.svg";
    }
    
    if (icons.repeat) {
      icons.repeat.src = isCompleted
        ? "../todo/assets/icons/tasks-repeat-off.svg"
        : "../todo/assets/icons/tasks-repeat-on.svg";
    }

    // Обновление описания
    const description = task.querySelector('.task-description');
    if (description) {
      description.style.maxHeight = isExpanded 
        ? description.scrollHeight + "px" 
        : "0";
    }

    // Обновление текста
    const textElements = [
      header.querySelector('.task-name'),
      task.querySelector('.day'),
      task.querySelector('.sprint')
    ];
    
    textElements.forEach(el => {
      if (el) {
        el.style.color = isCompleted ? '#656896' : '';
        el.style.textDecoration = isCompleted ? 'line-through' : '';
      }
    });
  }

  // Работа с формой задачи
  function initTaskForm() {
    // Показать форму
    if (DOM.addNewTaskBtn) {
      DOM.addNewTaskBtn.addEventListener('click', showTaskForm);
    }

    // Скрыть форму
    const hideButtons = [DOM.cancelBtn, DOM.backBtn];
    hideButtons.forEach(btn => {
      if (btn) btn.addEventListener('click', hideTaskForm);
    });

    // Сохранить задачу
    if (DOM.saveBtn) {
      DOM.saveBtn.addEventListener('click', saveTask);
    }
  }

 function showTaskForm() {
  DOM.overlayContent.style.display = 'block';
  const today = new Date();
  DOM.creationDateInput.value = today.toISOString().split('T')[0];
  
  DOM.dueDateInput.value = '';
  DOM.dueDateInput.style.color = 'transparent';
  
  // Удаляем отображение даты, если есть
  const dateDisplay = DOM.dueDateInput.nextElementSibling;
  if (dateDisplay && dateDisplay.classList.contains('date-display')) {
    dateDisplay.remove();
  }
  
  DOM.datePlaceholder.style.display = 'block';
}

  function hideTaskForm() {
    DOM.overlayContent.style.display = 'none';
    DOM.taskTitleInput.value = '';
    DOM.taskDescriptionInput.value = '';
    DOM.dueDateInput.value = '';
    DOM.taskSprintInput.value = '';
    updateDatePlaceholder();
  }

  function saveTask() {
    const title = DOM.taskTitleInput?.value.trim();
    const description = DOM.taskDescriptionInput?.value.trim();
    const dueDate = DOM.dueDateInput?.value;
    const sprint = DOM.taskSprintInput?.value.trim();

    if (!title || !dueDate) {
      alert('Заполните обязательные поля: Заголовок и Дата исполнения');
      return;
    }

    const newTask = createTaskElement(title, description, dueDate, sprint);
    DOM.nowMyTasks.appendChild(newTask);
    
    hideTaskForm();
    setupTaskEventListeners(newTask);
    saveTasks();
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}`;
  }

  function checkOverdue(dateString) {
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  }


  function createTaskElement(title, description, dueDate, sprint) {
    const task = document.createElement('div');
    task.className = 'task';
    
    const displayDate = formatDate(dueDate);
    const isOverdue = checkOverdue(dueDate);
    
    task.innerHTML = `
      <div class="task-header">
        <img src="../todo/assets/icons/tasks-ellipse.svg" class="complete-icon" alt="Статус">
        <span class="task-name">${title}</span>
        <img src="../todo/assets/icons/tasks-chevron-down.svg" class="toggle-icon" alt="Развернуть">
        <img src="../todo/assets/icons/tasks-menu.svg" class="toggle-icon-second" alt="Меню">
      </div>
      <div class="task-description">
        <p>${description || ''}</p>
      </div>
      <div class="day-sprint">
        <h2 class="day ${isOverdue ? 'overdue' : ''}">${displayDate}</h2>
        <img class="day-img" src="../todo/assets/icons/point.svg">
        <h2 class="sprint">${sprint || 'Спринт не выбран'}</h2>
        <img src="../todo/assets/icons/tasks-repeat-on.svg" class="repeat-icon">
      </div>
    `;
    
    return task;
  }

  // Работа с датами
  function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Форматируем дату без "гг дд"
  if (date.toDateString() === today.toDateString()) return 'Сегодня';
  if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
  
  // Форматируем дату в формате DD.MM.YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

  // LocalStorage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
      tasks.push({
        title: task.querySelector('.task-name').textContent,
        description: task.querySelector('.task-description p')?.textContent || '',
        dueDate: task.querySelector('.day').textContent,
        sprint: task.querySelector('.sprint').textContent,
        completed: task.classList.contains('completed')
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks'));
    if (saved?.length) {
      saved.forEach(task => {
        const element = createTaskElement(
          task.title,
          task.description,
          task.dueDate === 'Сегодня' ? new Date().toISOString().split('T')[0] :
          task.dueDate === 'Завтра' ? new Date(Date.now() + 86400000).toISOString().split('T')[0] :
          task.dueDate,
          task.sprint
        );
        if (task.completed) element.classList.add('completed');
        DOM.nowMyTasks.appendChild(element);
      });
    }
  }

  // Плейсхолдер для даты
function initDatePlaceholder() {
  if (!DOM.dueDateInput || !DOM.datePlaceholder) return;

  // Создаем стили для скрытия стандартного текста
  const style = document.createElement('style');
  style.textContent = `
    .due-date-input::-webkit-datetime-edit {
      visibility: hidden;
      width: 0;
      padding: 0;
    }
    .due-date-input::-webkit-inner-spin-button,
    .due-date-input::-webkit-clear-button {
      -webkit-appearance: none;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Создаем элемент для отображения даты
  const dateDisplay = document.createElement('span');
  dateDisplay.className = 'custom-date-display';
  dateDisplay.style.cssText = `
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-white);
    font-family: "VelaSans";
    font-weight: 600;
    font-size: 16px;
    pointer-events: none;
    width: calc(100% - 50px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  DOM.dueDateInput.parentNode.insertBefore(dateDisplay, DOM.dueDateInput.nextSibling);

  // Обработчик изменения даты
  DOM.dueDateInput.addEventListener('change', function() {
    if (this.value) {
      const date = new Date(this.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      dateDisplay.textContent = `${day}.${month}.${date.getFullYear()}`;
      DOM.datePlaceholder.style.display = 'none';
    } else {
      dateDisplay.textContent = '';
      DOM.datePlaceholder.style.display = 'block';
    }
  });

  // Инициализация при загрузке
  if (DOM.dueDateInput.value) {
    DOM.dueDateInput.dispatchEvent(new Event('change'));
  }
}

// Обновляем showTaskForm
function showTaskForm() {
  DOM.overlayContent.style.display = 'block';
  const today = new Date();
  DOM.creationDateInput.value = today.toISOString().split('T')[0];
  
  DOM.dueDateInput.value = '';
  const dateDisplay = document.querySelector('.custom-date-display');
  if (dateDisplay) dateDisplay.textContent = '';
  DOM.datePlaceholder.style.display = 'block';
  
  // Сброс стилей
  DOM.dueDateInput.style.color = 'transparent';
}

document.addEventListener("DOMContentLoaded", function() {
  // Получаем элементы
  const dueDateInput = document.getElementById('dueDate');
  const datePlaceholder = document.querySelector('.date-placeholder');
  
  // Проверяем наличие элементов
  if (!dueDateInput || !datePlaceholder) return;

  // Функция для обновления видимости плейсхолдера
  function updatePlaceholder() {
    if (dueDateInput.value) {
      // Если дата выбрана - скрываем плейсхолдер
      datePlaceholder.style.display = 'none';
      
      // Форматируем дату для красивого отображения
      const date = new Date(dueDateInput.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      // Применяем форматирование (опционально)
      dueDateInput.style.color = 'var(--color-white)';
    } else {
      // Если дата не выбрана - показываем плейсхолдер
      datePlaceholder.style.display = 'block';
      dueDateInput.style.color = 'transparent';
    }
  }

  // Обработчики событий
  dueDateInput.addEventListener('input', updatePlaceholder);
  dueDateInput.addEventListener('change', updatePlaceholder);
  dueDateInput.addEventListener('focus', function() {
    datePlaceholder.style.display = 'none';
  });
  dueDateInput.addEventListener('blur', updatePlaceholder);

  // Инициализация при загрузке
  updatePlaceholder();

  // Дополнительно: Очистка даты по клику на плейсхолдер
  datePlaceholder.addEventListener('click', function() {
    dueDateInput.focus();
  });

  // Для формы: проверка перед отправкой
  const form = dueDateInput.closest('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      if (!dueDateInput.value) {
        e.preventDefault();
        alert('Пожалуйста, выберите дату исполнения');
        dueDateInput.focus();
      }
    });
  }
});



  // Запуск приложения
  init();
});