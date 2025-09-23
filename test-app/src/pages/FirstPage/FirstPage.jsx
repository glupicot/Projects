// src/pages/FirstPage/FirstPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import TaskForm from '../../components/tasks/TaskForm/TaskForm';
import TaskList from '../../components/tasks/TaskList/TaskList';
import styles from './first-page.module.css';

const FirstPage = () => {
  const { user, logout } = useAuth();
  const { getAllTodos, addTodo, updateTodo, deleteTodo, loading, error } = useApi();
  const [tasks, setTasks] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const todos = await getAllTodos();
      setTasks(todos);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask && editingTask.id) {
        await updateTodo(editingTask.id, taskData);
      } else {
        await addTodo(taskData);
      }
      await loadTasks();
      closeTaskForm();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Ошибка сохранения задачи');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTodo(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Ошибка удаления задачи');
    }
  };

  const handleToggleTask = async (taskId, updates) => {
    try {
      await updateTodo(taskId, updates);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const openTaskForm = (task = null) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setEditingTask(null);
    setIsTaskFormOpen(false);
  };

  // Разделяем задачи на текущие и просроченные
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.dueDate) return true;
    
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= today;
  });

  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  });

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Мои задачи</h1>
          <button 
            className={styles.addButton}
            onClick={() => openTaskForm()}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Новая задача'}
          </button>
        </div>

        <div className={styles.tasksSections}>
          {/* Просроченные задачи */}
          {overdueTasks.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Просрочено</h2>
                <span className={styles.taskCount}>{overdueTasks.length}</span>
              </div>
              <TaskList 
                tasks={overdueTasks}
                onEditTask={openTaskForm}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
              />
            </section>
          )}

          {/* Текущие задачи */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Текущие задачи</h2>
              <span className={styles.taskCount}>{currentTasks.length}</span>
            </div>
            <TaskList 
              tasks={currentTasks}
              onEditTask={openTaskForm}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
            />
          </section>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={closeTaskForm}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </div>
  );
};

export default FirstPage;