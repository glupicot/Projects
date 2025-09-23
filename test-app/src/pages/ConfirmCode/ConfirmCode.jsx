// src/pages/ConfirmCode/ConfirmCode.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
  const [error, setError] = useState('');
  const { verifyResetCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate('/change-password');
    return null;
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyResetCode(email, code);
      
      if (result.success) {
        navigate('/new-password', { 
          state: { 
            email, 
            resetToken: result.token 
          } 
        });
      } else {
        setError(result.error || 'Неверный код');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await requestPasswordReset(email);
      
      if (!result.success) {
        setError(result.error || 'Ошибка отправки кода');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <BackLink to="/change-password" text="Вернуться к смене пароля" />
        
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="Подтверждение кода"
            subtitle={`Введите 6-значный код, отправленный на ${email}`}
          />

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            
            <ConfirmCodeInput 
              length={6}
              onCodeChange={handleCodeChange} 
            />

            <Button
              type="submit"
              isActive={code.length === 6}
              loading={loading}
              size="large"
            >
              Подтвердить
            </Button>

            <div className={styles.resend}>
              <button 
                type="button" 
                className={styles.resendButton}
                onClick={handleResendCode}
                disabled={loading}
              >
                Отправить код повторно
              </button>
            </div>
          </form>
        </div>
      </div>

      <AuthIllustration imageSrc={ManImage} />
    </div>
  );
};

export default ConfirmCode;