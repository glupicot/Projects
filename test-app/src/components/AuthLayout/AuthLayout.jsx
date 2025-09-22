// src/components/common/AuthLayout/AuthLayout.jsx
import styles from './AuthLayout.module.css';

const AuthLayout = ({ leftContent, rightContent }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {leftContent}
      </div>
      <div className={styles.right}>
        {rightContent}
      </div>
    </div>
  );
};

export default AuthLayout;