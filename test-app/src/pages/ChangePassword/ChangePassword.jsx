// src/pages/ChangePassword/ChangePassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../components/common/BackLink/BackLink';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import EmailInput from '../../components/common/EmailInput/EmailInput';
import Button from '../../components/common/Button/Button';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './change-password.module.css';

import ManImage from '../../assets/images/man.svg';

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValidEmail) {
      setLoading(true);
      try {
        console.log('Email отправлен:', email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/confirm-code');
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
        <BackLink />
        
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="Смена пароля"
            subtitle="Для смены пароля введите адрес электронной почты, привязанный к вашей учётной записи"
          />

          <form onSubmit={handleSubmit}>
            <EmailInput
              value={email}
              onChange={setEmail}
              onValidityChange={setIsValidEmail}
            />

            <Button
              type="submit"
              isActive={isValidEmail}
              loading={loading}
              size="large"
            >
              Отправить код подтверждения
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

export default ChangePassword;