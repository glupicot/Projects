// src/components/auth/ChangePasswordForm/ChangePasswordForm.jsx
import { useState, useEffect } from 'react';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import styles from './ChangePasswordForm.module.css';

// Импортируем иконку почты
import MailIcon from '../../../assets/icons/mail.svg';

const ChangePasswordForm = ({ onSubmit, loading = false }) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    setIsValid(validateEmail(email));
  }, [email]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      onSubmit(email);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Смена пароля</h1>
      <h2 className={styles.subtitle}>
        Введите адрес электронной почты,<br/>привязанный к вашей учетной записи
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<img src={MailIcon} alt="mail-icon" />}
          required
          className={styles.emailInput}
        />

        <Button
          type="submit"
          variant={isValid ? "primary" : "disabled"}
          size="large"
          disabled={!isValid || loading}
          loading={loading}
        >
          {loading ? "Отправка..." : "Отправить код"}
        </Button>

        <div className={styles.footer}>
          <p>
            Если у вас нет учетной записи, обратитесь{' '}
            <a href="#" className={styles.link}>к разработчику</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;