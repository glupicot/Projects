// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './login.module.css';

// Импортируем изображения
import PersonIcon from '../../assets/icons/Person.svg';
import VectorIcon from '../../assets/icons/Vector.svg';
import ManImage from '../../assets/images/man.svg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log('Логин:', login, 'Пароль:', password);
      // Здесь будет проверка логина и пароля
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
      navigate('/first-page');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperClick = () => {
    console.log('Клик по ссылке разработчика');
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="ToDoHero"
            titleSize="49.41px"
            subtitle="Делайте больше, волнуйтесь меньше. Теперь все важные задачи будут под рукой с новым ToDo приложением!"
          />

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formContainer}>
              <Input
                type="text"
                placeholder="Логин пользователя"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                icon={<img src={PersonIcon} alt="person-icon" />}
                required
              />
              
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<img src={VectorIcon} alt="password-icon" />}
                showPasswordToggle={true}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
            >
              Войти в систему
            </Button>

            <AuthFooter
              text="Если у вас нет учетной записи, обратитесь"
              linkText="к разработчику"
              onLinkClick={handleDeveloperClick}
            />

            <div className={styles.linkpass}>
              <p>
                Забыли пароль?{' '}
                <Link to="/change-password" className={styles.link}>
                  Восстановить пароль
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <AuthIllustration imageSrc={ManImage} />
    </div>
  );
};

export default Login;