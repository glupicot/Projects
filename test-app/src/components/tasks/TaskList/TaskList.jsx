// src/components/tasks/TaskList/TaskList.jsx
import { useState } from 'react';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskList.module.css';

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  if (tasks.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        Нет задач
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          isExpanded={expandedTaskId === task.id}
          onToggleExpand={() => handleToggleExpand(task.id)}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;