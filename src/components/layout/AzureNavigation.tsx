import React from 'react';
import styles from './AzureNavigation.module.css';
import { SubscriptionDropdown } from './SubscriptionDropdown';

export const AzureNavigation: React.FC = () => {
  const navItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '⚡', label: 'All services' },
    { icon: '📦', label: 'Resource groups' },
    { icon: '⭐', label: 'Favorites' }
  ];

  return (
    <nav className={styles.nav}>
      <SubscriptionDropdown />
      {navItems.map(item => (
        <button key={item.label} className={styles.navItem}>
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
