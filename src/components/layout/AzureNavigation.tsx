import React from 'react';
import styles from './AzureNavigation.module.css';
import { SubscriptionDropdown } from './SubscriptionDropdown';
import { useSubscription } from '../../context/SubscriptionContext';

export const AzureNavigation: React.FC = () => {
  const { selectedNav, setSelectedNav } = useSubscription();

  const navItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '⚡', label: 'All services' },
    { icon: '📦', label: 'Resource groups' },
    { icon: '⭐', label: 'Favorites' }
  ];

  const handleNavClick = (label: string) => {
    setSelectedNav(label === selectedNav ? null : label);
  };

  return (
    <nav className={styles.nav}>
      <SubscriptionDropdown />
      {navItems.map(item => (
        <button 
          key={item.label} 
          className={`${styles.navItem} ${selectedNav === item.label ? styles.selected : ''}`}
          onClick={() => handleNavClick(item.label)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
