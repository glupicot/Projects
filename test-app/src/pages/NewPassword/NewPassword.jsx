import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePasswordToggle from '../../hooks/usePasswordToggle';
import styles from "./new-password.module.css"; // Исправленный импорт

// Импортируем изображения с правильными путями
import ManImage from '../../assets/images/man.svg';
import VectorIcon from '../../assets/icons/Vector.svg';
import GlazokClosed from '../../assets/icons/glazok-closed.svg';
import GlazokOpen from '../../assets/icons/glazok.svg';

const NewPassword = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [passwordType1, togglePasswordVisibility1] = usePasswordToggle();
  const [passwordType2, togglePasswordVisibility2] = usePasswordToggle();
  const navigate = useNavigate();

  // Проверка совпадения паролей
  useEffect(() => {
    const isMatch = password1 === password2 && password1 !== '';
    setIsButtonActive(isMatch);
  }, [password1, password2]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isButtonActive) {
      console.log('Новый пароль установлен:', password1);
      // Здесь будет логика смены пароля через API
      navigate('/'); // Переходим на главную страницу
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.centerTextBox}>
          <h1>Установка<br/>нового пароля</h1>
          <h2>Придумайте новый пароль для вашей учётной записи</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={styles.input}>
                <div className={styles.svgpass}>
                  <img src={VectorIcon} alt="password-icon" />
                </div>
                <input
                  type={passwordType1}
                  id="myPass"
                  placeholder="Новый пароль"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  required
                />
                <div className={styles.svgeye} onClick={togglePasswordVisibility1}>
                  <img
                    id="myImage"
                    src={passwordType1 === 'password' ? GlazokClosed : GlazokOpen}
                    alt="toggle visibility"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <div className={styles.svgpass}>
                  <img src={VectorIcon} alt="password-icon" />
                </div>
                <input
                  type={passwordType2}
                  id="myPass2"
                  placeholder="Повторите пароль"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                />
                <div className={styles.svgeye2} onClick={togglePasswordVisibility2}>
                  <img
                    id="myImage2"
                    src={passwordType2 === 'password' ? GlazokClosed : GlazokOpen}
                    alt="toggle visibility"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="myButton"
              className={`${styles.button} ${isButtonActive ? styles.activeButton : ''}`}
              disabled={!isButtonActive}
            >
              Сменить пароль
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

export default NewPassword;