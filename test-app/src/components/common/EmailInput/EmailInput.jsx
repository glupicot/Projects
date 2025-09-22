// src/components/common/EmailInput/EmailInput.jsx
import { useState } from 'react';
import styles from './EmailInput.module.css';

const EmailInput = ({ 
  value, 
  onChange, 
  placeholder = "Введите ваш e-mail",
  required = true,
  onValidityChange 
}) => {
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const isValidEmail = validateEmail(value);
    
    onChange(value);
    setIsValid(isValidEmail);
    onValidityChange?.(isValidEmail);
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className={styles.emailInput}
      />
    </div>
  );
};

export default EmailInput;