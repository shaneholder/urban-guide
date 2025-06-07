import React from 'react';
import styles from './AzurePortalLayout.module.css';
import { AzureHeader } from './AzureHeader';
import { Navigation } from '../components/Navigation';
import ResourceGroups from '../features/ResourceGroups';
import { useSubscription } from '../context/SubscriptionContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import {
  Home24Regular,
  Apps24Regular,
  BoxMultiple24Regular,
  Star24Regular
} from '@fluentui/react-icons';

export const AzurePortalLayout = ({ children }) => {
  return (
    <SubscriptionProvider>
      <Layout>{children}</Layout>
    </SubscriptionProvider>
  );
};

const navItems = [
    { icon: <Home24Regular />, label: 'Home' },
    { icon: <Apps24Regular />, label: 'All services' },
    { icon: <BoxMultiple24Regular />, label: 'Resource groups' },
    { icon: <Star24Regular />, label: 'Favorites' }
  ];

const Layout = ({ children }) => {
  const { selectedNav, selectedSubscription } = useSubscription();

  return (
    <div className={styles.layout}>
      <AzureHeader />
      <Navigation navItems={navItems}>

        <main className={styles.mainContent}>
          {selectedNav === 'Resource groups' && selectedSubscription ? (
            <ResourceGroups subscriptionId={selectedSubscription.subscriptionId} />
          ) : (
            children
          )}
        </main>
      </Navigation>
    </div>
  );
};
