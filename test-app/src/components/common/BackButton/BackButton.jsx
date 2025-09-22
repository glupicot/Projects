// src/components/common/BackButton/BackButton.jsx
import { Link } from 'react-router-dom';
import styles from './BackButton.module.css';

const BackButton = ({ to = "/", text = "Вернуться на стартовую страницу" }) => {
  return (
    <div className={styles.backButton}>
      <Link to={to} className={styles.backLink}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </Link>
      <p>{text}</p>
    </div>
  );
};

export default BackButton;