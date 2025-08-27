// main.js
document.addEventListener("DOMContentLoaded", async function() {
  console.log("Script loaded!");

  // Функция для нормализации ID
  function normalizeId(id) {
    if (!id) return null;
    
    if (typeof id === 'object' && id.toString) {
      return id.toString();
    }
    
    if (typeof id === 'string') {
      return id.replace(/['"]/g, '').trim();
    }
    
    return id;
  }

  // Переменная для отслеживания состояния соединения
  let isOnline = true;

  // Проверка соединения с сервером
  async function checkServerConnection() {
    try {
      await fetch('https://jsonplaceholder.typicode.com/todos/1', { 
        method: 'HEAD'
      });
      isOnline = true;
      return true;
    } catch (error) {
      isOnline = false;
      return false;
    }
  }

  // Ждем полной загрузки DOM
  await new Promise(resolve => setTimeout(resolve, 100));

  // Все DOM элементы
  const getDOMElement = () => {
    const elements = {
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
      allTasksTitle: document.querySelector('.all-my-tasks h1')
    };

    const requiredElements = ['toggleButton', 'verticalMenu', 'addNewTaskBtn', 'nowMyTasks', 'timeOutTasks'];
    for (const key of requiredElements) {
      if (!elements[key]) {
        console.error(`Элемент ${key} не найден!`);
      }
    }

    return elements;
  };

  let DOM = getDOMElement();
  if (!DOM) {
    await new Promise(resolve => setTimeout(resolve, 500));
    DOM = getDOMElement();
    if (!DOM) {
      console.error("Критически важные элементы не найдены после ожидания!");
      return;
    }
  }

  // Загружаем задачи
  let tasks = [];
  let currentEditingTaskId = null;

  // Загружаем из localStorage
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Ошибка загрузки из localStorage:", error);
      return [];
    }
  };

  const localTasks = loadFromLocalStorage();
  console.log("Задачи из localStorage:", localTasks);

  // Пытаемся загрузить с сервера
  try {
    await checkServerConnection();
    
    if (isOnline) {
      const serverTodos = await TodoAPI.getAllTodos();
      console.log("Данные с сервера:", serverTodos);
      
      const serverTasks = serverTodos.map(todo => ({
        id: normalizeId(todo._id || todo.id),
        title: todo.name,
        description: todo.description,
        dueDate: todo.dueDate,
        sprint: todo.sprint,
        completed: todo.completed,
        expanded: false,
        synced: true
      }));

      // Объединяем данные
      const localTasksMap = new Map();
      localTasks.forEach(task => {
        localTasksMap.set(normalizeId(task.id), task);
      });

      tasks = serverTasks.map(serverTask => {
        const localTask = localTasksMap.get(normalizeId(serverTask.id));
        if (localTask) {
          return {
            ...serverTask,
            dueDate: localTask.dueDate,
            description: localTask.description,
            sprint: localTask.sprint,
            expanded: localTask.expanded || false,
            synced: true
          };
        }
        return serverTask;
      });

      // Добавляем локальные задачи которых нет на сервере
      localTasks.forEach(localTask => {
        const exists = tasks.some(task => normalizeId(task.id) === normalizeId(localTask.id));
        if (!exists) {
          tasks.push({...localTask, synced: false});
        }
      });
      
    } else {
      // Оффлайн режим - используем только localStorage
      tasks = localTasks.map(task => ({...task, synced: false}));
    }
    
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
    tasks = localTasks.map(task => ({...task, synced: false}));
    isOnline = false;
  }

  // Сохраняем задачи
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      updateTasksCount();
    } catch (error) {
      console.error("Ошибка сохранения в localStorage:", error);
    }
  };

  // Инициализация
  function init() {
    initMenu();
    initTaskForm();
    renderAllTasks();
    initDatePlaceholder();
    updateTasksCount();
    
    // Периодическая проверка соединения
    setInterval(async () => {
      await checkServerConnection();
      if (isOnline) {
        try {
          await syncWithServer();
        } catch (error) {
          console.error("Ошибка синхронизации:", error);
        }
      }
    }, 30000);
  }

  // Синхронизация с сервером
  async function syncWithServer() {
    if (!isOnline) return;

    try {
      // Синхронизируем несинхронизированные задачи
      const unsyncedTasks = tasks.filter(task => !task.synced);
      
      for (const task of unsyncedTasks) {
        try {
          if (task.id && task.id.startsWith('local-')) {
            // Новая задача - создаем на сервере
            const newTodo = await TodoAPI.addTodo({
              name: task.title,
              description: task.description,
              dueDate: task.dueDate,
              sprint: task.sprint,
              completed: task.completed
            });
            
            // Заменяем локальный ID на серверный
            const taskIndex = tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
              tasks[taskIndex].id = normalizeId(newTodo._id);
              tasks[taskIndex].synced = true;
            }
          } else {
            // Существующая задача - обновляем на сервере
            await TodoAPI.updateTodo(normalizeId(task.id), {
              name: task.title,
              description: task.description,
              dueDate: task.dueDate,
              sprint: task.sprint,
              completed: task.completed
            });
            
            const taskIndex = tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
              tasks[taskIndex].synced = true;
            }
          }
        } catch (error) {
          console.error(`Ошибка синхронизации задачи ${task.id}:`, error);
        }
      }
      
      saveToLocalStorage();
      
    } catch (error) {
      console.error("Ошибка синхронизации:", error);
    }
  }

  // Меню
  function initMenu() {
    if (DOM.toggleButton && DOM.verticalMenu) {
      DOM.toggleButton.addEventListener("click", function() {
        DOM.verticalMenu.classList.toggle("collapsed");
      });
    }
  }

  // Форма задачи
  function initTaskForm() {
    if (DOM.addNewTaskBtn) {
      DOM.addNewTaskBtn.addEventListener('click', () => {
        currentEditingTaskId = null;
        showTaskForm();
      });
    }
    
    if (DOM.saveBtn) {
      DOM.saveBtn.addEventListener('click', saveTask);
    }
    
    if (DOM.cancelBtn) {
      DOM.cancelBtn.addEventListener('click', hideTaskForm);
    }
    
    if (DOM.backBtn) {
      DOM.backBtn.addEventListener('click', hideTaskForm);
    }
  }

  function showTaskForm() {
    if (!DOM.overlayContent) return;
    
    DOM.overlayContent.style.display = 'block';
    
    if (currentEditingTaskId) {
      const task = tasks.find(t => normalizeId(t.id) === normalizeId(currentEditingTaskId));
      if (task) {
        DOM.taskTitleInput.value = task.title;
        DOM.taskDescriptionInput.value = task.description;
        DOM.dueDateInput.value = task.dueDate;
        DOM.taskSprintInput.value = task.sprint;
        if (DOM.datePlaceholder) {
          DOM.datePlaceholder.style.display = 'none';
        }
        if (DOM.dueDateInput) {
          DOM.dueDateInput.style.color = 'var(--color-white)';
        }
      }
    } else {
      DOM.taskTitleInput.value = '';
      DOM.taskDescriptionInput.value = '';
      DOM.dueDateInput.value = '';
      DOM.taskSprintInput.value = '';
      if (DOM.datePlaceholder) {
        DOM.datePlaceholder.style.display = 'block';
      }
      if (DOM.dueDateInput) {
        DOM.dueDateInput.style.color = 'transparent';
      }
    }
  }

  function hideTaskForm() {
    if (DOM.overlayContent) {
      DOM.overlayContent.style.display = 'none';
    }
    currentEditingTaskId = null;
  }

  async function saveTask() {
    if (!DOM.taskTitleInput || !DOM.dueDateInput) return;
    
    const title = DOM.taskTitleInput.value.trim();
    const dueDate = DOM.dueDateInput.value;
    
    if (!title) {
      alert('⚠️ Введите заголовок задачи');
      return;
    }
    
    if (!dueDate) {
      alert('⚠️ Выберите дату исполнения');
      return;
    }

    try {
      const taskData = {
        name: title,
        description: DOM.taskDescriptionInput ? DOM.taskDescriptionInput.value.trim() : '',
        dueDate: dueDate,
        sprint: DOM.taskSprintInput ? DOM.taskSprintInput.value.trim() || 'Без спринта' : 'Без спринта',
        completed: false
      };

      if (currentEditingTaskId) {
        // Редактирование существующей задачи
        const taskIndex = tasks.findIndex(t => normalizeId(t.id) === normalizeId(currentEditingTaskId));
        if (taskIndex !== -1) {
          taskData.completed = tasks[taskIndex].completed;
          
          if (isOnline) {
            try {
              await TodoAPI.updateTodo(normalizeId(currentEditingTaskId), taskData);
              tasks[taskIndex].synced = true;
            } catch (error) {
              console.error("Ошибка обновления на сервере:", error);
              tasks[taskIndex].synced = false;
            }
          } else {
            tasks[taskIndex].synced = false;
          }
          
          tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: taskData.name,
            description: taskData.description,
            dueDate: taskData.dueDate,
            sprint: taskData.sprint
          };
        }
      } else {
        // Создание новой задачи
        let newTaskId;
        
        if (isOnline) {
          try {
            const newTodo = await TodoAPI.addTodo(taskData);
            newTaskId = normalizeId(newTodo._id);
          } catch (error) {
            console.error("Ошибка создания на сервере:", error);
            // Генерируем временный ID для оффлайн-режима
            newTaskId = 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          }
        } else {
          newTaskId = 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        tasks.push({
          id: newTaskId,
          title: taskData.name,
          description: taskData.description,
          dueDate: taskData.dueDate,
          sprint: taskData.sprint,
          completed: false,
          expanded: false,
          synced: isOnline
        });
      }

      saveToLocalStorage();
      renderAllTasks();
      hideTaskForm();
      
    } catch (error) {
      console.error("Ошибка сохранения задачи:", error);
      alert("Ошибка сохранения задачи. Проверьте соединение с интернетом.");
    }
  }

  // Обновление счетчиков задач
  function updateTasksCount() {
    if (!DOM.nowTasksTitle || !DOM.timeOutTasksTitle || !DOM.allTasksTitle) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentTasks = tasks.filter(task => {
      if (task.completed) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= today;
    }).length;
    
    const overdueTasks = tasks.filter(task => {
      if (task.completed) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    }).length;

    const totalTasks = tasks.filter(task => !task.completed).length;

    updateSectionCounter(DOM.nowTasksTitle, currentTasks);
    updateSectionCounter(DOM.timeOutTasksTitle, overdueTasks);
    updateTotalCounter(totalTasks);
  }

  function updateSectionCounter(titleContainer, count) {
    if (!titleContainer) return;
    
    const titleElement = titleContainer.querySelector('h1');
    if (!titleElement) return;
    
    let counter = titleElement.querySelector('.task-count');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'task-count';
      titleElement.appendChild(counter);
    }
    counter.textContent = count;
    counter.style.display = count > 0 ? 'inline-flex' : 'none';
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
    counter.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  // Рендер всех задач
  function renderAllTasks() {
    if (!DOM.nowMyTasks || !DOM.timeOutTasks) return;
    
    renderTasksSection(DOM.nowMyTasks, false);
    renderTasksSection(DOM.timeOutTasks, true);
    updateTasksCount();
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

    const sectionTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      const isOverdue = taskDate < today;
      return isOverdueSection ? isOverdue : !isOverdue;
    });

    tasksContainer.innerHTML = '';
    
    if (sectionTasks.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = isOverdueSection ? 'Нет просроченных задач' : 'Нет текущих задач';
      emptyMessage.style.cssText = `
        color: var(--color-white);
        font-family: "VelaSans";
        font-weight: 500;
        font-size: 16px;
        padding: 20px;
        text-align: center;
        opacity: 0.7;
      `;
      tasksContainer.appendChild(emptyMessage);
      return;
    }

    sectionTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      tasksContainer.appendChild(taskElement);
      setupTaskEvents(taskElement, task);
    });
  }

  // Создание элемента задачи
  function createTaskElement(task) {
    const date = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let displayDate;
    if (date.toDateString() === today.toDateString()) {
      displayDate = 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      displayDate = 'Завтра';
    } else {
      displayDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    }

    const isOverdue = date < today && !task.completed;
    const descriptionHtml = task.description ? task.description.replace(/\n/g, '<br>') : '';

    const taskElement = document.createElement('div');
    taskElement.className = `task ${task.completed ? 'completed' : ''} ${task.expanded ? 'expanded' : ''}`;
    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
      <div class="task-header">
        <img src="../todo/assets/icons/${task.completed ? 'tasks-check' : 'tasks-ellipse'}.svg" class="complete-icon" alt="Статус">
        <span class="task-name" style="${task.completed ? 'text-decoration: line-through; color: #656896' : ''}">${task.title}</span>
        <img src="../todo/assets/icons/tasks-${task.expanded ? 'chevron-down' : 'chevron-right'}.svg" class="toggle-icon" alt="Развернуть">
        <img src="../todo/assets/icons/delete.svg" class="delete" alt="Удалить">
      </div>
      <div class="task-description" style="
        max-height: ${task.expanded ? '500px' : '0'};
        opacity: ${task.expanded ? '1' : '0'};
        transition: all 0.4s ease;
        overflow: hidden;      ">
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
    const taskName = taskElement.querySelector('.task-name');
    const header = taskElement.querySelector('.task-header');

    if (completeIcon) {
      completeIcon.addEventListener('click', async function(e) {
        e.stopPropagation();
        const taskIndex = tasks.findIndex(t => normalizeId(t.id) === normalizeId(taskData.id));
        if (taskIndex !== -1) {
          try {
            const newCompletedState = !tasks[taskIndex].completed;
            
            if (isOnline) {
              try {
                await TodoAPI.updateTodo(normalizeId(taskData.id), { 
                  completed: newCompletedState 
                });
                tasks[taskIndex].synced = true;
              } catch (error) {
                console.error("Ошибка обновления на сервере:", error);
                tasks[taskIndex].synced = false;
              }
            } else {
              tasks[taskIndex].synced = false;
            }
            
            tasks[taskIndex].completed = newCompletedState;
            saveToLocalStorage();
            
            // Немедленное визуальное обновление
            updateTaskElementVisualState(taskElement, tasks[taskIndex]);
            
            // Обновляем счетчики
            updateTasksCount();
            
          } catch (error) {
            console.error("Ошибка обновления задачи:", error);
          }
        }
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        if (confirm('Удалить задачу?')) {
          try {
            if (isOnline && taskData.synced) {
              try {
                await TodoAPI.deleteTodo(normalizeId(taskData.id));
              } catch (error) {
                console.error("Ошибка удаления на сервере:", error);
              }
            }
            
            tasks = tasks.filter(t => normalizeId(t.id) !== normalizeId(taskData.id));
            saveToLocalStorage();
            renderAllTasks();
            
          } catch (error) {
            console.error("Ошибка удаления задачи:", error);
          }
        }
      });
    }

    if (toggleIcon) {
      toggleIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        const taskIndex = tasks.findIndex(t => normalizeId(t.id) === normalizeId(taskData.id));
        if (taskIndex !== -1) {
          tasks[taskIndex].expanded = !tasks[taskIndex].expanded;
          saveToLocalStorage();
          
          const description = taskElement.querySelector('.task-description');
          const newToggleIcon = taskElement.querySelector('.toggle-icon');
          
          if (description && newToggleIcon) {
            if (tasks[taskIndex].expanded) {
              description.style.maxHeight = '500px';
              description.style.opacity = '1';
              newToggleIcon.src = '../todo/assets/icons/tasks-chevron-down.svg';
            } else {
              description.style.maxHeight = '0';
              description.style.opacity = '0';
              newToggleIcon.src = '../todo/assets/icons/tasks-chevron-right.svg';
            }
          }
        }
      });
    }

    if (taskName) {
      taskName.addEventListener('click', function(e) {
        e.stopPropagation();
        currentEditingTaskId = taskData.id;
        showTaskForm();
      });
    }

    if (header) {
      header.addEventListener('click', function(e) {
        if (e.target !== completeIcon && e.target !== toggleIcon && e.target !== deleteBtn && e.target !== taskName) {
          currentEditingTaskId = taskData.id;
          showTaskForm();
        }
      });
    }
  }

  // Функция обновления визуального состояния
  function updateTaskElementVisualState(taskElement, task) {
    const completeIcon = taskElement.querySelector('.complete-icon');
    const taskName = taskElement.querySelector('.task-name');
    const repeatIcon = taskElement.querySelector('.repeat-icon');
    const dayElement = taskElement.querySelector('.day');
    const sprintElement = taskElement.querySelector('.sprint');
    
    if (task.completed) {
      taskElement.classList.add('completed');
    } else {
      taskElement.classList.remove('completed');
    }
    
    if (completeIcon) {
      completeIcon.src = task.completed ? 
        '../todo/assets/icons/tasks-check.svg' : 
        '../todo/assets/icons/tasks-ellipse.svg';
    }
    
    if (taskName) {
      if (task.completed) {
        taskName.style.textDecoration = 'line-through';
        taskName.style.color = '#656896';
      } else {
        taskName.style.textDecoration = 'none';
        taskName.style.color = '';
      }
    }
    
    if (repeatIcon) {
      repeatIcon.src = task.completed ? 
        '../todo/assets/icons/tasks-repeat-off.svg' : 
        '../todo/assets/icons/tasks-repeat-on.svg';
    }
    
    if (dayElement) {
      if (task.completed) {
        dayElement.style.textDecoration = 'line-through';
        dayElement.style.color = '#656896';
        dayElement.classList.remove('overdue');
      } else {
        dayElement.style.textDecoration = 'none';
        dayElement.style.color = '';
        
        const taskDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        
        if (taskDate < today) {
          dayElement.classList.add('overdue');
        } else {
          dayElement.classList.remove('overdue');
        }
      }
    }
    
    if (sprintElement) {
      if (task.completed) {
        sprintElement.style.textDecoration = 'line-through';
        sprintElement.style.color = '#656896';
      } else {
        sprintElement.style.textDecoration = 'none';
        sprintElement.style.color = '';
      }
    }
  }

  // Плейсхолдер для даты
  function initDatePlaceholder() {
    if (!DOM.dueDateInput || !DOM.datePlaceholder) return;

    DOM.dueDateInput.style.color = 'transparent';
    
    DOM.dueDateInput.addEventListener('change', function() {
      if (this.value) {
        this.style.color = 'var(--color-white)';
        DOM.datePlaceholder.style.display = 'none';
      } else {
        this.style.color = 'transparent';
        DOM.datePlaceholder.style.display = 'block';
      }
    });

    DOM.dueDateInput.addEventListener('focus', function() {
      this.style.color = 'transparent';
    });

    DOM.datePlaceholder.addEventListener('click', function() {
      DOM.dueDateInput.showPicker();
    });

    if (DOM.dueDateInput.value) {
      DOM.dueDateInput.style.color = 'var(--color-white)';
      DOM.datePlaceholder.style.display = 'none';
    }
  }

  // Запуск приложения
  init();
});