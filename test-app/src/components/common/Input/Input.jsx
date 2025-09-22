// src/components/common/Input/Input.jsx
import { useState } from 'react';
import styles from './Input.module.css';

// Импортируем иконки
import GlazokClosed from '../../../assets/icons/glazok-closed.svg';
import GlazokOpen from '../../../assets/icons/glazok.svg';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  showPasswordToggle = false,
  className = '',
  error,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className={`${styles.inputGroup} ${className}`}>
      <div className={styles.inputWithIcon}>
        {icon && <div className={styles.inputIcon}>{icon}</div>}
        <input
          type={inputType}
          className={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showPasswordToggle && (
          <div className={styles.eyeIcon} onClick={togglePasswordVisibility}>
            <img
              src={inputType === 'password' ? GlazokClosed : GlazokOpen}
              alt="toggle visibility"
            />
          </div>
        )}
      </div>
      {error && (
        <div className={styles.errorMessage}>
          <div className={styles.errorTriangle}></div>
          <div className={styles.errorText}>{error}</div>
        </div>
      )}
    </div>
  );
};

export default Input;