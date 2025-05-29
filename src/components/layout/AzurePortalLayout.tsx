import React from 'react';
import styles from './AzurePortalLayout.module.css';
import { AzureHeader } from './AzureHeader';
import { AzureNavigation } from './AzureNavigation';

interface AzurePortalLayoutProps {
  children: React.ReactNode;
}

export const AzurePortalLayout: React.FC<AzurePortalLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <AzureHeader />
      <div className={styles.content}>
        <AzureNavigation />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};
