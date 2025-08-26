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
        return null;
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

  // Загружаем задачи - СНАЧАЛА из localStorage, ПОТОМ синхронизируем с сервером
  let tasks = [];
  let currentEditingTaskId = null;

  // Загружаем из localStorage как основную версию
  const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  console.log("Задачи из localStorage:", localTasks);

  try {
    const serverTodos = await TodoAPI.getAllTodos();
    console.log("Данные с сервера:", serverTodos);
    
    // Объединяем данные: приоритет у localStorage, но добавляем новые задачи с сервера
    const serverTasks = serverTodos.map(todo => ({
      id: normalizeId(todo._id || todo.id),
      title: todo.name,
      description: todo.description,
      dueDate: todo.dueDate,
      sprint: todo.sprint,
      completed: todo.completed,
      expanded: false
    }));

    // Создаем карту задач из localStorage для быстрого поиска
    const localTasksMap = new Map();
    localTasks.forEach(task => {
      localTasksMap.set(normalizeId(task.id), task);
    });

    // Объединяем: берем задачи из localStorage, если они есть, иначе с сервера
    tasks = serverTasks.map(serverTask => {
      const localTask = localTasksMap.get(normalizeId(serverTask.id));
      if (localTask) {
        // Сохраняем наши локальные изменения (дату, описание и т.д.)
        return {
          ...serverTask, // базовые данные с сервера
          dueDate: localTask.dueDate, // наша измененная дата
          description: localTask.description, // наше измененное описание
          sprint: localTask.sprint, // наш измененный спринт
          expanded: localTask.expanded || false // наше состояние развертывания
        };
      }
      return serverTask;
    });

    // Добавляем задачи, которые есть в localStorage но нет на сервере
    localTasks.forEach(localTask => {
      const exists = tasks.some(task => normalizeId(task.id) === normalizeId(localTask.id));
      if (!exists) {
        tasks.push(localTask);
      }
    });
    
    console.log("Объединенные задачи:", tasks);
    
  } catch (error) {
    console.error("Ошибка загрузки задач с сервера, используем localStorage:", error);
    tasks = localTasks;
  }

  // Сохраняем объединенные задачи обратно в localStorage
  saveToLocalStorage();

  // Инициализация
  function init() {
    initMenu();
    initTaskForm();
    renderAllTasks();
    initDatePlaceholder();
    updateTasksCount();
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
        sprint: DOM.taskSprintInput ? DOM.taskSprintInput.value.trim() || 'Без спринта' : 'Без спринта'
      };

      if (currentEditingTaskId) {
        const existingTask = tasks.find(t => normalizeId(t.id) === normalizeId(currentEditingTaskId));
        if (existingTask) {
          taskData.completed = existingTask.completed;
        }

        // ОБНОВЛЯЕМ НА СЕРВЕРЕ ВСЕ ПОЛЯ, ВКЛЮЧАЯ ДАТУ
        const updateResult = await TodoAPI.updateTodo(normalizeId(currentEditingTaskId), taskData);
        console.log("Результат обновления на сервере:", updateResult);
        
        const index = tasks.findIndex(t => normalizeId(t.id) === normalizeId(currentEditingTaskId));
        if (index !== -1) {
          tasks[index] = { 
            ...tasks[index],
            title: taskData.name,
            description: taskData.description,
            dueDate: taskData.dueDate, // Сохраняем новую дату
            sprint: taskData.sprint
          };
        }
      } else {
        taskData.completed = false;
        const newTodo = await TodoAPI.addTodo(taskData);
        
        tasks.push({
          id: normalizeId(newTodo._id),
          title: taskData.name,
          description: taskData.description,
          dueDate: taskData.dueDate,
          sprint: taskData.sprint,
          completed: false,
          expanded: false
        });
      }

      saveToLocalStorage();
      renderAllTasks();
      hideTaskForm();
      
    } catch (error) {
      console.error("Ошибка сохранения задачи:", error);
      alert("Ошибка сохранения задачи: " + error.message);
    }
  }

  // Сохранение в localStorage
  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTasksCount();
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
        margin-left:40px;
        overflow: hidden;
      ">
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
            
            await TodoAPI.updateTodo(normalizeId(taskData.id), { 
              completed: newCompletedState 
            });
            
            tasks[taskIndex].completed = newCompletedState;
            saveToLocalStorage();
            renderAllTasks();
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
            const taskId = normalizeId(taskData.id);
            console.log("Deleting task with normalized ID:", taskId);
            
            await TodoAPI.deleteTodo(taskId);
            
            tasks = tasks.filter(t => normalizeId(t.id) !== taskId);
            
            saveToLocalStorage();
            renderAllTasks();
            
          } catch (error) {
            console.error("Ошибка удаления задачи:", error);
            
            let errorMessage = "Ошибка удаления задачи";
            if (error.message.includes("404")) {
              errorMessage = "Задача не найдена на сервере";
            } else if (error.message.includes("500")) {
              errorMessage = "Ошибка сервера при удалении";
            }
            
            alert(`${errorMessage}\n\nДетали: ${error.message}`);
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