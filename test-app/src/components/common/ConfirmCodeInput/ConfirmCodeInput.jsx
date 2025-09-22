// src/components/common/ConfirmCodeInput/ConfirmCodeInput.jsx
import { useRef, useEffect } from 'react';
import styles from './ConfirmCodeInput.module.css';

const ConfirmCodeInput = ({ length = 4, onCodeChange }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleInput = (e, index) => {
    const value = e.target.value;
    
    // Разрешаем только цифры
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, '');
      return;
    }

    // Если введена цифра, переходим к следующему полю
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Собираем полный код
    const code = inputsRef.current.map(input => input?.value || '').join('');
    onCodeChange?.(code);
  };

  const handleKeyDown = (e, index) => {
    // Обработка Backspace
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    pasteData.split('').forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });

    // Переходим к последнему заполненному полю
    const lastIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[lastIndex]?.focus();

    const code = inputsRef.current.map(input => input?.value || '').join('');
    onCodeChange?.(code);
  };

  return (
    <div className={styles.codeContainer}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={el => inputsRef.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={styles.pinInput}
          onInput={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default ConfirmCodeInput;