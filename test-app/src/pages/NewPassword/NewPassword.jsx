// src/pages/NewPassword/NewPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/common/BackLink/BackLink';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './new-password.module.css';

// Импортируем изображения
import VectorIcon from '../../assets/icons/Vector.svg';
import ManImage from '../../assets/images/man.svg';

const NewPassword = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Проверка совпадения паролей
  useEffect(() => {
    const isMatch = password1 === password2 && password1 !== '';
    setIsButtonActive(isMatch);
  }, [password1, password2]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isButtonActive) {
      setLoading(true);
      try {
        console.log('Новый пароль установлен:', password1);
        // Здесь будет логика смены пароля через API
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/login');
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeveloperClick = () => {
    console.log('Клик по ссылке разработчика');
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <BackLink to="/confirm-code" text="Вернуться к подтверждению кода" />
        
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="Установка нового пароля"
            subtitle="Придумайте новый пароль для вашей учётной записи"
          />

          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <Input
                type="password"
                placeholder="Новый пароль"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                icon={<img src={VectorIcon} alt="password-icon" />}
                showPasswordToggle={true}
                required
              />

              <Input
                type="password"
                placeholder="Повторите пароль"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                icon={<img src={VectorIcon} alt="password-icon" />}
                showPasswordToggle={true}
                required
              />
            </div>

            <Button
              type="submit"
              isActive={isButtonActive}
              loading={loading}
              size="large"
            >
              Сменить пароль
            </Button>

            <AuthFooter
              text="Если у вас нет учетной записи, обратитесь"
              linkText="к разработчику"
              onLinkClick={handleDeveloperClick}
            />
          </form>
        </div>
      </div>

      <AuthIllustration imageSrc={ManImage} />
    </div>
  );
};

export default NewPassword;