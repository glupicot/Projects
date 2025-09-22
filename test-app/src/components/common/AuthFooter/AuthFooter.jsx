// src/components/common/AuthFooter/AuthFooter.jsx
import styles from './AuthFooter.module.css';

const AuthFooter = ({ 
  text, 
  linkText, 
  onLinkClick,
  href = "#"
}) => {
  return (
    <div className={styles.authFooter}>
      <p>
        {text}{' '}
        <a 
          href={href} 
          className={styles.link}
          onClick={(e) => {
            if (onLinkClick) {
              e.preventDefault();
              onLinkClick();
            }
          }}
        >
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default AuthFooter;