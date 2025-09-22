// src/pages/ConfirmCode/ConfirmCode.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackLink from '../../components/common/BackLink/BackLink';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import ConfirmCodeInput from '../../components/common/ConfirmCodeInput/ConfirmCodeInput';
import Button from '../../components/common/Button/Button';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './confirm-code.module.css';

import ManImage from '../../assets/images/man.svg';

const ConfirmCode = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your@email.com';

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (code.length === 4) {
      setLoading(true);
      try {
        console.log('Код подтверждения:', code);
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/new-password');
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
        <BackLink to="/change-password" text="Вернуться к смене пароля" />
        
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="Код подтверждения"
            subtitle={`Введите 4-значный код, отправленный на ${email}`}
          />

          <form onSubmit={handleSubmit}>
            <ConfirmCodeInput 
              length={4} 
              onCodeChange={handleCodeChange} 
            />

            <Button
              type="submit"
              isActive={code.length === 4}
              loading={loading}
              size="large"
            >
              Подтвердить
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

export default ConfirmCode;