// src/components/common/BackLink/BackLink.jsx
import { Link } from 'react-router-dom';
import styles from './BackLink.module.css';
import TudaIcon from '../../../assets/icons/tuda.svg'; // Импортируем иконку

const BackLink = ({ 
  to = "/", 
  text = "Вернуться на стартовую страницу"
}) => {
  return (
    <div className={styles.backLink}>
      <Link to={to} className={styles.backIcon}>
        <img src={TudaIcon} alt="back" />
      </Link>
      <p>{text}</p>
    </div>
  );
};

export default BackLink;