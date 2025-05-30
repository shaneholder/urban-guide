import React from 'react';
import styles from './AzurePortalLayout.module.css';
import { AzureHeader } from './AzureHeader';
import { AzureNavigation } from './AzureNavigation';
import ResourceGroups from '../ResourceGroups';
import { useSubscription } from '../../context/SubscriptionContext';
import { SubscriptionProvider } from '../../context/SubscriptionContext';

export const AzurePortalLayout = ({ children }) => {
  return (
    <SubscriptionProvider>
      <Layout>{children}</Layout>
    </SubscriptionProvider>
  );
};

const Layout = ({ children }) => {
  const { selectedNav, selectedSubscription } = useSubscription();

  return (
    <div className={styles.layout}>
      <AzureHeader />
      <div className={styles.content}>
        <AzureNavigation />
        <main className={styles.mainContent}>
          {selectedNav === 'Resource groups' && selectedSubscription ? (
            <ResourceGroups subscriptionId={selectedSubscription.subscriptionId} />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};
