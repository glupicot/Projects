import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import usePasswordToggle from '../hooks/usePasswordToggle';
import '../styles/Login.css';
// Импортируем изображения
import PersonIcon from '../assets/icons/Person.svg';
import VectorIcon from '../assets/icons/Vector.svg';
import GlazokClosed from '../assets/icons/glazok-closed.svg';
import GlazokOpen from '../assets/icons/glazok.svg';
import ManImage from '../assets/images/man.svg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, togglePasswordVisibility] = usePasswordToggle();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Логин:', login, 'Пароль:', password);
    // Здесь будет проверка логина и пароля
    navigate('/first-page'); // Переходим на следующую страницу
  };

  return (
    <div id="root">
      <div className="container">
        <div className="left">
          <div className="center-text-box">
            <h1>ToDoHero</h1>
            <h2>
              Делайте больше, волнуйтесь меньше. Теперь все важные<br />
              задачи будут под рукой с новым ToDo приложением!
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-container">
                <div className="input">
                  <div className="svglogin">
                    <img src={PersonIcon} alt="person-icon" />
                  </div>
                  <input
                    type="text"
                    placeholder="Логин пользователя"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                  />
                </div>

                <div className="input">
                  <div className="svgpass">
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
                  <div className="svgeye" onClick={togglePasswordVisibility}>
                    <img
                      id="myImage"
                      src={passwordType === 'password' ? GlazokClosed : GlazokOpen}
                      alt="toggle visibility"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="button">
                Войти в систему
              </button>

              <div className="wtf">
                <p>
                  Если у вас нет учетной записи, обратитесь{' '}
                  <a href="#" className="button">к разработчику</a>
                </p>
              </div>

              <div className="linkpass">
                <p>
                  Забыли пароль?{' '}
<Link to="/change-password" className="button">
                    Восстановить пароль
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="right">
          <div className="centered"> 
            <img src={ManImage} alt="Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;