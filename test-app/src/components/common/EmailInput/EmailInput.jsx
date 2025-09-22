// src/components/common/EmailInput/EmailInput.jsx
import { useState } from 'react';
import styles from './EmailInput.module.css';
import MailIcon from '../../../assets/icons/mail.svg'; // Правильный импорт

const EmailInput = ({ 
  value, 
  onChange, 
  placeholder = "Введите ваш e-mail",
  required = true,
  onValidityChange 
}) => {
  // ... остальной код
  return (
    <div className={styles.inputContainer}>
      <input
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className={styles.emailInput}
        style={{
          backgroundImage: `url(${MailIcon})` // Используем импортированную иконку
        }}
      />
    </div>
  );
};

export default EmailInput;