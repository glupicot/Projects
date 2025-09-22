import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoAPI from '../../utils/api';
import styles from "./first-page.module.css";

// Импортируем все иконки с правильными путями
import ToDoHeroIcon from '../../assets/icons/to-do-hero.svg';
import ArrowFromRightIcon from '../../assets/icons/arrow-from-right.svg';
import MyTasksIcon from '../../assets/icons/my-tasks.svg';
import TheBellIcon from '../../assets/icons/the-bell.svg';
import AnalyticIcon from '../../assets/icons/analytic.svg';
import SettingsIcon from '../../assets/icons/settings-icon.svg';
import IconWelcome from '../../assets/icons/icon-welcome.svg';
import LogOutIcon from '../../assets/icons/log-out.svg';
import TasksCheckIcon from '../../assets/icons/tasks-check.svg';
import TasksEllipseIcon from '../../assets/icons/tasks-ellipse.svg';
import TasksChevronDownIcon from '../../assets/icons/tasks-chevron-down.svg';
import TasksChevronRightIcon from '../../assets/icons/tasks-chevron-right.svg';
import DeleteIcon from '../../assets/icons/delete.svg';
import PointIcon from '../../assets/icons/point.svg';
import TasksRepeatOnIcon from '../../assets/icons/tasks-repeat-on.svg';
import TasksRepeatOffIcon from '../../assets/icons/tasks-repeat-off.svg';
import ButtonChevronLeftIcon from '../../assets/icons/button-chevron-left.svg';
import ButtonArrowExpandIcon from '../../assets/icons/button-arrow-expand.svg';

const FirstPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [currentEditingTask, setCurrentEditingTask] = useState(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const navigate = useNavigate();

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      // Сначала пробуем загрузить с сервера
      try {
        const serverTasks = await TodoAPI.getAllTodos();
        const formattedTasks = serverTasks.map(task => ({
          id: task._id || task.id,
          name: task.name || 'Без названия',
          description: task.description || '',
          dueDate: task.dueDate || new Date().toISOString().split('T')[0],
          sprint: task.sprint || "Без спринта",
          completed: task.completed || false,
          expanded: false
        }));
        setTasks(formattedTasks);
        setIsOnline(true);
        
        // Сохраняем в localStorage для оффлайн режима
        localStorage.setItem('tasks', JSON.stringify(formattedTasks));
      } catch (error) {
        console.log('Оффлайн режим: загружаем из localStorage');
        const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(localTasks);
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const saveTask = async (taskData) => {
    try {
      let savedTask;
      
      if (currentEditingTask && currentEditingTask.id) {
        // Редактирование существующей задачи
        savedTask = await TodoAPI.updateTodo(currentEditingTask.id, taskData);
      } else {
        // Создание новой задачи
        savedTask = await TodoAPI.addTodo(taskData);
      }
      
      // Обновляем локальное состояние
      await loadTasks();
      setCurrentEditingTask(null);
      
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
      // В оффлайн режиме сохраняем локально
      const newTask = {
        id: currentEditingTask?.id || 'local-' + Date.now(),
        ...taskData,
        completed: false,
        expanded: false,
        synced: false
      };
      
      const updatedTasks = currentEditingTask?.id 
        ? tasks.map(t => t.id === currentEditingTask.id ? newTask : t)
        : [...tasks, newTask];
      
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setCurrentEditingTask(null);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await TodoAPI.deleteTodo(taskId);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
      // Локальное удаление в оффлайн режиме
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await TodoAPI.updateTodo(taskId, { completed });
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
      // Локальное обновление в оффлайн режиме
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const toggleTaskExpand = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, expanded: !task.expanded } : task
    );
    setTasks(updatedTasks);
  };

  // Фильтрация задач
  const currentTasks = tasks.filter(task => 
    !task.completed && new Date(task.dueDate) >= new Date().setHours(0,0,0,0)
  );

  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date().setHours(0,0,0,0)
  );

  return (
    <div className={styles.allPage}>
      {/* Боковое меню */}
      <div className={`${styles.verticalMenu} ${isMenuCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.logoTop} onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}>
          <img src={ToDoHeroIcon} alt="ToDoHero" />
          <p className={styles.toggleBtn}>ToDoHero</p>
          <img 
            src={ArrowFromRightIcon} 
            alt="Toggle" 
            className={isMenuCollapsed ? styles.rotated : ''}
          />
        </div>
        
        <div className={styles.menuContainer}>
          <div className={styles.menuItems}>
            <div className={styles.menuItem}>
              <div className={styles.menuLink}>
                <img src={MyTasksIcon} alt="My Tasks" />
                <span className={styles.menuText}>Мое задание</span>
              </div>
            </div>
            
            <div className={styles.menuItem}>
              <div className={styles.menuLink}>
                <img src={TheBellIcon} alt="Notifications" />
                <span className={styles.menuText}>Уведомление</span>
              </div>
            </div>
            
            <hr className={styles.menuDivider} />
            
            <div className={styles.menuItem}>
              <div className={styles.menuLink}>
                <img src={AnalyticIcon} alt="Analytics" />
                <span className={styles.menuText}>Аналитика</span>
              </div>
            </div>
            
            <div className={styles.menuItem}>
              <div className={styles.menuLink}>
                <img src={SettingsIcon} alt="Settings" />
                <span className={styles.menuText}>Настройки</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.entryDown}>
          <img src={IconWelcome} alt="User" />
          <p className={styles.entry}>Любовь</p>
          <img src={LogOutIcon} alt="Logout" />
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.mainMenuPage}>
        <div className={styles.mainContent}>
          <div className={styles.allMyTasks}>
            <h1>Мои задачи <span className={styles.taskCount}>{tasks.filter(t => !t.completed).length}</span></h1>
            <button 
              className={styles.addNewTasks}
              onClick={() => setCurrentEditingTask({})}
            >
              Новая задача
            </button>
          </div>

          {/* Просроченные задачи */}
          <div className={styles.timeOut}>
            <div className={styles.taskTittleTop}>
              <h1>Просрочено <span className={styles.taskCount}>{overdueTasks.length}</span></h1>
            </div>
            <div className={styles.tasksContainer}>
              {overdueTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onEdit={setCurrentEditingTask}
                  onDelete={deleteTask}
                  onToggle={toggleTaskCompletion}
                  onExpand={toggleTaskExpand}
                  styles={styles}
                />
              ))}
              {overdueTasks.length === 0 && (
                <div className={styles.emptyMessage}>Нет просроченных задач</div>
              )}
            </div>
          </div>

          {/* Текущие задачи */}
          <div className={styles.nowMyTasks}>
            <div className={styles.taskTittleTop}>
              <h1>Текущие задачи <span className={styles.taskCount}>{currentTasks.length}</span></h1>
            </div>
            <div className={styles.tasksContainer}>
              {currentTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onEdit={setCurrentEditingTask}
                  onDelete={deleteTask}
                  onToggle={toggleTaskCompletion}
                  onExpand={toggleTaskExpand}
                  styles={styles}
                />
              ))}
              {currentTasks.length === 0 && (
                <div className={styles.emptyMessage}>Нет текущих задач</div>
              )}
            </div>
          </div>
        </div>

        {/* Модальное окно редактирования */}
        {currentEditingTask && (
          <div className={`${styles.overlayContent} ${styles.visible}`}>
            <TaskForm 
              task={currentEditingTask}
              onSave={saveTask}
              onCancel={() => setCurrentEditingTask(null)}
              styles={styles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент отдельной задачи
const TaskItem = ({ task, onEdit, onDelete, onToggle, onExpand, styles }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date().setHours(0,0,0,0) && !task.completed;

  return (
    <div className={`${styles.task} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.taskHeader}>
        <img 
          src={task.completed ? TasksCheckIcon : TasksEllipseIcon}
          className={styles.completeIcon}
          onClick={() => onToggle(task.id, !task.completed)}
          alt={task.completed ? "Completed" : "Not completed"}
        />
        
        <span 
          className={styles.taskName}
          onClick={() => onEdit(task)}
          style={task.completed ? {textDecoration: 'line-through', color: '#656896'} : {}}
        >
          {task.name}
        </span>
        
        <img 
          src={task.expanded ? TasksChevronDownIcon : TasksChevronRightIcon}
          className={styles.toggleIcon}
          onClick={() => onExpand(task.id)}
          alt={task.expanded ? "Collapse" : "Expand"}
        />
        
        <img 
          src={DeleteIcon}
          className={styles.delete}
          onClick={() => onDelete(task.id)}
          alt="Delete"
        />
      </div>

      {task.expanded && (
        <div className={styles.taskDescription} style={{
          maxHeight: '500px',
          opacity: '1',
          padding: '16px 32px'
        }}>
          <p>{task.description}</p>
        </div>
      )}

      <div className={styles.daySprint}>
        <h2 className={`${styles.day} ${isOverdue ? styles.overdue : ''}`} style={task.completed ? {textDecoration: 'line-through', color: '#656896'} : {}}>
          {formatDate(task.dueDate)}
        </h2>
        <img className={styles.dayImg} src={PointIcon} alt="dot" />
        <h2 className={styles.sprint} style={task.completed ? {textDecoration: 'line-through', color: '#656896'} : {}}>
          {task.sprint}
        </h2>
        <img 
          src={task.completed ? TasksRepeatOffIcon : TasksRepeatOnIcon}
          className={styles.repeatIcon}
          alt="Repeat"
        />
      </div>
    </div>
  );
};

// Форма редактирования задачи
const TaskForm = ({ task, onSave, onCancel, styles }) => {
  const [formData, setFormData] = useState({
    name: task.name || '',
    description: task.description || '',
    dueDate: task.dueDate || '',
    sprint: task.sprint || 'Без спринта'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.dueDate) {
      onSave(formData);
    }
  };

  return (
    <div className={styles.taskFormOverlay}>
      <div className={styles.buttonsTopNewTask}>
        <img className={styles.buttonChevronLeft} src={ButtonChevronLeftIcon} alt="Back" onClick={onCancel} />
        <img className={styles.buttonArrowExpand} src={ButtonArrowExpandIcon} alt="Expand" />
        <a href="" className={styles.buttonShare}>Share</a>
        <img className={styles.delete} src={DeleteIcon} alt="Delete" onClick={() => task.id && onDelete(task.id)} />
      </div>

      <form onSubmit={handleSubmit} className={styles.newTaskButton}>
        <input
          type="text"
          placeholder="Заголовок задачи"
          className={styles.taskTitleInput}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Описание задачи"
          className={styles.taskDescriptionInput}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
        />
        
        <div className={styles.dateInputContainer}>
          <input
            type="date"
            className={styles.dueDateInput}
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            required
            style={{ color: formData.dueDate ? 'var(--color-white)' : 'transparent' }}
          />
          {!formData.dueDate && (
            <span className={styles.datePlaceholder}>Дата исполнения</span>
          )}
        </div>
        
        <input
          type="text"
          placeholder="Спринт не выбран"
          className={styles.taskSprintInput}
          value={formData.sprint}
          onChange={(e) => setFormData({...formData, sprint: e.target.value})}
        />
        
        <button type="submit" className={styles.saveNote}>Сохранить</button>
        <button type="button" className={styles.stopNote} onClick={onCancel}>Отмена</button>
      </form>
    </div>
  );
};

export default FirstPage;