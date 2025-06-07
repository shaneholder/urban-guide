import React from 'react';
import styles from './NavigationBlade.module.css';
import { SubscriptionDropdown } from './SubscriptionDropdown';
import { useSubscription } from '../context/SubscriptionContext';
import PropTypes from 'prop-types';

export const NavigationBlade = ({navItems}) => {
  const { selectedNav, setSelectedNav } = useSubscription();  

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
