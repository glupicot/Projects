// src/components/tasks/TaskForm/TaskForm.jsx
import { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sprint, setSprint] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setSprint(task.sprint || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setSprint('');
    }
  }, [task, isOpen]);

  const handleSave = () => {
    if (!title.trim() || !dueDate) {
      alert('⚠️ Заполните обязательные поля');
      return;
    }
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      sprint: sprint.trim() || 'Без спринта',
      completed: task?.completed || false
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlayBackdrop}>
      <div className={styles.overlayContent}>
        <div className={styles.buttonsTop}>
          <img 
            src="/assets/icons/button-chevron-left.svg" 
            alt="Назад" 
            className={styles.button}
            onClick={onClose}
          />
          <img 
            src="/assets/icons/button-arrow-expand.svg" 
            alt="Полный экран" 
            className={styles.button}
          />
          <a href="#" className={styles.shareButton}>Share</a>
          <img 
            src="/assets/icons/delete.svg" 
            alt="Удалить" 
            className={styles.button}
            onClick={onClose}
          />
        </div>
        
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Заголовок задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
          />
          
          <textarea
            placeholder="Описание задачи"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.descriptionInput}
            rows={6}
          />
          
          <div className={styles.dateContainer}>
            <div className={styles.dateInputContainer}>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={styles.dueDateInput}
              />
              {!dueDate && (
                <span className={styles.datePlaceholder}>Дата исполнения</span>
              )}
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Спринт не выбран"
            value={sprint}
            onChange={(e) => setSprint(e.target.value)}
            className={styles.sprintInput}
          />
          
          <div className={styles.formButtons}>
            <button className={styles.saveButton} onClick={handleSave}>
              Сохранить
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;