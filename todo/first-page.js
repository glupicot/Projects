document.addEventListener("DOMContentLoaded", function() {
  // Все DOM элементы
  const DOM = {
    toggleButton: document.querySelector(".logo-top"),
    verticalMenu: document.querySelector(".vertical-menu"),
    addNewTaskBtn: document.querySelector(".add-new-tasks"),
    nowMyTasks: document.querySelector(".now-my-tasks"),
    timeOutTasks: document.querySelector(".time-out"),
    overlayContent: document.querySelector(".overlay-content"),
    saveBtn: document.querySelector(".save-note"),
    cancelBtn: document.querySelector(".stop-note"),
    backBtn: document.querySelector(".button-chevron-left"),
    taskTitleInput: document.querySelector('input[type="title"]'),
    taskDescriptionInput: document.querySelector('textarea[type="maintext"]'),
    creationDateInput: document.querySelector('input[type="date"]'),
    dueDateInput: document.getElementById('dueDate'),
    taskSprintInput: document.querySelector('input[type="sprint"]'),
    datePlaceholder: document.querySelector('.date-placeholder')
  };

  // Загрузка задач из localStorage или начальные данные
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    {
      title: "Адаптивная верстка лендинга",
      description: "Лалала я люблю чай",
      dueDate: "2025-05-22",
      sprint: "Работа",
      completed: false,
      expanded: false
    },
    {
      title: "Интеграция с REST API",
      description: "Подключить фронтенд-приложение к внешнему API для получения и отображения списка товаров. Добавить лоадер при загрузке и обработку ошибок сети.",
      dueDate: new Date().toISOString().split('T')[0],
      sprint: "Семья",
      completed: false,
      expanded: false
    },
    {
      title: "Настройка маршрутизации в SPA",
      description: "",
      dueDate: new Date().toISOString().split('T')[0],
      sprint: "Учеба",
      completed: false,
      expanded: false
    },
    {
      title: "Улучшение производительности страницы",
      description: "Провести аудит производительности с помощью Lighthouse. Оптимизировать изображения, настроить lazy loading и минимизировать количество ререндеров компонентов.",
      dueDate: new Date().toISOString().split('T')[0],
      sprint: "Работа",
      completed: false,
      expanded: false
    }
  ];

  // Инициализация приложения
  function init() {
    initMenu();
    initTaskForm();
    syncTasks();
    initDatePlaceholder();
  }

  // Меню
  function initMenu() {
    DOM.toggleButton.addEventListener("click", function() {
      DOM.verticalMenu.classList.toggle("collapsed");
    });
  }

  // Форма задачи
  function initTaskForm() {
    DOM.addNewTaskBtn.addEventListener('click', showTaskForm);
    DOM.saveBtn.addEventListener('click', saveTask);
    DOM.cancelBtn.addEventListener('click', hideTaskForm);
    DOM.backBtn.addEventListener('click', hideTaskForm);
  }

  function showTaskForm() {
    DOM.overlayContent.style.display = 'block';
    DOM.creationDateInput.value = new Date().toISOString().split('T')[0];
    DOM.dueDateInput.value = '';
    DOM.datePlaceholder.style.display = 'block';
  }

  function hideTaskForm() {
    DOM.overlayContent.style.display = 'none';
    DOM.taskTitleInput.value = '';
    DOM.taskDescriptionInput.value = '';
    DOM.dueDateInput.value = '';
    DOM.taskSprintInput.value = '';
  }

  function saveTask() {
    const title = DOM.taskTitleInput.value.trim();
    const dueDate = DOM.dueDateInput.value;
    if (!title || !dueDate) return alert('Заполните заголовок и дату');

    tasks.push({
      title: title,
      description: DOM.taskDescriptionInput.value.trim(),
      dueDate: dueDate,
      sprint: DOM.taskSprintInput.value.trim() || 'Без спринта',
      completed: false,
      expanded: false
    });

    saveAndSync();
    hideTaskForm();
  }

  // Работа с задачами
  function setupTaskEvents(taskElement, taskData) {
    const completeIcon = taskElement.querySelector('.complete-icon');
    const toggleIcon = taskElement.querySelector('.toggle-icon');
    const deleteBtn = taskElement.querySelector('.delete');
    const header = taskElement.querySelector('.task-header');

    completeIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      taskData.completed = !taskData.completed;
      saveAndSync();
    });

    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Удалить задачу?')) {
        tasks = tasks.filter(t => t !== taskData);
        saveAndSync();
      }
    });

    toggleIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      taskData.expanded = !taskData.expanded;
      saveAndSync();
    });

    header.addEventListener('click', function(e) {
      if (![completeIcon, toggleIcon, deleteBtn].includes(e.target)) {
        taskData.expanded = !taskData.expanded;
        saveAndSync();
      }
    });
  }

  function updateTaskState(taskElement, taskData) {
    const isCompleted = taskData.completed;
    const isExpanded = taskData.expanded;

    // Обновление иконок
    taskElement.querySelector('.complete-icon').src = isCompleted 
      ? "../todo/assets/icons/tasks-check.svg" 
      : "../todo/assets/icons/tasks-ellipse.svg";

    taskElement.querySelector('.toggle-icon').src = isExpanded
      ? "../todo/assets/icons/tasks-chevron-down.svg"
      : "../todo/assets/icons/tasks-chevron-right.svg";

    // Обновление текста
    const textElements = [
      taskElement.querySelector('.task-name'),
      taskElement.querySelector('.day'),
      taskElement.querySelector('.sprint')
    ];
    
    textElements.forEach(el => {
      if (el) {
        el.style.color = isCompleted ? '#656896' : '';
        el.style.textDecoration = isCompleted ? 'line-through' : '';
      }
    });

    // Обновление описания
    const description = taskElement.querySelector('.task-description');
    if (description) {
      description.style.maxHeight = isExpanded 
        ? description.scrollHeight + "px" 
        : "0";
    }
  }

  // Синхронизация данных
  function saveAndSync() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    syncTasks();
  }

  function syncTasks() {
    if (!DOM.nowMyTasks || !DOM.timeOutTasks) return;
    
    DOM.nowMyTasks.innerHTML = '';
    const timeOutContainer = DOM.timeOutTasks.querySelector('.task-container') || DOM.timeOutTasks;
    timeOutContainer.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const taskDate = new Date(task.dueDate);
      const isOverdue = taskDate < today && !task.completed;

      if (isOverdue) {
        timeOutContainer.appendChild(taskElement);
      } else {
        DOM.nowMyTasks.appendChild(taskElement);
      }

      setupTaskEvents(taskElement, task);
      updateTaskState(taskElement, task);
    });
  }

  function createTaskElement(task) {
    const date = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let displayDate;
    if (date.toDateString() === today.toDateString()) displayDate = 'Сегодня';
    else if (date.toDateString() === tomorrow.toDateString()) displayDate = 'Завтра';
    else displayDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;

    const isOverdue = date < today && !task.completed;
    const descriptionHtml = task.description ? task.description.replace(/\n/g, '<br>') : '';

    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    if (task.completed) taskElement.classList.add('completed');
    if (task.expanded) taskElement.classList.add('expanded');

    taskElement.innerHTML = `
      <div class="task-header">
        <img src="../todo/assets/icons/tasks-ellipse.svg" class="complete-icon" alt="Статус">
        <span class="task-name">${task.title}</span>
        <img src="../todo/assets/icons/tasks-chevron-down.svg" class="toggle-icon" alt="Развернуть">
        <img src="../todo/assets/icons/delete.svg" class="delete" alt="Удалить">
      </div>
      <div class="task-description">
        <p>${descriptionHtml}</p>
      </div>
      <div class="day-sprint">
        <h2 class="day ${isOverdue ? 'overdue' : ''}">${displayDate}</h2>
        <img class="day-img" src="../todo/assets/icons/point.svg">
        <h2 class="sprint">${task.sprint}</h2>
        <img src="../todo/assets/icons/tasks-repeat-on.svg" class="repeat-icon">
      </div>
    `;
    
    return taskElement;
  }

  // Плейсхолдер для даты
  function initDatePlaceholder() {
    if (!DOM.dueDateInput || !DOM.datePlaceholder) return;

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
  }

  init();
});