// src/components/common/Button/Button.jsx
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'large',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  isActive = true, // Новый пропс для активации/деактивации
  className = '',
  ...props 
}) => {
  // Определяем финальный вариант стиля
  const finalVariant = !isActive ? 'disabled' : variant;
  
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[finalVariant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading || !isActive}
      {...props}
    >
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;