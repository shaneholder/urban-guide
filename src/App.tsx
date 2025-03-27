import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/msal";
import ResourceList from "./components/ResourceList";
import LoginButton from "./components/LoginButton";

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <h1>Azure Resource Manager</h1>
        <AuthenticatedTemplate>
          <ResourceList />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <LoginButton />
        </UnauthenticatedTemplate>
      </div>
    </MsalProvider>
  );
}

export default App;
