// src/components/layout/Sidebar/Sidebar.jsx
import { useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: 'my-tasks.svg', text: 'Мое задание', href: '/first-page' },
    { icon: 'the-bell.svg', text: 'Уведомление', href: '/notifications' },
    { icon: 'analytic.svg', text: 'Аналитика', href: '/analytics' },
    { icon: 'settings-icon.svg', text: 'Настройки', href: '/settings' }
  ];

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoTop} onClick={() => setIsCollapsed(!isCollapsed)}>
        <img src="/assets/icons/to-do-hero.svg" alt="ToDoHero" />
        {!isCollapsed && (
          <>
            <p className={styles.toggleBtn}>ToDoHero</p>
            <img 
              src="/assets/icons/arrow-from-right.svg" 
              alt="Toggle" 
              className={styles.toggleArrow}
            />
          </>
        )}
      </div>
      
      <div className={styles.menuContainer}>
        <div className={styles.menuItems}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.menuItem}>
              <a href={item.href} className={styles.menuLink}>
                <span className={styles.menuIcon}>
                  <img src={`/assets/icons/${item.icon}`} alt={item.text} />
                </span>
                {!isCollapsed && (
                  <span className={styles.menuText}>{item.text}</span>
                )}
              </a>
              {index === 1 && !isCollapsed && <hr className={styles.menuDivider} />}
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.entryDown}>
        <img src="/assets/icons/icon-welcome.svg" alt="User" />
        {!isCollapsed && (
          <>
            <p className={styles.entry}>Любовь</p>
            <img src="/assets/icons/log-out.svg" alt="Logout" />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;