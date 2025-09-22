import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./confirm-code.module.css"; // Исправленное имя файла

// Импортируем изображения с правильными путями
import ManImage from '../../assets/images/man.svg';
import StrelkaIcon from '../../assets/icons/tuda.svg';

const ConfirmCode = () => {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // Таймер обратного отсчета
  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // Проверка кода
  useEffect(() => {
    const isCodeComplete = code.every(digit => digit !== '');
    const isCodeCorrect = code.join('') === '12345'; // Пример кода
    setIsButtonActive(isCodeComplete && isCodeCorrect);
  }, [code]);

  // Обработчик ввода цифр
  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Только цифры

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Автопереход к следующему полю
    if (value !== '' && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Обработчик клавиш
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isButtonActive) {
      navigate('/new-password');
    } else if (remainingTime <= 0) {
      setRemainingTime(180); // Перезапуск таймера
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.strelka}>
          <Link to="/" className={styles.strelkaLink}>
            <img src={StrelkaIcon} alt="Назад" />
          </Link>
          <p>Вернуться на стартовую страницу</p>
        </div>

        <div className={styles.centerTextBox}>
          <h1>Смена пароля</h1>
          <h2>Введите код подтверждения,<br/>присланный в письме на вашу почту</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.pinCode}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputsRef.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="_"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  autoFocus={index === 0}
                  className={styles.codeInput}
                />
              ))}
            </div>

            <button
              type="submit"
              className={`${styles.button} ${isButtonActive ? styles.activeButton : ''}`}
              disabled={!isButtonActive && remainingTime > 0}
            >
              {isButtonActive ? 'Подтвердить смену пароля' : 
               remainingTime > 0 ? `Отправить код повторно через ${formatTime(remainingTime)}` : 
               'Отправить код повторно'}
            </button>

            <div className={styles.wtf}>
              <p>Если у вас нет учетной записи, обратитесь <a href="#" className={styles.buttonLink}>к разработчику</a></p>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.centered}>
          <img src={ManImage} alt="Иллюстрация" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmCode;