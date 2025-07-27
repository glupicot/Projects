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
    datePlaceholder: document.querySelector('.date-placeholder'),
    nowTasksTitle: document.querySelector('.now-my-tasks .task-tittle-top'),
    timeOutTasksTitle: document.querySelector('.time-out .task-tittle-top'),
    allTasksTitle: document.querySelector('.all-my-tasks h1'),
    overlayBackdrop: document.createElement('div')
  };

  // Основной массив задач - единственный источник истины
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentEditingTaskId = null;

  // Добавляем backdrop в DOM
  DOM.overlayBackdrop.className = 'overlay-backdrop';
  document.body.appendChild(DOM.overlayBackdrop);

  // Генератор уникальных ID для задач
  function generateId() {
    return Date.now().toString();
  }

  // Инициализация приложения
  function init() {
    initMenu();
    initTaskForm();
    renderAllTasks();
    initDatePlaceholder();
    updateTasksCount();
    setupCollapseButtons();
  }

  // Меню
  function initMenu() {
    DOM.toggleButton.addEventListener("click", function() {
      DOM.verticalMenu.classList.toggle("collapsed");
    });
  }

  // Форма задачи
  function initTaskForm() {
    DOM.addNewTaskBtn.addEventListener('click', () => {
      currentEditingTaskId = null;
      showTaskForm();
    });
    DOM.saveBtn.addEventListener('click', saveTask);
    DOM.cancelBtn.addEventListener('click', hideTaskForm);
    DOM.backBtn.addEventListener('click', hideTaskForm);
    DOM.overlayBackdrop.addEventListener('click', hideTaskForm);
  }

  function showTaskForm() {
    DOM.overlayContent.style.display = 'block';
    DOM.overlayBackdrop.classList.add('visible');
    document.body.classList.add('modal-open');
    DOM.creationDateInput.value = new Date().toISOString().split('T')[0];
    
    if (currentEditingTaskId) {
      // Заполняем форму данными редактируемой задачи
      const task = tasks.find(t => t.id === currentEditingTaskId);
      if (task) {
        DOM.taskTitleInput.value = task.title;
        DOM.taskDescriptionInput.value = task.description;
        DOM.dueDateInput.value = task.dueDate;
        DOM.taskSprintInput.value = task.sprint;
        DOM.datePlaceholder.style.display = 'none';
      }
    } else {
      // Очищаем форму для новой задачи
      DOM.taskTitleInput.value = '';
      DOM.taskDescriptionInput.value = '';
      DOM.dueDateInput.value = '';
      DOM.taskSprintInput.value = '';
      DOM.datePlaceholder.style.display = 'block';
    }
  }

  function hideTaskForm() {
    DOM.overlayContent.style.display = 'none';
    DOM.overlayBackdrop.classList.remove('visible');
    document.body.classList.remove('modal-open');
    currentEditingTaskId = null;
  }

  function saveTask() {
    const title = DOM.taskTitleInput.value.trim();
    const dueDate = DOM.dueDateInput.value;
    if (!title || !dueDate) return alert('Заполните заголовок и дату');

    const taskData = {
      title: title,
      description: DOM.taskDescriptionInput.value.trim(),
      dueDate: dueDate,
      sprint: DOM.taskSprintInput.value.trim() || 'Без спринта',
      completed: false,
      expanded: false
    };

    if (currentEditingTaskId) {
      // Обновляем существующую задачу
      const index = tasks.findIndex(t => t.id === currentEditingTaskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...taskData };
      }
    } else {
      // Добавляем новую задачу
      taskData.id = generateId();
      tasks.push(taskData);
    }

    saveToLocalStorage();
    renderAllTasks();
    hideTaskForm();
  }

  // Сохранение в localStorage
  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTasksCount();
  }

  // Обновление счетчиков задач
  function updateTasksCount() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.completed && taskDate >= today;
    }).length;
    
    const overdueTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.completed && taskDate < today;
    }).length;

    updateSectionCounter(DOM.nowTasksTitle.querySelector('h1'), currentTasks);
    updateSectionCounter(DOM.timeOutTasksTitle.querySelector('h1'), overdueTasks);
    updateTotalCounter(tasks.length);
  }

  function updateSectionCounter(titleElement, count) {
    let counter = titleElement.querySelector('.task-count');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'task-count';
      titleElement.appendChild(counter);
    }
    counter.textContent = count;
  }

  function updateTotalCounter(count) {
    if (!DOM.allTasksTitle) return;
    
    let counter = DOM.allTasksTitle.querySelector('.total-counter');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'total-counter task-count';
      DOM.allTasksTitle.appendChild(counter);
    }
    counter.textContent = count;
  }

  // Рендер всех задач
  function renderAllTasks() {
    renderTasksSection(DOM.nowMyTasks, false); // Текущие задачи
    renderTasksSection(DOM.timeOutTasks, true); // Просроченные задачи
  }

  // Рендер секции задач
  function renderTasksSection(container, isOverdueSection) {
    if (!container) return;
    
    let tasksContainer = container.querySelector('.tasks-container');
    if (!tasksContainer) {
      tasksContainer = document.createElement('div');
      tasksContainer.className = 'tasks-container';
      container.appendChild(tasksContainer);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Фильтруем задачи для этой секции
    const sectionTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      const isOverdue = taskDate < today;
      return isOverdueSection ? isOverdue : !isOverdue;
    });

    // Сохраняем позицию скролла
    const scrollPosition = document.querySelector('.main-menu-page').scrollTop;

    // Очищаем и перерисовываем
    tasksContainer.innerHTML = '';
    sectionTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      tasksContainer.appendChild(taskElement);
      setupTaskEvents(taskElement, task);
    });

    // Восстанавливаем позицию скролла
    document.querySelector('.main-menu-page').scrollTop = scrollPosition;
  }

  // Создание элемента задачи
  function createTaskElement(task) {
    const date = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let displayDate;
    if (date.toDateString() === today.toDateString()) displayDate = 'Сегодня';
    else if (date.toDateString() === tomorrow.toDateString()) displayDate = 'Завтра';
    else displayDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;

    const isOverdue = date < today;
    const descriptionHtml = task.description ? task.description.replace(/\n/g, '<br>') : '';

    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.dataset.id = task.id;
    if (task.completed) taskElement.classList.add('completed');
    if (task.expanded) taskElement.classList.add('expanded');

    taskElement.innerHTML = `
      <div class="task-header">
        <img src="../todo/assets/icons/${task.completed ? 'tasks-check' : 'tasks-ellipse'}.svg" class="complete-icon" alt="Статус">
        <span class="task-name" style="${task.completed ? 'text-decoration: line-through; color: #656896' : ''}">${task.title}</span>
        <img src="../todo/assets/icons/tasks-${task.expanded ? 'chevron-down' : 'chevron-right'}.svg" class="toggle-icon" alt="Развернуть">
        <img src="../todo/assets/icons/delete.svg" class="delete" alt="Удалить">
      </div>
      <div class="task-description" style="display: ${task.expanded ? 'block' : 'none'}; max-height: ${task.expanded ? '100%' : '0'}; opacity: ${task.expanded ? '1' : '0'}; transition: max-height 0.3s ease, opacity 0.3s ease">
        <p>${descriptionHtml}</p>
      </div>
      <div class="day-sprint">
        <h2 class="day ${isOverdue ? 'overdue' : ''}" style="${task.completed ? 'text-decoration: line-through; color: #656896' : ''}">${displayDate}</h2>
        <img class="day-img" src="../todo/assets/icons/point.svg">
        <h2 class="sprint" style="${task.completed ? 'text-decoration: line-through; color: #656896' : ''}">${task.sprint}</h2>
        <img src="../todo/assets/icons/tasks-repeat-${task.completed ? 'off' : 'on'}.svg" class="repeat-icon">
      </div>
    `;
    
    return taskElement;
  }

  // Настройка событий для задачи
  function setupTaskEvents(taskElement, taskData) {
    const completeIcon = taskElement.querySelector('.complete-icon');
    const toggleIcon = taskElement.querySelector('.toggle-icon');
    const deleteBtn = taskElement.querySelector('.delete');
    const header = taskElement.querySelector('.task-header');

    completeIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      const taskIndex = tasks.findIndex(t => t.id === taskData.id);
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveToLocalStorage();
        renderAllTasks();
      }
    });

    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Удалить задачу?')) {
        tasks = tasks.filter(t => t.id !== taskData.id);
        saveToLocalStorage();
        renderAllTasks();
      }
    });

    toggleIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      const taskIndex = tasks.findIndex(t => t.id === taskData.id);
      if (taskIndex !== -1) {
        tasks[taskIndex].expanded = !tasks[taskIndex].expanded;
        saveToLocalStorage();
        renderAllTasks();
      }
    });

    header.addEventListener('click', function(e) {
      if (![completeIcon, toggleIcon, deleteBtn].includes(e.target)) {
        currentEditingTaskId = taskData.id;
        showTaskForm();
      }
    });
  }

  // Настройка кнопок сворачивания
  function setupCollapseButtons() {
    [DOM.nowTasksTitle, DOM.timeOutTasksTitle].forEach(titleContainer => {
      if (!titleContainer) return;
      
      const container = titleContainer.closest('.now-my-tasks, .time-out');
      if (!container) return;
      
      // Удаляем старую кнопку если есть
      const oldBtn = titleContainer.querySelector('.collapse-btn');
      if (oldBtn) oldBtn.remove();
      
      // Создаем новую кнопку
      const collapseBtn = document.createElement('div');
      collapseBtn.className = 'collapse-btn open-tasks-icon';
      collapseBtn.style.cssText = `
        width: 24px;
        height: 24px;
        background-color: var(--color-task-dark-blue);
        border-radius: 8px;
        padding: 8px;
        cursor: pointer;
        margin-left: auto;
      `;
      
      collapseBtn.innerHTML = `
        <img src="../todo/assets/icons/tasks-chevron-down.svg" 
             class="collapse-icon" 
             style="width: 100%; height: 100%;">
      `;
      
      titleContainer.appendChild(collapseBtn);
      
      // Обработчик события
      collapseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const tasksContainer = container.querySelector('.tasks-container');
        const isCollapsed = tasksContainer.style.display === 'none';
        
        tasksContainer.style.display = isCollapsed ? 'block' : 'none';
        const iconPath = isCollapsed ? 
          '../todo/assets/icons/tasks-chevron-down.svg' : 
          '../todo/assets/icons/tasks-chevron-right.svg';
        collapseBtn.querySelector('img').src = iconPath;
        
        // Сохраняем состояние
        const sectionType = container.classList.contains('now-my-tasks') ? 
          'currentCollapsed' : 'overdueCollapsed';
        localStorage.setItem(sectionType, !isCollapsed);
      });
      
      // Восстанавливаем состояние
      const sectionType = container.classList.contains('now-my-tasks') ? 
        'currentCollapsed' : 'overdueCollapsed';
      const isCollapsed = localStorage.getItem(sectionType) === 'true';
      if (isCollapsed) {
        container.querySelector('.tasks-container').style.display = 'none';
        collapseBtn.querySelector('img').src = '../todo/assets/icons/tasks-chevron-right.svg';
      }
    });
  }

  // Плейсхолдер для даты
  function initDatePlaceholder() {
    if (!DOM.dueDateInput || !DOM.datePlaceholder) return;

    DOM.dueDateInput.style.color = 'transparent';
    
    DOM.dueDateInput.addEventListener('change', function() {
      if (this.value) {
        const date = new Date(this.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        this.style.color = 'var(--color-white)';
        this.value = `${year}-${month}-${day}`;
        DOM.datePlaceholder.style.display = 'none';
      } else {
        this.style.color = 'transparent';
        DOM.datePlaceholder.style.display = 'block';
      }
    });

    DOM.dueDateInput.addEventListener('focus', function() {
      this.style.color = 'transparent';
    });
  }

  init();
});