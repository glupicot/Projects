// src/pages/ChangePassword/ChangePassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import BackLink from '../../components/common/BackLink/BackLink';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import EmailInput from '../../components/common/EmailInput/EmailInput';
import Button from '../../components/common/Button/Button';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './change-password.module.css';

import ManImage from '../../assets/images/man.svg';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    setError('');

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        navigate('/confirm-code', { state: { email } });
      } else {
        setError(result.error || 'Ошибка отправки кода');
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
        <BackLink />
        
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="Смена пароля"
            subtitle="Для смены пароля введите адрес электронной почты, привязанный к вашей учётной записи"
          />

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            
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
              Отправить код
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