// src/components/tasks/TaskItem/TaskItem.jsx
import { useState } from 'react';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, onEdit, onDelete, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Нет даты';
    
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

  const isOverdue = () => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const handleCompleteToggle = () => {
    onToggle(task.id, { completed: !task.completed });
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    if (window.confirm('Удалить задачу?')) {
      onDelete(task.id);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.task} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.taskHeader}>
        <img
          src={`/assets/icons/${task.completed ? 'tasks-check.svg' : 'tasks-ellipse.svg'}`}
          className={styles.completeIcon}
          alt="Статус"
          onClick={handleCompleteToggle}
        />
        
        <span 
          className={styles.taskName}
          onClick={handleEdit}
        >
          {task.title || 'Без названия'}
        </span>
        
        <img
          src={`/assets/icons/tasks-chevron-${isExpanded ? 'down' : 'right'}.svg`}
          className={styles.toggleIcon}
          alt="Развернуть"
          onClick={handleToggleExpand}
        />
        
        <img
          src="/assets/icons/delete.svg"
          className={styles.deleteIcon}
          alt="Удалить"
          onClick={handleDelete}
        />
      </div>

      {isExpanded && task.description && (
        <div className={styles.taskDescription}>
          <p>{task.description}</p>
        </div>
      )}

      <div className={styles.taskFooter}>
        <span className={`${styles.date} ${isOverdue() ? styles.overdue : ''}`}>
          {formatDate(task.dueDate)}
        </span>
        
        <img src="/assets/icons/point.svg" className={styles.separator} alt="" />
        
        <span className={styles.sprint}>
          {task.sprint || 'Без спринта'}
        </span>
        
        <img
          src={`/assets/icons/tasks-repeat-${task.completed ? 'off' : 'on'}.svg`}
          className={styles.repeatIcon}
          alt="Повтор"
        />
      </div>
    </div>
  );
};

export default TaskItem;