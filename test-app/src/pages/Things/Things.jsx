// src/pages/Things/Things.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './things.module.css';

import PersonIcon from '../../assets/icons/Person.svg';
import VectorIcon from '../../assets/icons/Vector.svg';
import ManImage from '../../assets/images/man.svg';

const Things = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');
  setLoading(true);

  try {
    if (login && password) {
      authLogin({ username: login }, 'mock-token');
      navigate('/first-page'); // Должен переходить на FirstPage
    } else {
      setError('Заполните все поля');
    }
  } catch (err) {
    setError('Ошибка авторизации');
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
            title="Things"
            titleFont="BricolageGrotesque"
            titleSize="49.41px"
            subtitle="Делайте больше, волнуйтесь меньше. Теперь все важные задачи будут под рукой с новым ToDo приложением!"
            subtitleFont="Bounded"
          />

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formContainer}>
              <Input
                type="text"
                placeholder="Логин пользователя"
                value={login}
                onChange={(e) => {
                  setLogin(e.target.value);
                  setError('');
                }}
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
                <button 
                  type="button" 
                  className={styles.linkButton}
                  onClick={() => navigate('/change-password')}
                >
                  Восстановить пароль
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <AuthIllustration imageSrc={ManImage} />
    </div>
  );
};

export default Things;