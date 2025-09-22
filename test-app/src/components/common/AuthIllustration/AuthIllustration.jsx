// src/components/common/AuthIllustration/AuthIllustration.jsx
import styles from './AuthIllustration.module.css';

const AuthIllustration = ({ imageSrc, alt = "Illustration" }) => {
  return (
    <div className={styles.right}>
      <div className={styles.centered}>
        <img src={imageSrc} alt={alt} />
      </div>
    </div>
  );
};

export default AuthIllustration;