import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import usePasswordToggle from '../../hooks/usePasswordToggle';
import styles from './things.module.css';

// Импортируем изображения
import PersonIcon from '../../assets/icons/Person.svg';
import VectorIcon from '../../assets/icons/Vector.svg';
import GlazokClosed from '../../assets/icons/glazok-closed.svg';
import GlazokOpen from '../../assets/icons/glazok.svg';
import ManImage from '../../assets/images/man.svg';

const Things = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [passwordType, togglePasswordVisibility] = usePasswordToggle();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Логин:', login, 'Пароль:', password);
    
    // Проверка логина (заглушка)
    if (login !== "admin") {
      setLoginError(true);
      return;
    }
    
    // Если логин правильный, переходим на страницу смены пароля
    navigate("/change-password");
  };

  return (
    <div id="root">
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.centerTextBox}>
            <h1>Things</h1>
            <h2>
              Делайте больше, волнуйтесь меньше. Теперь все важные<br />
              задачи будут под рукой с новым ToDo приложением!
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formContainer}>
                <div className={styles.input}>
                  <div className={styles.svglogin}>
                    <img src={PersonIcon} alt="person-icon" />
                  </div>
                  <input
                    type="text"
                    placeholder="Логин пользователя"
                    value={login}
                    onChange={(e) => {
                      setLogin(e.target.value);
                      setLoginError(false);
                    }}
                    required
                  />
                  {loginError && (
                    <div className={styles.errorlog}>
                      <div className={styles.triangle}></div>
                      <span className={styles.errorText}>
                        Ошибка: пользователь с таким<br />
                        логином не существует
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.input}>
                  <div className={styles.svgpass}>
                    <img src={VectorIcon} alt="password-icon" />
                  </div>
                  <input
                    type={passwordType}
                    id="myPass"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className={styles.svgeye} onClick={togglePasswordVisibility}>
                    <img
                      id="myImage"
                      src={passwordType === 'password' ? GlazokClosed : GlazokOpen}
                      alt="toggle visibility"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.button}>
                Войти в систему
              </button>

              <div className={styles.wtf}>
                <p>
                  Если у вас нет учетной записи, обратитесь{' '}
                  <a href="#" className={styles.button}>к разработчику</a>
                </p>
              </div>

              <div className={styles.linkpass}>
                <p>
                  Забыли пароль?{' '}
                  <Link to="/change-password" className={styles.button}>
                    Восстановить пароль
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.centered}> 
            <img src={ManImage} alt="Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Things;