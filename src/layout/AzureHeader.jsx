import React from 'react';
import styles from './AzureHeader.module.css';

export const AzureHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton}>☰</button>
        <span className={styles.logo}>Microsoft Azure</span>
      </div>
      <div className={styles.right}>
        <input type="search" placeholder="Search" className={styles.search} />
        <button className={styles.iconButton}>?</button>
        <button className={styles.iconButton}>⚙️</button>
        <button className={styles.iconButton}>👤</button>
      </div>
    </header>
  );
};
