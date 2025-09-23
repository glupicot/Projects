// src/pages/NewPassword/NewPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import BackLink from '../../components/common/BackLink/BackLink';
import AuthHeader from '../../components/common/AuthHeader/AuthHeader';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthFooter from '../../components/common/AuthFooter/AuthFooter';
import AuthIllustration from '../../components/common/AuthIllustration/AuthIllustration';
import styles from './new-password.module.css';

import VectorIcon from '../../assets/icons/Vector.svg';
import ManImage from '../../assets/images/man.svg';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, resetToken } = location.state || {};

  useEffect(() => {
    if (!email || !resetToken) {
      navigate('/change-password');
      return;
    }

    const isMatch = password === confirmPassword && password.length >= 6;
    setIsValid(isMatch);
  }, [password, confirmPassword, email, resetToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      const result = await resetPassword(resetToken, password);
      
      if (result.success) {
        alert('Пароль успешно изменен!');
        navigate('/login');
      } else {
        setError(result.error || 'Ошибка смены пароля');
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
        <BackLink to="/confirm-code" text="Вернуться к подтверждению кода" />
        
        <div className={styles.centerTextBox}>
          <AuthHeader
            title="Новый пароль"
            subtitle="Придумайте новый пароль для вашей учётной записи"
          />

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            
            <Input
              type="password"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<img src={VectorIcon} alt="password-icon" />}
              showPasswordToggle={true}
              required
            />

            <Input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<img src={VectorIcon} alt="password-icon" />}
              showPasswordToggle={true}
              required
            />

            <Button
              type="submit"
              isActive={isValid}
              loading={loading}
              size="large"
            >
              Сменить пароль
            </Button>
          </form>
        </div>
      </div>

      <AuthIllustration imageSrc={ManImage} />
    </div>
  );
};

export default NewPassword;