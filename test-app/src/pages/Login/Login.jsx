// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './login.module.css';

import PersonIcon from '../../assets/icons/Person.svg';
import VectorIcon from '../../assets/icons/Vector.svg';
import ManImage from '../../assets/images/man.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/first-page');
      } else {
        setError(result.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperClick = () => {
    console.log('Контакт с разработчиком');
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="ToDoHero"
            titleFont="BricolageGrotesque"
            titleSize="49.41px"
            subtitle="Делайте больше, волнуйтесь меньше. Теперь все важные задачи будут под рукой с новым ToDo приложением!"
            subtitleFont="Bounded"
          />

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formContainer}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                icon={<img src={PersonIcon} alt="email-icon" />}
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

export default Login;