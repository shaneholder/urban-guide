import React from 'react';
import {
  Home24Regular,
  Apps24Regular,
  BoxMultiple24Regular,
  Star24Regular
} from '@fluentui/react-icons';
import styles from './AzureNavigation.module.css';
import { SubscriptionDropdown } from './SubscriptionDropdown';
import { useSubscription } from '../../context/SubscriptionContext';

export const AzureNavigation = () => {
  const { selectedNav, setSelectedNav } = useSubscription();

  const navItems = [
    { icon: <Home24Regular />, label: 'Home' },
    { icon: <Apps24Regular />, label: 'All services' },
    { icon: <BoxMultiple24Regular />, label: 'Resource groups' },
    { icon: <Star24Regular />, label: 'Favorites' }
  ];

  const handleNavClick = (label) => {
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
