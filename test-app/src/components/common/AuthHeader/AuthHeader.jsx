// src/components/common/AuthHeader/AuthHeader.jsx
import styles from './AuthHeader.module.css';

const AuthHeader = ({ 
  title, 
  subtitle,
  titleSize = "38px",
  subtitleSize = "14px regular",
  titleFont = "Unbounded", // Добавляем проп для шрифта
  subtitleFont = "Unbounded" // Добавляем проп для шрифта
}) => {
  return (
    <div className={styles.authHeader}>
      <h1 
        className={styles.title} 
        style={{ 
          fontSize: titleSize,
          fontFamily: `"${titleFont}"` 
        }}
      >
        {title}
      </h1>
      <h2 
        className={styles.subtitle} 
        style={{ 
          fontSize: subtitleSize,
          fontFamily: `"${subtitleFont}"` 
        }}
      >
        {subtitle}
      </h2>
    </div>
  );
};

export default AuthHeader;