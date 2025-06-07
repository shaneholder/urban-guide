import React from 'react';
import styles from './Navigation.module.css';
import {NavigationBlade} from './NavigationBlade'; // Assuming NavigationBlade is a component that renders the navigation items
import PropTypes from 'prop-types';

export const Navigation = ({navItems, children }) => {
  return (
    <div className={styles.navigationContainer}>
      <NavigationBlade navItems={navItems}/>
      <div className={styles.navigation}>
        {children}
      </div>
    </div>
  );
};

