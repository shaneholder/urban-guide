import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/msal";
import ResourceList from "./components/ResourceList";
import LoginButton from "./components/LoginButton";
import styles from './App.module.css';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Azure Resource Manager</h1>
        </header>
        <main className={styles.content}>
          <AuthenticatedTemplate>
            <ResourceList />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <LoginButton />
          </UnauthenticatedTemplate>
        </main>
      </div>
    </MsalProvider>
  );
}

export default App;
