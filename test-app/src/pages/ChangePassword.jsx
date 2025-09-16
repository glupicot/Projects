import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePasswordToggle from '../hooks/usePasswordToggle';
import '../styles/ChangePassword.css';

// Импортируем изображения
import ManImage from '../assets/images/man.svg';
import MailIcon from '../assets/icons/mail.svg';
import StrelkaIcon from '../assets/icons/tuda.svg';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsButtonActive(value.trim() !== '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isButtonActive) {
      console.log('Email для восстановления:', email);
      // Здесь будет логика отправки email
      navigate('/kod-podtverzhdenia'); // Переходим на страницу подтверждения
    }
  };

  return (
    <div id="root">
      <div className="container">
        <div className="left">
          <div className="strelka">
            <Link to="/" className="strelka-link"></Link>
            
            <p>Вернуться на стартовую страницу</p>
          </div>
          
          <div className="center-text-box">
            <h1>Смена пароля</h1>
            <h2>
              Для смены пароля введите адрес электронной почты,<br />
              привязанный к вашей учётной записи
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="input">
                <input
                  type="email"
                  placeholder="Введите ваш e-mail"
                  id="myInput"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="email-input"
                />
              </div>

              <button
                type="submit"
                id="myButton"
                className={`button ${isButtonActive ? 'active-button' : ''}`}
                disabled={!isButtonActive}
              >
                Отправить код подтверждения
              </button>

              <div className="wtf">
                <p>
                  Если у вас нет учетной записи, обратитесь{' '}
                  <a href="#" className="button">к разработчику</a>
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

export default ChangePassword;