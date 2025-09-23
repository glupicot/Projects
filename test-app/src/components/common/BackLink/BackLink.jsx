// src/components/common/BackLink/BackLink.jsx
import { Link } from 'react-router-dom';
import styles from './BackLink.module.css';

const BackLink = ({ 
  to = "/", 
  text = "Вернуться на стартовую страницу"
}) => {
  return (
    <div className={styles.backLink}>
      <Link to={to} className={styles.backIcon}>
        {/* Убираем img, используем только background-image из CSS */}
      </Link>
      <p>{text}</p>
    </div>
  );
};

export default BackLink;